APE.test.TestReporter = function(testRunner, insertBefore) {
    
    APE.EventPublisher.add(testRunner, "oncomplete", completeHandler);
    
    var passEl;
    function completeHandler() {
        passEl = document.createElement("b");
        passEl.appendChild(document.createTextNode("\u00a0PASS"));
        passEl.className = "pass-flag";
        
        insertBefore = insertBefore || document.body.lastChild;
        var ul = makeTree(this);
        insertBefore.parentNode.insertBefore(ul, insertBefore);
        insertBefore = null;
        passEl = null;
    }

    this.insertBefore = function(el, refNode) {
        var ul = makeTree(testRunner, el.ownerDocument);
        ul.className = "test-reporter";
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
            name, message, stack;
        message = li.cloneNode(false);
        stack = li.cloneNode(false);
        stack.className = "errorStack";
        message.appendChild(document.createTextNode("message: "+ex.message));
        stack.appendChild(document.createTextNode("stack: "+ex.stack));
        li.appendChild(document.createTextNode(ex.name + ":"));
        ul.appendChild(message);
        ul.appendChild(stack);
        li.appendChild(ul);
        li.className = "error";
        return li;
    }
    
    function makeItem(testable, doc) {
        var li = doc.createElement("li"),
            hasError = !!testable.errorList.length,
            hasSubtree = !!testable.testableList.length;
        li.id = testable.id;
        if(hasError) {
            li.className = "failed";
        }
        li.appendChild(doc.createTextNode(testable.name));
        if(hasSubtree) {
            li.appendChild(makeTree(testable, doc));
        } else {
            if(hasError){
                li.appendChild(makeErrorTree(testable.errorList, doc));
            } else {
                li.className = "test-pass";
                li.appendChild(passEl.cloneNode(true));
            }
        }
        return li;
    }
    
    function listClicked(ev) {
        var target = APE.dom.Event.getTarget(ev);
        if(target.tagName === "LI") {
            console.log(target)
            toggleListItem(target);
        }
        APE.dom.Event.stopPropagation(ev);
    }
    
    function toggleListItem(li) {
        APE.dom.toggleClass(li, "expandedNode");
    }
};