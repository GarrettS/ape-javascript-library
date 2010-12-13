APE.namespace("APE.test").defineCustomFactory("TestRunner", function(TestRunner) {
    
    var Assert = APE.test.Assert;

    APE.createMixin(TestRunner, {
        assert : function(constraint, message) {
            activeTest.hasAssert = true;
            Assert.that(constraint, message);  
        },
        fail : function(message){
            Assert.fail(message);
        },
        runTests : function(testCaseData) {
            var runner = TestRunner.getById("Test Runner");
            
            addTests(runner, testCaseData);
            new APE.test.TestReporter(runner, document.body);
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
        
    function getConstructor(TestRunnerFactory) {        
        return TestRunnerC;
    }
    
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
    
    var activeTest,
        Assert = APE.test.Assert,
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
        this.onload = noop;
        this.onfail = null;
        this.name = "";
        this.id = "";
        this.add = ITestable.add;
        this.start = ITestable.start;
        this.toString = ITestable.toString;
        this.addCallback = addCallback;
    }

    // # ID and NAME tokens must begin with a letter ([A-Za-z]) 
    // and may be followed by any number of letters, digits ([0-9]), 
    // hyphens ("-"), underscores ("_"), colons (":"), and periods (".").
    function makeId(text) {
        var nonIdChars = /[^A-Za-z0-9\-_:\.]+/g;
        return text.replace(nonIdChars, ":");
    }
    
    function addCallback(type, callback) {
        EventPublisher.add(this, type, callback);
    }
    
    function TestRunnerC() {
        this.name = "Test Runner";
        this.id = makeId(this.name);
        this.testableList = [];
        this.queuedTestLoads = [];
        this.errorList = [];
    }

    TestRunnerC.prototype = APE.createMixin(new Testable(), {
        
        addTestCase : function(testCaseData) {
            return this.add(new TestCase(testCaseData, this));
        },
        
        addRemoteTestCase : function(url) {
            loadRemoteTestCase(this, url);
        }
    });
    
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
            EventPublisher.add(testOrTestCase, "oncomplete", runNextSibling);
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
        if(this.error) {
            testCase.errorList.push(new TestError({name: "TestError", message : ""}));
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
        if(!test.hasAssert && !test.earlyExitMessage) {
            test.errorList.push(new NoAssertionMadeError(test));
        } 
    }
    
    function setUp(testable) {
        try {
            testable.setUp();
        } catch(ex) {
            setUpFailureHandler(testable, ex);
        }
        function setUpFailureHandler(testable, ex) {
            testable.errorList.push(new TestError(
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
            return setUpFailureHandler(testCase, ex);
        }
        function setUpFailureHandler(testCase, ex) {
            error = new TestError({ 
                        name: "TestError", 
                        message : "tearDown for testcase '" 
                                + testCase.name 
                                + "' threw " + ex.name 
                                + " " + ex.message
                    });
            testCase.errorList.push(error);
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
    
    // This should block running until loaded.
    function loadRemoteTestCase(testCase, testURI) {
        var reqData = {method: "GET", action: testURI},
            req = APE.ajax.AsyncRequest.getById(testURI, reqData);
        testCase.queuedTestLoads.push(req);
        EventPublisher.add(req, "oncomplete", addRemoteTestToList);
        req.send();

        function addRemoteTestToList() {
            var source = req.req.responseText, 
                reqId = req.id,
                testData;
            
            if(source) {
                try {
                    testData = Function("return (" + source + ")")();
                } catch(ex) {
                    testData = handleFailedTestLoad(reqId);
                }

            } else {
                testData = handleFailedTestLoad();
            }
            testCase.add(testData);
            //newTestList = buildTestableList(testCase, testData);
            if(testCase.queuedTestLoads.length == 0) {
                 testCase.onload();
            }            
        }
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
        this.error = null;
    }
    
    function run(test) {
        var error,
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
                error = test.expectedErrorName || "Some error";
                test.error = new TestError({
                            name:"TestFailure", 
                            message: error + " expected but not thrown",
                            stack : stack
                        });
                test.errorList = [test.error];
            }
            test.oncomplete();
        }
    }
    
    function handleTestRunError(test, ex) {
        if(test.shouldThrow) {
            if(test.expectedErrorName && test.expectedErrorName !== ex.name) {
                test.error = ex;
            } 
        } else {
            test.error = ex;
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
            EventPublisher.add(deferred, "oncomplete", deferredComplete);

            deferred.startTimer = setTimeout(function(){
                deferred.start();
            }, delay);
            
            function deferredComplete(error) {
                test.error = error;
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
    return getConstructor;
});