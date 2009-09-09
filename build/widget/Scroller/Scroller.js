APE.namespace("APE.widget");
(function(){
    var APE = self.APE,
        widget = APE.widget,
        dom = APE.dom;
    widget.Scroller = APE.createFactory(Scroller, scrollerCreatePrototype);
    
    function Scroller(id, timeDuration, vertical) {
        this.id = id;
        this.timeDuration = timeDuration || 250;
        this.isVertical = !!vertical;
        this._queue = 0;
        this.init();
    }

    function scrollerCreatePrototype() {
    
        function getMoveScroller(scroller) {
            return moveScroller;
            function moveScroller() {
              move(scroller);
            }
        }
        
        /** onclick callback for Left/Right buttons. */
        function handleButtonClick() {
            var dir = this.id.match(/(\w+)(Next|Prev)$/),
                scroller = widget.Scroller.getById(dir[1]);
            moveStart(scroller, dir[2] === "Next");
        }

        /** @param {boolean} [isNext] true moves "next", false "prev" */ 
         function moveStart(scroller, isNext) {
            // add to queue.
            if(scroller.timerId) {
                scroller._queue += isNext ? 1 : -1;
                return;
            }
    
            var doc = document,
                id = scroller.id,
                d = doc.getElementById(id + "Frame")[scroller.clientDimension],
                prev, next;
    
            // If the Scroller is not wide enough to scroll, exit.
            if(scroller.scrollDistance <= d) return;
    
            scroller.style = doc.getElementById(id).style;
            if(isNext) {
                d = -d;
            }

            scroller.newPos = scroller.pos + d;
            prev = doc.getElementById(id + "Prev");
            next = doc.getElementById(id + "Next");        

            if(!isNext) {
                dom.removeClass(next, "scrollerButton-disabled");
                if(scroller.newPos >= 0) {
                    d = -scroller.pos;
                    scroller.newPos = 0;
                    dom.addClass(prev, "scrollerButton-disabled");
                }
            } else {
                // disable the "Prev" button if we're at 0.
                if(scroller.pos === 0 && scroller.newPos ) {
                    dom.removeClass(prev, "scrollerButton-disabled");
                }
                // disable the "Next" button if we're at end.
                if(scroller.newPos <= scroller.frameSize - scroller.scrollDistance) {
                    dom.addClass(next, "scrollerButton-disabled");
    
                    var r = scroller.scrollDistance + scroller.pos - scroller.frameSize;  // Negative.
    
                    d = -r;
                    scroller.newPos = scroller.pos - r;
                }
            }
            // If the remainder is smaller than the distance,
            // only move by that much.
            scroller.startTime = +new Date;
            scroller.startPos = scroller.pos;
            scroller.dx = d;
            scroller.timerId = self.setInterval(getMoveScroller(scroller), 12);
        }

        function move(scroller) { 
            var elapsed = new Date - scroller.startTime,
                rationalValue = elapsed/scroller.timeDuration,
                effectedValue = (Math.atan(1.4*(2*rationalValue-1))/Math.atan(1.4)+1)/2;
            if(rationalValue >= 1) {
                return moveEnd(scroller);
            }
            // floor off the decimal ToInt32.
            scroller.style[scroller.stylePos] = 
              (scroller.pos = 0|scroller.startPos + scroller.dx * effectedValue) + "px";
        }
    
        function moveEnd(scroller) {
            scroller.timerId = self.clearInterval(scroller.timerId);
            scroller.style[scroller.stylePos] = (scroller.pos = scroller.newPos) + "px";
            // take out of cue.
            if(scroller._queue !== 0) {
                var isNext = scroller._queue > 0;
                scroller._queue += isNext ? -1 : 1;
                moveStart(scroller, isNext);
            } else {
                if(typeof scroller.onend == "function") {
                    scroller.onend();
                }
                scroller.style = null;
            }
        }

        return {
            pos : 0,
            
            init : function() {
                var doc = document,
                    id = this.id,
                    el = doc.getElementById(id),
                    item, items = el.childNodes,
                    i, len, addCallback = dom.Event.addCallback,
                    isVertical = this.isVertical,
                    offsetPosition = isVertical ? "offsetTop" : "offsetLeft",
                    offsetDimension = isVertical ? "offsetHeight" : "offsetWidth",
                    prev = doc.getElementById(id + "Prev")
                    next = doc.getElementById(id + "Next");
        
                this.clientDimension = isVertical ? "clientHeight" : "clientWidth";
                this.stylePos = isVertical ? "top" : "left";
                
                // Remove text nodes.
                for(i = 0, len = items.length; i < len; i++) {
                    item = items[i];
                    if(!item) break;
                    if(!/LI/i.test(item.tagName)) {
                        item.parentNode.removeChild(item);
                    }
                }
                
                this.scrollDistance = el.lastChild[offsetPosition] + el.lastChild[offsetDimension];
                this.frameSize = el.parentNode[this.clientDimension];
                
                // Trim off extra pixels, but allow for a little margin-right.
                el.style[isVertical ? "height" : "width"] = this.scrollDistance + 10 + "px";
        
                // Add event callbacks for buttons.
                if(prev !== null) {
                    addCallback(prev, "click", handleButtonClick);
                }
                if(next !== null) {
                    addCallback(next, "click", handleButtonClick);
                }
            },
        
            next : function(){
                moveStart(this, true);
                return this;
            },
            
            prev: function(){
                moveStart(this, false);
                return this;
            }
        };
    }
})();