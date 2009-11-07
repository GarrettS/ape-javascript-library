/** 
 * @fileoverview
 * 128 x 128 HSV Picker. 
 * @requires APE.dom, APE.EventPublisher, APE.color.ColorRGB
 * @namespace APE.widget
 */
APE.namespace("APE.widget");

(function(){
    var APE = self.APE,
        Draggable = APE.drag.Draggable,
        EventPublisher = APE.EventPublisher,
        color = APE.color,
        ColorRGB = color.ColorRGB,
        ColorHSV = color.ColorHSV,
        HsvPicker,
        ERR_INVALID_COLOR = "Please enter a valid color value.";
        
    color = null;
    
    
    APE.widget.HsvPicker = HsvPicker = APE.createFactory(HsvPick);

    function noop(){}
    
    function HsvPick(id) {
    	
    	this.id = id;
    	
    	var hueSelectorEl = document.getElementById(this.id + "-hue-slider"),
            bg,
    	    bgSelectorEl = document.getElementById(this.id + "-saturation-value-selector");
    
    	this.hueSlider = Draggable.getByNode(hueSelectorEl);
        this.hueSlider.moveToX = noop;
    	this.hueSlider.keepInContainer = true;
    
    	this.bgSelector = Draggable.getByNode(bgSelectorEl);
    	
    	bg = bgSelectorEl.parentNode.parentNode;
                
    	this.bg = bg;
    	this.bgSelector.container = bg;
    	
    	this.bgSelector.keepInContainer = true;
    	
    	this.textInput = document.getElementById(this.id + "-color-input");
    	this.displayStyle = document.getElementById(this.id + "-color-preview").style;
    	
    	// TODO: bgSelectorEl.parentNode.offsetTop/2
    	this.bgClipTop = 12/2;
    	this.bgClipLeft = 12/2;
    	
    	this.enabled = true;
    	
    	this.prevValue = this.textInput.value;
    }
        
	function hueSlid(e) {
		var hsvPicker = HsvPicker.getById(this.id.split("-")[0]);
		if(!hsvPicker.enabled) return;
		hsvPicker.onbeforechange();
		hsvPicker.h = 360 * hsvPicker.hueSlider.el.offsetTop/128;
		
		hsvPicker.bg.style.background = hsvPicker.rgbForHue(hsvPicker.h);
		hsvPicker.updateDisplay();
		hsvPicker.onchange(e);
	}

	function grabHueSlider(e) {
		var hsvPicker = HsvPicker.getById(this.id.split("-")[0]);
		if(!hsvPicker.enabled) return;
		hsvPicker.hueSlider.grab(e);
		hsvPicker.updateDisplay();
		hsvPicker.onchange(e);
		hsvPicker.onchangecomplete(e);
	}

	function textInputBlur(e) {
		var hsvPicker = HsvPicker.getById(this.id.split("-")[0]);
		if(!hsvPicker.enabled) return;
		return hsvPicker.trySetValue(this.value, e||event);
	}

	function checkEnabled() {
		return HsvPicker.getById(this.id.split("-")[0]).enabled;
	}

	// Must use keyDown for IE.
	function textInputKeyDown(e) {
		e = e||self.event;
		var isTabKey = e.keyCode == 9,
            isEnterKey = e.keyCode == 13;
		if(isTabKey || isEnterKey) {
			HsvPicker.getById(this.id.split("-")[0]).trySetValue(this.value, e||event);
		}
		if(isEnterKey) 
			this.focus();
	}

	function backgroundMousedown(e) {
		var hsvPicker = HsvPicker.getById(this.id.split("-")[0]);
		if(!hsvPicker.enabled) return;
		hsvPicker.onbeforechange();
		hsvPicker.bgSelector.grab(e);
		hsvPicker.bg.style.background = hsvPicker.rgbForHue(hsvPicker.h);
		hsvPicker.updateDisplay();
		hsvPicker.onchange(e);
		hsvPicker.onchangecomplete(e);
	}

	function bgSelectorDrag(e) {
		
		var hsvPicker = HsvPicker.getById(this.id.split("-")[0]);

		if(!hsvPicker.enabled) return;
		
		hsvPicker.v = (127 - (this.el.offsetTop + hsvPicker.bgClipTop))/127;
		hsvPicker.s = (this.el.offsetLeft + hsvPicker.bgClipLeft)/127;
		//document.title = 'v=' + hsvPicker.v + ", s=" + hsvPicker.s;
		hsvPicker.updateDisplay();
		hsvPicker.onchange(e);
	}

	function saveValue() {
		if(this.textInput.value)
			this.prevValue = this.textInput.value;
	}

	function transparentClicked(e) {
		var hsvPicker = HsvPicker.getById(this.id.split("-")[0]);
		hsvPicker.onbeforechange();
		if(this.checked) {
			hsvPicker.prevValue = hsvPicker.textInput.value;
			hsvPicker.setEnabled(false);
			hsvPicker.setValue("transparent");
		} else {
			hsvPicker.setValue(hsvPicker.prevValue||new ColorRGB(255,255,255).toString());
			hsvPicker.prevValue = "";
			hsvPicker.setEnabled(true);
			
			// We have to update the position of the hueSlider and 
			// bgSelector, so we just feign ondrag by direct invocation.
			// This seems potentially dangerous.
			hsvPicker.hueSlider.ondrag(e);
			hsvPicker.bgSelector.ondrag(e);
		}
		hsvPicker.onchange(e);
		hsvPicker.onchangecomplete(e);
	}
    
    HsvPick.prototype = {
    	
    	rgbForHue : ColorHSV.rgbForHue,
    	rgbFromString : ColorRGB.fromString,
    
    	init : function() {
    		if(this.textInput.value) {
    			this.setValue(this.textInput.value);
            } else {
                this.setValue("#ff0000");
            }
    		this.bgSelector.onbeforedragstart = 
    		this.bgSelector.ondrag = 
    		this.bgSelector.onglide = bgSelectorDrag;
            
    		this.hueSlider.onbeforedragstart =
    		this.hueSlider.ondrag =
    		this.hueSlider.onglide = hueSlid;
            
    		this.hueSlider.container.onmousedown = grabHueSlider;
    		this.bgSelector.onglide = bgSelectorDrag;
    		
    		this.bgSelector.onfocus = 
    		this.hueSlider.onfocus = checkEnabled;
            
            EventPublisher.add(this.textInput, "onblur", textInputBlur);
            EventPublisher.add(this.textInput, "onkeydown", textInputKeyDown);
    		EventPublisher.add(this, "onbeforechange", saveValue);
    		EventPublisher.add(this.bgSelector.el.parentNode, "onmousedown",  backgroundMousedown);
    		EventPublisher.add(this.bgSelector, "ondragend", changeCompleteHandler, this);
    		EventPublisher.add(this.hueSlider, "ondragend", changeCompleteHandler, this);
            
            
    
    		var tpCheckbox = document.getElementById(this.id + "-transparent-checkbox");
    		EventPublisher.add(tpCheckbox, "onclick", transparentClicked);
    
    		// This handles initialization when transparent checkbox is checked at load time.
    		if(tpCheckbox.checked) {
    			transparentClicked.call(document.getElementById(this.id + "-transparent-checkbox"));
            }
            
            function changeCompleteHandler(ev) {
                this.onchangecomplete(ev);
            }
    	},
    	
    	getHexValue : function() {
    		if(this.textInput.value == "") return "";
    		return new ColorHSV(this.h, this.s, this.v).toRGB().toHexString();
    	},
    	
        /**@event*/
    	onbeforechange : noop,
        /**@event*/
    	onchange : noop,
        /**@event*/
    	onchangecomplete : noop,
    	
    	setEnabled : function(bEnable) {
    		this.enabled = bEnable;
    	},
    	
    	setValue : function(hexOrRGB) {
    		
            var TRANSPARENT = "transparent",
                el = document.getElementById(this.id),
                checkbox = document.getElementById(this.id + "-transparent-checkbox"),
                previewEl = document.getElementById(this.id + "-color-preview"),
                rgb, hsv;
    		if(hexOrRGB == TRANSPARENT) {
                APE.dom.addClass(el, "ape-hsv-transparent");
    			previewEl.style.backgroundColor = TRANSPARENT;
    			this.setEnabled(false);
    			this.textInput.value = "";
    			checkbox.checked = true;
    			return;
    		} else {
                APE.dom.removeClass(el, "ape-hsv-transparent");
    			this.setEnabled(true);
    			checkbox.checked = false;
    		}
    		
    		rgb = this.rgbFromString(hexOrRGB);
            isInputValid = rgb.isValid();
    		if(!isInputValid) {
    			rgb = this.rgbForHue(this.h = 0, this.s = 1, this.v = 1);
    		}
    
    		hsv = rgb.toHSV();
    		this.h = hsv.h;
    		this.s = hsv.s;
    		this.v = hsv.v;
    		
    		this.hueSlider.el.style.top = (hsv.h/360*128) + "px";
    		this.bgSelector.moveToX( (hsv.s * 127) - this.bgClipLeft);
    		this.bgSelector.moveToY( 127 - (hsv.v * 127)  - this.bgClipTop );
    		this.bg.style.backgroundColor = this.rgbForHue(hsv.h, 1, 1).toHexString();
    		this.updateDisplay(rgb, isInputValid);
    	},
    	
    	updateDisplay : function(rgb, isInputValid) {
    		var color = rgb||new ColorHSV(this.h, this.s, this.v).toRGB();
    		if(color.isValid() && !(isInputValid == false)) {
    			this.displayStyle.backgroundColor = this.textInput.value = color.toHexString();
            } else {
    			this.textInput.value = "";
            }
    	},
    	
    	trySetValue : function( value, e) {
    		if(this.rgbFromString(value).isValid()) {
    		 	this.setValue(value);
    			this.onchange(e);
    			this.onchangecomplete(e);
    			return true;
    		} else {
    			self.alert(ERR_INVALID_COLOR);
    			return false;
    		}	
    	}
    }
})();