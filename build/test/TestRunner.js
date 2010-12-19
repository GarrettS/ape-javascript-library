APE.namespace("APE.test").TestRunner = (function() {
    var test = APE.test,
        Assert = test.Assert,
        activeTest,
        EventPublisher = APE.EventPublisher,
        noop = Function.prototype,
        ITestable = {
            add : function(testable, name) {
                name = name || testable.name || this.name;
                if(typeof testable == "function") {
                    testable = new Test(name, testable, this);
                } 
                this.testableList.push(testable);
                return testable;
            },
            
            start : function() {
                runChildren(this);
            },
            
            toString : function() {
                return this.name;
            }
    };
    
    function Testable(name) {
        this.oncomplete = noop;
        this.onfail = null;
        this.name = "";
        this.id = "";
        this.add = ITestable.add;
        this.start = ITestable.start;
        this.toString = ITestable.toString;
    }

    function TestRunnerC() {
        this.name = "Test Runner";
        this.id = makeId(this.name + " " + (+new Date));
        this.testableList = [];
        this.queuedTestLoads = [];
        this.errorList = [];
        this.addTestCase = function(testCaseData) {
            return this.add(new TestCase(testCaseData, this));
        };
    }

    TestRunnerC.prototype = new Testable;

    // TestRunner is the returned interface object.
    var TestRunner = APE.createMixin(new TestRunnerC, {
            assert : function(constraint, message) {
                activeTest.hasAssert = true;
                Assert.that(constraint, message);  
            },
            fail : function(message) {
                Assert.fail(message);
            },
            runTests : function(testCaseData) {
                var runner = new TestRunnerC;
                addTests(runner, testCaseData);
                new test.TestReporter(runner, document.body);
                runner.start();
            },
            wait : function(callback, delay) {
                if(activeTest && activeTest.wait) {
                    activeTest.wait(callback, delay);
                }
            },
            exitEarly : function(reason) {
                if(!reason) {
                    throw TypeError("TestRunner.exitEarly(msg) called with no message");
                }
                var err = new EarlyExit(reason);
                this.earlyExitMessage = err.message;
                throw err;
            },
            waitForCondition : function(condition, callback, delay) {
                if(activeTest && activeTest.wait) {
                    var maxDelay = delay||4000,
                        resumed,
                        timer = setInterval(function() {
                            if(condition()){
                                resumed = true;
                                clearInterval(timer);
                                callback();
                            }
                        }, 100);
                    
                    activeTest.wait(function(){
                        clearInterval(timer);
                        if(resumed) return; 
                        Assert.fail("Condition not met after " + maxDelay + "ms");
                    }, maxDelay);
                }
            }
    });
        
    function EarlyExit(reason) {
        this.reason = reason;
    }
    
    function addTests(runner, testCaseData) {
        var i, prev, testCase;
        if(typeof testCaseData[0] == "object") {
            for(i = 0; i < testCaseData.length; i++) {
                testCase = runner.addTestCase(testCaseData[i]);
                if(prev) {
                    prev.nextSibling = testCase;
                }
                prev = testCase;
            }
        } else {
            runner.addTestCase(testCaseData);
        }
    }
    
    // # ID and NAME tokens must begin with a letter ([A-Za-z]) 
    // and may be followed by any number of letters, digits ([0-9]), 
    // hyphens ("-"), underscores ("_"), colons (":"), and periods (".").
    function makeId(text) {
        var nonIdChars = /[^A-Za-z0-9\-_:\.]+/g;
        return text.replace(nonIdChars, ":");
    }
        
    TestCase.prototype = APE.createMixin(new Testable, {
        buildTestableList : function(testCaseData) {
            var test, testName, prev;
            for(testName in testCaseData) {
                if(testName.indexOf("test") === 0) {
                    test = this.add(testCaseData[testName], testName);
                    if(prev) {
                        prev.nextSibling = test;
                    }
                    prev = test;
                }
            }
        },
        toString : function() {
            return"TestCase: " + this.name;
        }
    });
    function runChildren(testCaseOrRunner, testOrTestCase) {
     // Run first child, when its done,
     // run next child, etc. 
     // If any child failed, then this failed.
        testOrTestCase = testOrTestCase || testCaseOrRunner.testableList[0];
        if(testOrTestCase) {
            EventPublisher.addCallback(testOrTestCase, "oncomplete", runNextSibling);
            if(testCaseOrRunner.setUp) {
                setUp(testCaseOrRunner);
            }
            if(testOrTestCase instanceof Test) {
                activeTest = testOrTestCase;
            }
            testOrTestCase.start();
        } else {
            testCaseOrRunner.oncomplete();
        }
    }
    
    function runNextSibling() {
        var testCase = this.parent;
        if(testCase.tearDown) {
            // TODO: need to report setup/tearDown errors.
            testCase.tearDownError = tearDown(testCase);
            if(testCase.tearDownError) {
                return;
            }
        }
        if(this.nextSibling) {
            runChildren(testCase, this.nextSibling);
        } else {
            if(this instanceof Test) {
                testDoneHandler(this);
            }
            testCase.oncomplete();
        }
    }

    function testDoneHandler(test) {
        // Test errorList has at most 1 error. 
        if(!test.hasAssert && !test.earlyExitMessage && !test.errorList.length) {
            addErrorToTree(test, new NoAssertionMadeError(test));
        } 
    }
    
    function setUp(testable) {
        try {
            testable.setUp();
        } catch(ex) {
            setUpFailureHandler(testable, ex);
        }
        function setUpFailureHandler(testable, ex) {
            addErrorToTree(testable, new TestError(
                    { 
                        name: "TestError", 
                        message : "setUp for testcase '" 
                                + testable.name 
                                + "' threw " + ex.name 
                                + " " + ex.message
                    }));
            // If setUp fails, it'll probably will fail on the 
            // next test, too. The user needs to fix setUp.
            testable.oncomplete();
        }
    }
    
    function tearDown(testCase) {
        var error;
        try {
            testCase.tearDown();
        } catch(ex) {
            return tearDownFailureHandler(testCase, ex);
        }
        function tearDownFailureHandler(testCase, ex) {
            error = new TestError({ 
                        name: "TestError", 
                        message : "tearDown for testcase '" 
                                + testCase.name 
                                + "' threw " + ex.name 
                                + " " + ex.message
                    });
            addErrorToTree(testCase, error);

            // If tearDown failed, the user needs to fix it;
            // we should not try to run more tests.
            testCase.oncomplete();
            return error;
        }        
    }
        
    function TestCase(testCaseData, parent) {
        
        this.testableList = [];
        this.queuedTestLoads = [];
        
        this.buildTestableList(testCaseData);
        this.name = testCaseData.name;
        this.setUp = testCaseData.setUp;
        this.tearDown = testCaseData.tearDown;
        this.id = makeId(this.name||"unnamed");
        this.parent = parent;
        this.errorList = [];
    }
        
    function handleFailedTestLoad(reqId) {
        reqId = reqId || "";
        var testData = {};
        testData["test " + reqId] = function(){return"Remote TestCase did not load. " + reqId;};
        return testData;
    }
        
    var throwsExp = /@throws\s+([a-zA-Z_$]+[a-zA-Z_$]|$)/;
    function Test(name, func, parent) {
        this.name = name || func.name || parent.testableList.length;
        this.parent = parent;
        this.rootTest = (parent instanceof TestCase) ? this : parent.rootTest;
        this.id = makeId(name);
        this.func = func;
        this.shouldThrow = throwsExp.test(name);
        if(this.shouldThrow) { 
        	var expectedErrorName = throwsExp.exec(name);
            this.expectedErrorName = expectedErrorName && expectedErrorName[1]||"";
        }
        
        this.errorList = [];
    }
    
    function run(test) {
        var errorName,
            error,
            handledError,
            stack = "";

        if(test.func) {
            try {
                test.func();
            } catch(ex) {
                if(ex instanceof EarlyExit) {
                    test.earlyExit = EarlyExit.message;
                    test.oncomplete();
                    return;
                } else if(ex instanceof TestWait) {
                    return;
                }
                handledError = true;
                handleTestRunError(test, ex);
                stack = ex.stack || "";
            }
            if(test.shouldThrow && !handledError) {
                errorName = test.expectedErrorName || "Some error";
                error = new TestError({
                            name:"TestFailure", 
                            message: errorName + " expected but not thrown",
                            stack : stack
                        });
                addErrorToTree(test, error);
            }
            test.oncomplete();
        }
    }
    
    function addErrorToTree(testable, error) {
        for( ; testable; testable = testable.parent) {
            testable.errorList.push(error);
        }
    }
    
    function handleTestRunError(test, ex) {
        if(test.shouldThrow) {
            if(test.expectedErrorName && test.expectedErrorName !== ex.name) {
                addErrorToTree(test, ex);
            }
        } else {
            addErrorToTree(test, ex);
        }
    }
        
    function TestError(error) {
        this.name = error.name;
        this.message = error.message;
        this.stack = error.stack || "(not available)";
    }
    (TestError.prototype = new Error).constructor = TestError;

    function NoAssertionMadeError(test) {
        this.name = "NoAssertionMadeError";
        this.message = '"' + test.toString() + '". Expected a call to TestRunner.assert.';
    }
    (NoAssertionMadeError.prototype = new Error).constructor = NoAssertionMadeError;
    
    Test.prototype = APE.createMixin(new Testable(), {
        
        wait : function(callback, delay) {
            var name = "Wait",
                deferred = new Test(name, callback, this),
                test = this;
            EventPublisher.addCallback(deferred, "oncomplete", deferredComplete);

            deferred.startTimer = setTimeout(function(){
                deferred.start();
            }, delay);
            
            function deferredComplete(error) {
                if(error) {
                    addErrorToTree(test, error);
                }
                test.oncomplete();
            }
            throw new TestWait();
        },
        
        toString : function() {
            return "Test: " + this.name;
        },
        
        start : function() {
            run(this);
        }
    });
    function TestWait() {}
    (TestWait.prototype = new Error).constructor = TestWait;
    return TestRunner;
}());