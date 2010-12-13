APE.test.TestReporter = function(testRunner, appendTo) {
    
    APE.EventPublisher.add(testRunner, "oncomplete", completeHandler);
    
    var passEl;
    function completeHandler() {
        passEl = document.createElement("b");
        passEl.appendChild(document.createTextNode("\u00a0PASS"));
        passEl.className = "pass-flag";
        
        var insertBefore = appendTo.lastChild || document.body.lastChild;
        var ul = makeTree(this);
//      ul.className = "test-reporter";
        insertBefore.parentNode.insertBefore(ul, insertBefore);
        insertBefore = null;
        passEl = null;
    }

    this.insertBefore = function(el, refNode) {
        var ul = makeTree(testRunner, el.ownerDocument);
        el.insertBefore(ul, refNode || el.firstChild);
    };
    
    function makeTree(root, doc) {
        doc = doc || document;

        var ul = doc.createElement("ul"),
            testableList = root.testableList,
            i, len = testableList.length, 
            li;
        for(i = 0; i < len; i++) {
            li = makeItem(testableList[i], doc);
            li.className = "test-case";
            ul.appendChild(li);
        }
        return ul;
    }
    
    function makeErrorTree(errorList, doc) {
        doc = doc || document;
        var ul = doc.createElement("ul"),
            i, len = errorList.length, 
            li;
        for(i = 0; i < len; i++) {
            li = makeErrorItem(errorList[i], doc);
            ul.appendChild(li);
        }
        return ul;
    }
    
    function makeErrorItem(ex, doc) {
        var li = doc.createElement("li"),
            ul = doc.createElement("ul"),
            name, message, stack, errorStack = ex.stack,
            stackPre;
        
        message = li.cloneNode(false);
        stack = li.cloneNode(false);
        stack.className = "errorStack";
        message.appendChild(doc.createTextNode("message: "+ex.message));
        if(ex.stack) {
        	stack.appendChild(doc.createTextNode("stack: "));
        	errorStack = errorStack.replace("@", "<br>@");
        	stackPre = doc.createElement("pre");
        	stackPre.innerHTML = errorStack;
        	stack.appendChild(stackPre);
        }
        li.appendChild(doc.createTextNode(ex.name + ":"));
        ul.appendChild(message);
        ul.appendChild(stack);
        li.appendChild(ul);
        li.className = "error";
        return li;
    }
    
    function makeItem(testable, doc) {
        var li = doc.createElement("li"),
            failedTestCount = testable.errorList.length,
            hasError = !!failedTestCount,
            hasSubtree = "testableList"in testable && !!testable.testableList.length,
            testResultHeaderText = '"'
                + testable.name;
        
        if(testable.parent && !testable.parent.parent) {
            testResultHeaderText += '"; failure count: ' + failedTestCount;
        }
        li.id = testable.id;
        APE.dom.addClass(li, hasError ? "test-fail" : "test-pass");
        li.appendChild(doc.createTextNode(testResultHeaderText));
        if(hasSubtree) {
            li.appendChild(makeTree(testable, doc));
        } else {
            if(hasError){
                li.appendChild(makeErrorTree(testable.errorList, doc));
            } else {
                li.appendChild(passEl.cloneNode(true));
            }
        }
        return li;
    }    
};