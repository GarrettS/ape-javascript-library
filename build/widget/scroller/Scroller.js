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
    
        // Private static methods -------------------------------------------------.
        function getMoveScroller(scroller) {
            return moveScroller;
            function moveScroller() {
              scroller.move();
            }
        }
        /**
         * onclick callback for Left/Right buttons.
         */
        function handleButtonClick() {
            var dir = this.id.match(/(\w+)(Next|Prev)$/),
                c = widget.Scroller.getById(dir[1]);
            c.moveStart(dir[2] === "Next");
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
        
            /**
             *
             * @param {boolean} [isNext] "next" or "prev"
             */
            moveStart : function(isNext) {
                // add to queue.
                if(this.timerId) {
                    this._queue += isNext ? 1 : -1;
                    return;
                }
        
                var doc = document,
                    id = this.id,
                    d = doc.getElementById(id + "Frame")[this.clientDimension],
                    prev, next;
        
                // If the Scroller is not wide enough to scroll, exit.
                if(this.scrollDistance <= d) return;
        
                this.style = doc.getElementById(id).style;
                if(isNext) {
                    d = -d;
                }
                this.newPos = this.pos + d;
                prev = doc.getElementById(id + "Prev");
                next = doc.getElementById(id + "Next");        

                if(!isNext) {
                    dom.removeClass(next, "scrollerButton-disabled");
                    if(this.newPos >= 0) {
                        d = -this.pos;
                        this.newPos = 0;
                        dom.addClass(prev, "scrollerButton-disabled");
                    }
                } else {
                    // disable the "Prev" button if we're at 0.
                    if(this.pos === 0 && this.newPos ) {
                        dom.removeClass(prev, "scrollerButton-disabled");
                    }
                    // disable the "Next" button if we're at end.
                    if(this.newPos <= this.frameSize - this.scrollDistance) {
                        dom.addClass(next, "scrollerButton-disabled");
        
                        var r = this.scrollDistance + this.pos - this.frameSize;  // Negative.
        
                        d = -r;
                        this.newPos = this.pos - r;
                    } 
                }
                // If the remainder is smaller than the distance,
                // only move by that much.
        
                this.startTime = new Date().valueOf();
                this.startPos = this.pos;
                this.dx = d;
                this.timerId = self.setInterval(getMoveScroller(this), 12);
            },
        
            move : function() {
                var elapsed = new Date - this.startTime,
                    rationalValue = elapsed/this.timeDuration,
                    effectedValue = (Math.atan(1.4*(2*rationalValue-1))/Math.atan(1.4)+1)/2;
                if(rationalValue >= 1) {
                    return this.moveEnd();
                }
                // floor off the decimal ToInt32.
                this.style[this.stylePos] = (this.pos = 0|this.startPos + this.dx * effectedValue) + "px";
            },
        
            moveEnd : function() {
                self.clearInterval(this.timerId);
                this.timerId = null;
                this.style[this.stylePos] = (this.pos = this.newPos) + "px";
        
                // take out of cue.
                if(this._queue !== 0) {
                    var isNext = this._queue > 0;
                    this._queue += isNext ? -1 : 1;
                    this.moveStart(isNext);
                } else {
                    if(typeof this.onend == "function") {
                        this.onend();
                    }
                    this.style = null;
                }
            }
        };
    }
})();