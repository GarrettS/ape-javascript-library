(function(){
    /* Requires Draggable.js */
    
    var dom = APE.dom,
        SortList = APE.drag.SortList = APE.createFactory(SortListC),
        Draggable = APE.drag.Draggable;

    /** Makes an HTML List sortable by drag drop. 
     * @param {String} id the id of the LIST
     * @param {Object} [dragOptions] options for Draggable
     */
    function SortListC(id, dragOptions) {
        this.id = id;
        var el = document.getElementById(id);
        el.onmousedown = sortListMousedownHandler;
        this.dragOptions = dragOptions;
    }
    
    function sortListMousedownHandler(ev){
        var target = dom.Event.getTarget(ev),
            li = target.tagName === "LI" ? target : 
               dom.findAncestorWithTagName(target, "LI"),
               dli;
        // Possibly user clicked between LIs, during anim, or who knows,
        // just make sure we have one.
        if(li) {
            dli = Draggable.getByNode(li, SortList.getById(this.id).dragOptions);
        }
        dli.ondragend = dliDragEndHandler;
    }

    function dliDragEndHandler(dragEvent) {
        var el = this.el,
            coords = dom.Event.getCoords(dragEvent.domEvent),
            draggableList = dragEvent.draggableList,
            sortList = el.parentNode,
            id, dt, i, insertItems = [];
        
        dom.addClass(sortList, "hiddenSelection");
        dt = getElementFromY(sortList, draggableList, coords.y);
        for(id in draggableList) {
            el = draggableList[id].el;
            el.style.top = "";
            insertItems[insertItems.length] = el;
        }
        insertItems.sort(sortBySourceOrder);
        for(i = 0; i < insertItems.length; i++) {
            sortList.insertBefore(insertItems[i], dt);
        }
        dom.removeClass(sortList, "hiddenSelection");
    }

    function getElementFromY(list, excludeList, y){
        var lis = list.getElementsByTagName("li"),
            li,
            liY,
            i,
            id,
            listY = dom.getOffsetCoords(list).y;
        for(i = 0; i < lis.length; i++) {
            li = lis[i];
            id = li.id;
            if(!id || !(id in excludeList)) {
                liY = dom.getOffsetCoords(li).y;
                if(liY + listY > y) {
                    return li;
                }
            }
        }
        return null;
    }

    var sortBySourceOrder = function(a, b) {
        var node = document.documentElement,
            f;
        if(typeof node.sourceIndex == "number") {
            f = function(a, b){
                return a.sourceIndex - b.sourceIndex;
            };
        } else if("compareDocumentPosition" in node) {
            f = function(a, b) {
                //http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node-DOCUMENT_POSITION_PRECEDING
                //  DOCUMENT_POSITION_PRECEDING - 2
                //    2. The second node precedes the reference node.
                    return b.compareDocumentPosition(a) - 3;
            };
        }
        node = null;
        return (sortBySourceOrder = f)(a, b);
    }
})();