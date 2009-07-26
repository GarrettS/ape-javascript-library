APE.namespace("APE.widget");

(function(){
    var widget = APE.widget;
    widget.Scroller = APE.createFactory(Scroller, scrollerCreatePrototype);
    
    function Scroller(id, timeDuration, vertical) {
        this.id = id;
        this.timeDuration = timeDuration || 250;
        this.isVertical = !!vertical;
        this._queue = 0;
        this.init();
    }

    function scrollerCreatePrototype() {
        return {
            pos : 0,
      
            init : function() {
                var el = document.getElementById(this.id),
                    item, items = el.childNodes,
                    i, len, addCallback = APE.dom.Event.addCallback,
                    offsetPosition = this.isVertical ? "offsetTop" : "offsetLeft",
                    offsetDimension = this.isVertical ? "offsetHeight" : "offsetWidth";
        
                this.style = el.style;
                this.clientDimension = this.isVertical ? "clientHeight" : "clientWidth";
                this.stylePos = this.isVertical ? "top" : "left";
                
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
                var styleDim = this.isVertical ? "height" : "width";
                this.style[styleDim] = this.scrollDistance + 10 + "px";
        
                // Add event callbacks for buttons.
                var prev = document.getElementById(this.id + "Prev"),
                    next = document.getElementById(this.id + "Next");
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
        
                var d = document.getElementById(this.id + "Frame")[this.clientDimension],
                    dom = APE.dom;
        
                // If the Scroller is not wide enough to scroll, exit.
                if(this.scrollDistance <= d) return;
        
                if(isNext) {
                    d = -d;
                }
                this.newPos = this.pos + d;
        
                if(!isNext) {
                    dom.removeClass(document.getElementById(this.id + "Next"), "scrollerButton-disabled");
                    if(this.newPos >= 0) {
                        d = -this.pos;
                        this.newPos = 0;
                        dom.addClass(document.getElementById(this.id + "Prev"), "scrollerButton-disabled");
                    }
                } else {
                    // disable the "Prev" button if we're at 0.
                    if(this.pos === 0 && this.newPos ) {
                        dom.removeClass(document.getElementById(this.id + "Prev"), "scrollerButton-disabled");
                    }
                    // disable the "Next" button if we're at end.
                    if(this.newPos <= this.frameSize - this.scrollDistance) {
                        dom.addClass(document.getElementById(this.id + "Next"), "scrollerButton-disabled");
        
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
                this.timerId = window.setInterval(getMoveScroller(this), 12);
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
                window.clearInterval(this.timerId);
                this.timerId = null;
                this.style[this.stylePos] = (this.pos = this.newPos) + "px";
                if(typeof this.onend == "function") {
                    this.onend();
                }
        
                // take out of cue.
                if(this._queue !== 0) {
                    var isNext = this._queue > 0;
                    this._queue += isNext ? -1 : 1;
                    this.moveStart(isNext);
                }
            }
        };
    }
    
    // Private static methods -------------------------------------------------.
    function getMoveScroller(scroller) {
        return moveScroller;
        function moveScroller() {
          scroller.move();
        };
    }
    /**
     * onclick callback for Left/Right buttons.
     */
    function handleButtonClick() {
        var dir = this.id.match(/(\w+)(Next|Prev)$/),
            c = widget.Scroller.getById(dir[1]);
        c.moveStart(dir[2] === "Next");
    }
})();