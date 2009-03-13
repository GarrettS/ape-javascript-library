/** 
 * @fileoverview
 * 128 x 128 HSV Picker. 
 * @requires APE.dom, APE.EventPublisher, APE.color.ColorRGB
 * @author Garrett Smith

 * @namespace APE.widget
 */
APE.namespace("APE.widget");

/** 
 * @constructor
 */
APE.widget.HsvPicker = function(id) {
	
    var Draggable = APE.drag.Draggable;
	this.id = id;
	
	var hueSelectorEl = document.getElementById(this.id + "-hue-slider");
	var bgSelectorEl = document.getElementById(this.id + "-saturation-value-selector");

	this.hueSlider = Draggable.getByNode(hueSelectorEl, APE.drag.Draggable.constraints.VERT);

	this.hueSlider.keepInContainer = true;

	this.bgSelector = Draggable.getByNode(bgSelectorEl);
	
	var bg = bgSelectorEl.parentNode.parentNode;
	bg.onselectstart=function(){return false;};
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
};

APE.widget.HsvPicker.getById = APE.getById;

(function(){

	var HsvPicker = APE.widget.HsvPicker;

	APE.mixin(HsvPicker, {
		hueSlid : hueSlid,
		grabHueSlider : grabHueSlider,
		bgSelectorDrag : bgSelectorDrag,
		textInputBlur : textInputBlur,
		checkEnabled : checkEnabled,
		textInputKeyDown : textInputKeyDown,
		backgroundMousedown : backgroundMousedown,
		saveValue : saveValue,
		transparentClicked : transparentClicked
	});

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
		e = e||window.event;
		var isTabKey = e.keyCode == 9;
		var isEnterKey = e.keyCode == 13;
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
		}
		else {
			hsvPicker.setValue(hsvPicker.prevValue||new APE.color.ColorRGB(255,255,255).toString());
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

})();

APE.widget.HsvPicker.prototype = {
	
	rgbForHue : APE.color.ColorHSV.rgbForHue,
	rgbFromString : APE.color.ColorRGB.fromString,

	init : function() {
		if(this.textInput.value)
			this.setValue(this.textInput.value);
        else
            this.setValue("#ff0000");
		
		var HsvPicker = APE.widget.HsvPicker;

		this.bgSelector.onbeforedragstart = HsvPicker.bgSelectorDrag;
		this.bgSelector.ondrag = HsvPicker.bgSelectorDrag;
		this.bgSelector.onglide = HsvPicker.bgSelectorDrag;
		this.hueSlider.onbeforedragstart = HsvPicker.hueSlid;
		this.hueSlider.ondrag = HsvPicker.hueSlid;
		this.hueSlider.onglide = HsvPicker.hueSlid;
		this.hueSlider.container.onmousedown = HsvPicker.grabHueSlider;
		this.bgSelector.onglide = HsvPicker.bgSelectorDrag;
		
		this.bgSelector.onfocus = HsvPicker.checkEnabled;
		this.hueSlider.onfocus = HsvPicker.checkEnabled;

		var EventPublisher = APE.EventPublisher;

		EventPublisher.add(this.textInput, "onblur", HsvPicker.textInputBlur);
		EventPublisher.add(this, "onbeforechange", HsvPicker.saveValue);
		EventPublisher.add(this.bgSelector.el.parentNode, "onmousedown", HsvPicker.backgroundMousedown);
		EventPublisher.add(this.bgSelector, "ondragend", function(e) { this.onchangecomplete(e); }, this);
		EventPublisher.add(this.hueSlider, "ondragend", function(e) { this.onchangecomplete(e); }, this);

		var tpCheckbox = document.getElementById(this.id + "-transparent-checkbox");
		EventPublisher.add(tpCheckbox, "onclick", HsvPicker.transparentClicked);

		// This handles initialization when transparent checkbox is checked at load time.
		if(tpCheckbox.checked)
			HsvPicker.transparentClicked.call(document.getElementById(this.id + "-transparent-checkbox"));
	},
	
	getHexValue : function() {
		if(this.textInput.value == "") return "";
		return new APE.color.ColorHSV(this.h, this.s, this.v).toRGB().toHexString();
	},
	
    /**@event*/
	onbeforechange : function() { },
    /**@event*/
	onchange : function(e) { },
    /**@event*/
	onchangecomplete : function(e) { },
	
	setEnabled : function(bEnable) {
		this.enabled = bEnable;
	},
	
	setValue : function(hexOrRGB) {
		
		if(hexOrRGB == "transparent") {
			this.displayStyle.background = "transparent";
			this.hueSlider.el.parentNode.style.background = "transparent";
			this.bgSelector.el.parentNode.style.visibility = "hidden";
			this.bgSelector.el.parentNode.previousSibling.style.visibility = "inherit";
			this.setEnabled(false);
			this.bg.style.backgroundColor = "transparent";
			this.textInput.value = "";
			document.getElementById(this.id + "-transparent-checkbox").checked = true;
			return;
		}
		else {
			this.displayStyle.background = "transparent";
			// this kills the background image in IE7.
            // this.hueSlider.el.parentNode.style.background = "";
			this.bgSelector.el.parentNode.style.visibility = "inherit";
			this.bgSelector.el.parentNode.previousSibling.style.visibility = "hidden";
			this.setEnabled(true);
			document.getElementById(this.id + "-transparent-checkbox").checked = false;
		}
		
		var rgb = this.rgbFromString(hexOrRGB);
		var isInputValid = rgb.isValid();
		if(!isInputValid) {
			rgb = this.rgbForHue(this.h = 0, this.s = 1, this.v = 1);
		}

		var hsv = rgb.toHSV();
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
		var color = rgb||new APE.color.ColorHSV(this.h, this.s, this.v).toRGB();
		if(color.isValid() && !(isInputValid == false))
			this.displayStyle.backgroundColor = this.textInput.value = color.toHexString();
		else
			this.textInput.value = "";
	},
	
	trySetValue : function( value, e) {
		if(this.rgbFromString(value).isValid()) {
		 	this.setValue(value);
			this.onchange(e);
			this.onchangecomplete(e);
			return true;
		}
		else {
			alert("Please enter a valid color value.");
			return false;
		}	
	}
};