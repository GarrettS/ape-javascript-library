/** Cross Browser Adapter for StyleSheets.
 *
 * @author Garrett Smith
 * This is mainly for IE 5-7.
 */
APE.namespace("APE.dom");

(function(){
    /** @constructor
     * @param {String} [id] an ID of a link or style or link element,
     * or optinally a styleSheet object (because safari 2 doesn't seem
     * to find linkEl.sheet).
     */
    APE.dom.StyleSheetAdapter = function( id ) {
        var linkOrStyleEl, sheet;
        if(typeof id === "string") {
            linkOrStyleEl = document.getElementById(id);
            
            if(!linkOrStyleEl) { // create one.
                linkOrStyleEl = document.createElement("style");
                linkOrStyleEl.type = "text/css";
                if(id) {
                    linkOrStyleEl.id = id;
                }
                document.getElementsByTagName('head')[0].appendChild(linkOrStyleEl);
            }
            sheet = linkOrStyleEl.sheet || linkOrStyleEl.styleSheet;
        } else if("rules" in id || "cssRules" in id) {
            sheet = id;
        } else {
            sheet = id.sheet || id.styleSheet;
        }
        this.sheet = sheet;
    };
     
    APE.dom.StyleSheetAdapter.prototype = {
    
    	/** IE will not return the correct selector text for Element selectors in HTML.
    	 * Instead, IE puts the element selector and pseudoclass selectors in upper case.
    	 *
    	 * This function compares selectors, case sensitive, but
    	 * case insensitive for element selector parts.
    	 * Does not traverse into media blocks.
    	 * @return CSSStyleRule
    	 */
    	getRule : function(selectorText) {
    
    		// Convert local selectorText to have upper-case element selectors.
    		selectorText = _tagNamesToUpperCase(selectorText);
    		var cssRuleList = this.sheet.cssRules || this.sheet.rules;
    
    		// Loop through the cssRuleList.
    		for(var i = 0, iLen = cssRuleList.length; i < iLen; i++) {
    
    			// Check each rule's selectorText to see if it matches the one provided.
    			// Since a rule can have multiple selectors, separated by ",",
    			// we split on "," (with optional whitespace) and return the rule for any
    			// matching selector text.
    			var selectorTextMatches = cssRuleList[i].selectorText.split(/\s*,\s*/);
    
    			for(var j = 0; j < selectorTextMatches.length; j++) {
    				if(_tagNamesToUpperCase(selectorTextMatches[j]) === selectorText)
    					return cssRuleList[i];
    			}
    		}
    		return null;
    	},
    
    	/** @return CSSRuleList */
    	getRules : function() {
    		return this.sheet.cssRules || this.sheet.rules;
    	},
    
    	/**
    	 * Adds a rule to the styleSheet
    	 * @return {CSSRule} cssRule that was added.
    	 */
    	addRule : function(selectorText, cssText) {
    
    		// IE barfs on empty string. ";" makes IE's parser happy.
    		if(!cssText) cssText = ";";
    
    		var rule, rules = this.getRules();
    
    	    if(this.sheet.insertRule) {
    			this.sheet.insertRule(selectorText + "{" + cssText + "}", rules.length);
    			// Safari 3 doesn't keep a live copy of rules.
    			// we need to get the rules off the sheet again.
    			rules = this.sheet.cssRules;
    			rule = rules[rules.length-1];
    		}
    	    else if (this.sheet.addRule) {
    			this.sheet.addRule(selectorText, cssText);
    			rule = rules[rules.length-1];
    
    			// Standard: rule.cssText (readonly)
    			// IE: rule.style.cssText (read/write);
    			// We got this far, assume it's safe to write style.cssText.
    			if(rule.style.cssText)
    				rule.style.cssText = cssText;
    	    }
    		return rule;
    	}
    };
    
    /**
     * Converts the tag names of selector text to upper case.
     * This is used internally for matching/comparison of selector text.
     * Internet Explorer converts all
     * HTML Element selectors to upper case. It is a bad design decision by the IE team.
     */
    function _tagNamesToUpperCase(s) {
        // Element Selector = Start of string or ws, followed by one or more letter chars.
        var elementSelector = /(^|\s)([a-z]+)/,
            R = RegExp;
        while( elementSelector.test(s) ) s = s.replace(elementSelector, R.$1+R.$2.toUpperCase());
        return s;
    };
})();