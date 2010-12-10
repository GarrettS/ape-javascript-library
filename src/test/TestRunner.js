APE.namespace("APE.test").defineCustomFactory("TestRunner", function(TestRunner) {
    
    TestRunner.newInstance = function(){ 
        return TestRunner.getById(new Date);
    };
    TestRunner.runTests = runTests;

    function getConstructor(TestRunnerFactory) {        
        return TestRunnerC;
    }
    
    function runTests(testCaseData) {
        var runner = TestRunner.getById("Test Runner");
        
        addTests(runner, testCaseData);
        new APE.test.TestReporter(runner, document.body);
        runner.start();
    }
    
    function addTests(runner, testCaseData) {
        if(typeof testCaseData[0] == "object") {
            for(var i = 0; i < testCaseData.length; i++) {
                runner.addTestCase(testCaseData[i]);
            }
        } else {
            runner.addTestCase(testCaseData);
        }
    }
    
    var EventPublisher = APE.EventPublisher,
        noop = Function.prototype,
        ITestable = {
            add : function(testable) {
                return testableAdd(this, testable);
            },
            
            start : function() {
                runChild(this);
            },
            
            toString : function() {
                return this.name;
            }
    };
    
    /* Add anything matching ITestable interface (start, run). */
    function testableAdd(parent, testable, name) {
        name = name || testable.name || parent.name + "." + parent.testableList.length;
        if(typeof testable == "function") {
            testable = new Test(name, testable, parent);
        } 
        parent.testableList.push(testable);
        return parent;
    }
    
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
        
        // TODO: This is not being used/tested - use it or lose it.
        addSuite : function(testSuite) {
            this.add(new TestSuite(testSuite, this));
            return this;
        },
        
        addTestCase : function(testCaseData) {
            return this.add(new TestCase(testCaseData, this));
        },
        
        addRemoteTestCase : function(url) {
            loadRemoteTestCase(this, url);
        }
    });
    
    TestSuite.prototype = new Testable();
    TestCase.prototype = new Testable();
    
    function runChild(testable, counter) {
     // Run first child, when its done,
     // run next child, etc. 
     // If any child failed, then this failed.
         counter = counter || 0;
        var testableChild = testable.testableList[counter];
        //console.log( testableChild , testable)
        if(testableChild) {
            EventPublisher.add(testableChild, "oncomplete", _runNextSibling);
            if(testable.setUp) {
                setUp(testable);
            }
            testableChild.start();
        } else {
            testable.oncomplete();
        }
        function _runNextSibling() {
            if(testable.tearDown) {
               tearDown(testable);
            }
            if(this.errorList.length > 0) {
                testable.errorList.push(new TestError({name: "TestError", message : ""}, this));
            }
            if(++counter in testable.testableList) {
                runChild(testable, counter);
            } else {
                testable.oncomplete();
            }
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
                    }, this));
            // If setUp fails, it'll probably will fail on the 
            // next test, too. The user needs to fix setUp.
            testable.oncomplete();
        }
    }
    
    function tearDown(testable) {
        try {
            testable.tearDown();
        } catch(ex) {
            setUpFailureHandler(testable, ex);
        }
        function setUpFailureHandler(testable, ex) {
            testable.errorList.push(new TestError(
                    { 
                        name: "TestError", 
                        message : "tearDown for testcase '" 
                                + testable.name 
                                + "' threw " + ex.name 
                                + " " + ex.message
                    }, this));
            // If tearDown failed, the user needs to fix it;
            // we should not try to run more tests.
            testable.oncomplete();
        }        
    }
    
    function TestSuite() {
        this.testableList = [];
    }
    
    function TestCase(testCaseData, parent) {
        
        this.testableList = [];
        this.queuedTestLoads = [];
        
        buildTestableList(this, testCaseData);
        this.name = testCaseData.name || ("TestCase:" + parent.testableList.length);
        this.setUp = testCaseData.setUp;
        this.tearDown = testCaseData.tearDown;
        this.id = makeId(this.name);
        this.parent = parent;
        this.errorList = [];
    }
    
    function buildTestableList(testCase, testCaseData) {
        // TODO: Handle a set of ignored tests.
        var testName;
        for(testName in testCaseData) {
            if(testName.indexOf("test") === 0) {
                testableAdd(testCase, testCaseData[testName], testName);
            }
        }
    }
    
    // This should block running until loaded.
    function loadRemoteTestCase(testCase, testURI) {
        var reqData = {method: "GET", action: testURI},
            req = APE.ajax.AsyncRequest.getById(testURI, reqData),
            testIndex = testCase.testableList.length;
        testCase.queuedTestLoads.push(req);
        EventPublisher.add(req, "oncomplete", addRemoteTestToList);
        req.send();

        function addRemoteTestToList() {
            var source = req.req.responseText, 
                reqId = req.id,
                testData,
                testableList;
            
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
            
            //testCase.testableList = insertItemsToArray(testCase.testableList, newTestList, testIndex);
            
        }
    }
    
    function handleFailedTestLoad(reqId) {
        reqId = reqId || "";
        var testData = {};
        testData["test " + reqId] = function(){return"Remote TestCase did not load. " + reqId;};
        return testData;
    }
    
    function insertItemsToArray(array, newItems, start) {
        var tail = array.slice(start);
        var a = array.slice(0, start);
        a = a.concat(newItems, tail);
        return a;
    }
    
    var throwsExp = /@throws\s+([a-zA-Z_$]+[a-zA-Z_$]|$)/;
    function Test(name, func, parent) {
        this.name = name || func.name || parent.testableList.length;
        this.parent = parent;
        this.id = makeId(name);
        this.func = func;
        this.shouldThrow = throwsExp.test(name);
        if(this.shouldThrow) { 
        	var expectedErrorName = throwsExp.exec(name);
            this.expectedErrorName = expectedErrorName && expectedErrorName[1]||"";
        }
        
        this.testableList = [];
        this.errorList = [];
    }
    
    function run(test) {
        var error,
            handledError,
            stack = "";
        if(test.func) {
            try {
                test.func();
            } catch(ex) {
                handledError = true;
                handleTestRunError(test, ex);
                stack = ex.stack || "";
            }
            if(test.shouldThrow && !handledError) {
                error = test.expectedErrorName || "Some error";
                test.errorList.push(new TestError({
                            name:"TestFailure", 
                            message: error + " expected but not thrown",
                            stack : stack
                        }, test));
            }
        }
        waitForDeferredSegments(test);
    }
    
    function handleTestRunError(test, ex) {
        if(test.shouldThrow) {
            if(test.expectedErrorName && test.expectedErrorName !== ex.name) {
                test.errorList.push(ex);
            } 
        } else {
            test.errorList.push(ex);
        }
    }
    
    function waitForDeferredSegments(test) {
        if(test.testableList.length) {
            applyListAction(test, function(seg) {
                if(!seg.done) {
                    EventPublisher.add(seg, "oncomplete", notifyDone);
                } else {
                    if(allSegsDone(test)) {
                        test.oncomplete();
                    }
                }
            });
        } else {
            test.oncomplete();
        }
        
        function notifyDone(error) {
            this.done = true;
            if(error) {
                error = new TestError(error, this);
                test.errorList.push(error);
                test.oncomplete(error);
            } else {
                if(allSegsDone(test)) {
                    test.oncomplete();
                }
            }
        }
    }
    
    function allSegsDone(test) {
        var i, list = test.testableList, len = list.length;
        for(i = 0; i < len; i++) {
            if(!list[i].done) return false;
        }
        return true;
    }
    
    function applyListAction(test, callback) {
        var i, list = test.testableList, len = list.length;
        for(i = 0; i < len; i++) {
            callback.call(test, list[i]);
        }
    }
    
    function TestError(error, cause/*use it or lose it*/) {
        this.name = error.name;
        this.message = error.message;
        this.stack = error.stack || "(not available)";
    }
    
    Test.prototype = APE.createMixin(new Testable(), {
        
        wait : function(callback, delay) {
            var name = "Wait " + this.testableList.length,
                deferred = new Test(name, callback),
                test = this;
            this.testableList.push(deferred);
            EventPublisher.add(deferred, "oncomplete", deferredComplete);
    
            // TODO: implement this.
            deferred.startTimer = setTimeout(function(){
                deferred.start();
            }, delay);
            
            function deferredComplete(error) {
                if(error) {
                    test.errorList.push(error);
                    test.oncomplete();
                }
                // Stop all deferred segs.
                cancelDeferredSegs(test);
            }
        },
        
        toString : function() {
            return "Test: " + this.name;
        },
        
        start : function() {
            run(this);
        }
    });
    
    function cancelDeferredSegs(test) {
        applyListAction(test, function(seg){
            clearTimeout(seg.startTimer);
        });
    }
    return getConstructor;
});