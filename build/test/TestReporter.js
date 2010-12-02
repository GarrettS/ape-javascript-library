APE.test.TestReporter = function(testRunner, insertBefore) {
    
    APE.EventPublisher.add(testRunner, "oncomplete", completeHandler);
    
    var passEl;
    function completeHandler() {
        passEl = document.createElement("b");
        passEl.appendChild(document.createTextNode("\u00a0PASS"));
        passEl.className = "pass-flag";
        
        insertBefore = insertBefore || document.body.lastChild;
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
        ul.onclick = listClicked;
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
    
    function makeErrorItem(ex) {
        var li = document.createElement("li"),
            ul = document.createElement("ul"),
            name, message, stack, errorStack = ex.stack,
            stackPre;
        
        message = li.cloneNode(false);
        stack = li.cloneNode(false);
        stack.className = "errorStack";
        message.appendChild(document.createTextNode("message: "+ex.message));
        if(ex.stack) {
        	stack.appendChild(document.createTextNode("stack: "));
        	errorStack = errorStack.replace("@", "<br>@");
        	stackPre = document.createElement("pre");
        	stackPre.innerHTML = errorStack;
        	stack.appendChild(stackPre);
        }
        li.appendChild(document.createTextNode(ex.name + ":"));
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
            hasSubtree = !!testable.testableList.length,
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
    
    function listClicked(ev) {
        var target = APE.dom.Event.getTarget(ev);
        if(target.tagName === "LI") {
            toggleListItem(target);
        }
        APE.dom.Event.stopPropagation(ev);
    }
    
    function toggleListItem(li) {
        APE.dom.toggleClass(li, "expandedNode");
    }
};