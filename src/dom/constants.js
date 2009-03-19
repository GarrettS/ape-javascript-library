APE.namespace("APE.dom");
(function(){
	var dom = APE.dom,
	docEl = document.documentElement,  
	textContent = "textContent",
	view = document.defaultView;
	
    dom.IS_COMPUTED_STYLE = !!(typeof view != "undefined" && "getComputedStyle" in view);
	dom.textContent = textContent in docEl ? textContent : "innerText";
})();