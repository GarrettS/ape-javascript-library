/** slider.js
 * requires: Draggable, EventPublisher, className-f.js (in dom.js)
 */
APE.namespace("APE.drag");
(function(){
    var APE = self.APE,
        drag = APE.drag,
        dom = APE.dom,
        Slider = drag.Slider = APE.createFactory(SliderC, createSliderProto),
        HORZ = 1,
        VERT = 2,
        MINVAL = "minValue",
        MAXVAL = "maxValue";
    
    Slider.direction = {
        HORZ : HORZ,
        VERT : VERT
    };

    function SliderC(id, dir, minValue, maxValue) {
        this.id = id;
        this.dir = dir;
        this.value = 0;
        this.rationalValue = 0;
    
        var handle = drag.Draggable.getById(id, dir);
        handle.keepInContainer = true;
        this.handle = handle;
        this[MINVAL] = minValue||0;
        this[MAXVAL] = maxValue;
        this.tDist = 0;
        this.init();
    }
    
    function createSliderProto() {
                
        // IE and Webkit ignore keyEvents on the element.
        APE.EventPublisher.add(document, "onkeydown", _keyDown);
        var ACTIVE_TRACKBAR = "ape-slider-track-active",
            activeSlider = null;
        
        return { 
            
            init : function() {
                var EventPublisher = APE.EventPublisher,
                    el = document.getElementById(this.id),
                    handle = this.handle,
                    container = this.trackbar = document.getElementById(this.id).parentNode;
                
                EventPublisher.add(handle, "onglideend", dragEnd, this);
                EventPublisher.add(handle, "ondragend", dragEnd, this);
                EventPublisher.add(handle, "onglideend", dragEnd, this);
                EventPublisher.add(handle, "ondrag", sliderSlid, this);
                if(!("focus" in handle)) {
                    EventPublisher.add(el, "onmousedown", sliderFocus, this);
                }
                EventPublisher.add(el, "onfocus", sliderFocus, this);
                EventPublisher.add(el, "onblur", sliderBlur, this);
                EventPublisher.add(handle, "onglide", sliderSlid, this);
                EventPublisher.add(handle, "ondragstop", sliderSlid, this);

                if(this.dir === VERT){
                    this.tDist = container.clientHeight - el.offsetHeight;
                    handle.moveToX = moveToNo;
                } else {
                    this.tDist = container.clientWidth - el.offsetWidth;
                    handle.moveToY = moveToNo;
                }
        
                // Default: use pixels for min/max.
                if(this[MAXVAL] === undefined) 
                    this[MAXVAL] = this.tDist;
                EventPublisher.add(container, "onmousedown", trackbarMouseDown, container);
            },
        
            ticks : 15,
                
        	rationalValue : 0,
        
        	slideToX : function(x) {
            	this.handle.moveToX(x);
            	if(typeof slider.onslide === "function")
                	slider.onslide();                
            },
            
            /** setValue moves the slider to x or y coordinate based on value 
             */
        	setValue : function(v) {
                // keep in range, throw no error.
             	v = Math.max(this[MINVAL], v);
            	v = Math.min(this[MAXVAL], v);
        
            	var h = this.handle,
                    d = this[MAXVAL] - this[MINVAL],
                    rationalValue = (v - this[MINVAL]) / d;
        
                // Somehow testKey* functions in IE result 
                // in a Draggable with no properties. 
                if(!h || !h.id) return;
            	if(this.dir === VERT) {            
                 	h.moveToY(this.tDist  * (1 - rationalValue));
                } else {
                 	h.moveToX(this.tDist * rationalValue );
                }
            	this.rationalValue = rationalValue;
            	this.value = v;
            },
            
        	slideToY : function(y) {
            	this.handle.moveToY(y);
            	this.onslide();
            },
            
        	setRationalValue : function(fRat, bOnslide) {
            	fRat = Math.max(0, fRat);
            	fRat = Math.min(1, fRat);
            	this.rationalValue = fRat;
            	this.setValue(this[MINVAL] + (fRat * (this[MAXVAL] - this[MINVAL])));
            	if(bOnslide)
                	sliderSlid.call(this, {});
            },
            
            toString : function(){ 
                return"Slider: " + this.handle.toString();
            }
        };

        function moveToNo(){} 
        
        function trackbarMouseDown(e) {
            var target = dom.Event.getTarget(e),
                slider;
            if(target !== this) return true;
            slider = Slider.instances[this.getElementsByTagName("*")[0].id];
            e = e||self.event;
            if(e.preventDefault)
                e.preventDefault();
    
            dom.addClass(this, ACTIVE_TRACKBAR);
            slider.handle.grab(e);
            sliderSlid.call(slider, e);
            return false;
        }
            
        function dragEnd(e) {
            dom.removeClass(this.trackbar, ACTIVE_TRACKBAR);
            sliderSlid.call(this, e);
            if(typeof this.onslideend === "function")
                this.onslideend(e);
         }
         
        function sliderFocus(e) {
            activeSlider = this;
            dom.addClass(this.trackbar, ACTIVE_TRACKBAR);
        }
        
        function sliderBlur(e) {
            if(activeSlider === this)
                activeSlider = null;
            dom.removeClass(this.trackbar, ACTIVE_TRACKBAR);
        }
                
        function sliderSlid(e) { 
            this.value = 0;
            var el = document.getElementById(this.id),
                rationalValue = 0;
    
            if(this.dir === HORZ) {
                if(el.offsetLeft > 0) {
                    rationalValue = el.offsetLeft / this.tDist;
                } else {
                    rationalValue = 0;
                }
            } else {
                if(el.offsetTop > 0) {
                    var distFromBottom = this.tDist - el.offsetTop;
                    rationalValue = distFromBottom / this.tDist;
                } else {
                    rationalValue = 1;
                }
            }
            this.rationalValue = rationalValue;
            this.value = rationalValue * (this[MAXVAL] - this[MINVAL]);
            if(this.onslide) this.onslide(e||{}); 
        }
    
        var lastKeyTime;
        function _keyDown(e) {
            e = e||self.event;
            if(e.stopPropagation) {
                // Safari 3 doesn't actually stop propagation; ignores cancelBubble = true.
                // Doesn't support originalTarget, either.
                e.stopPropagation();
            }
            e.cancelBubble = true; // just in case some actually fires a keyEvent on a handle.
    
            // IE, Opera, Webkit all need this:
            // If stopPropagation and cancelBubble fail, check the timeStamp.
            // If the timeStamp is recurrant, exit.
            // Opera 9.2: timeStamp is always 0. always. IE does not support event.timeStamp.
            var timeStamp = +new Date, 
                slider = activeSlider;
            if(!slider) return;

            if(timeStamp - lastKeyTime < 5) return; // recurrant.
            lastKeyTime = timeStamp; // record.
            var keyCode = e.keyCode,
                tickval,
                lArr = keyCode === 37,
                rArr = keyCode === 39,
                uArr = keyCode === 38,
                dArr = keyCode === 40;
            if( !(lArr || rArr || uArr || dArr) ) return true;
    
            if(slider.id in Slider.instances) {
                tickval = slider[MAXVAL]/slider.ticks;
                if(lArr || dArr) {
                    tickval = -tickval;
                }
                slider.setValue(slider.value + tickval);
                if(slider.onslide)
                    slider.onslide(e);
                return false;
            }
        }
    }     
})();