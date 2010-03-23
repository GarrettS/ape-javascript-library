APE.namespace("APE.widget").defineCustomFactory("Autocomplete",function(M){var O=window.APE,P=O.dom,S=P.key,N=O.anim,R=P.Event,E=O.widget.DelegateFactory,F="ape-autocomplete-item-selected",C="ape-autocomplete-item-hover",B,D=Q(),K={jsonpParamName:"{string} - param name - required for jsonp REST-based APIs.",onhighlight:"{Function} Event Fires when an item is hilighted.",onchange:"{Function} Event Fires when an item has been selected (click or Enter).",onrender:"{Function} Event fires when list is populated with data.",requestInputPattern:"{Function} text to match on input before sending a request."},A=Function.prototype;E.create(M,R,"focus",E.descendantMatcher);M.textMatcher=A;M.showUsage=H;M.getRequiredFields=Q;M.toString=function(){return"Autocomplete Widget Factory: for help, call Autocomplete.showUsage()"};function Q(){return{dataSource:"{string} URI, e.g. 'myService.jsp'",paramName:"{string} query param for input value",getListData:"{Function} function must return array from the response object. default: Autocomplete.prototype.getListData(rawObject)",itemRenderer:"{Function} renders each item in the list default: Autocomplete.prototype.itemRenderer(itemData)",getInputValueFromHighlightedItem:"{Function} default: Autocomplete.prototype.getInputValueFromHighlightedItem()",loader:"{Object} APE.ajax.AsyncRequest (default) or APE.ajax.ScriptLoader",matcher:"{Function} [optional] Do something to each LI based on input value.default: noop. Try: Autocomplete.textMatcher(listItemElement, value)"}}function H(){var T=[],U;for(U in D){T[T.length]=U+" : "+D[U]}T[T.length]="\nOptional:";for(U in K){T[T.length]=U+" : "+K[U]}return"Usage:\n\nvar config = {\n  "+T.join("\n  ")+"\n};\nAutocomplete.addDelegateFor('myWidget-input', config);\n\n"}function G(W,U){var V=W.firstChild,X=V.data.toLowerCase().indexOf(U.toLowerCase()),T=U.length-X;if(X!==-1&&T>0){I(W.firstChild,"b",X,T)}}function I(V,T,W,U){(I=document.createRange?function(Z,X,a,Y){range=document.createRange();range.setStart(Z,a);range.setEnd(Z,Y);range.surroundContents(document.createElement(X))}:function(Z,g,X,Y){var c=document.createDocumentFragment(),a=Z.data,b=document.createElement(g),d=Z.parentNode,f=document.createTextNode(a.substring(X+Y)),e=a.substring(X,X+Y);b[P.TEXT_CONTENT]=e;c.appendChild(b);c.appendChild(f);d.replaceChild(c,Z)})(V,T,W,U)}function L(U){var V="config";if(!U||(V=T(U))){return M.toString()+V&&"\n(missing: "+V+")"}function T(W){for(var X in D){if(!(X in W)){return X}}}}return J;function J(x){function V(AI,AF){var AH,AG,AE;AG=L(AF);if(AG){throw new Error("Autocomplete Constructor: "+AI+", "+AG)}this.id=AI;for(AH in AF){this[AH]=AF[AH]}y(this)}V.prototype={getValueForServer:function(){return this.value?this.value.replace(/^ +| +$/g,""):""},data:"",requestInputPattern:/\S/,itemRenderer:function(AE){return AE},onchange:A,onhighlight:A,onrender:A,onrequest:A,getListData:function(AE){return AE},getInputValueFromHighlightedItem:function(){return this.data[this.getSelectedIndex()]},getSelectedIndex:function(){if(!this.selectedItem){return -1}var AF=this.selectedItem.parentNode.childNodes,AG,AE;for(AG=0,AE=AF.length;AG<AE;AG++){if(AF[AG]===this.selectedItem){return AG}}return -1},getSelectedDataItem:function(){return this.data[this.getSelectedIndex()]}};return V;function y(AF){var AE=document.getElementById(AF.id+"-input");R.addCallback(AE,"keyup",i);R.addCallback(AE,"keydown",o);R.addCallback(AE,"blur",z);AF.selectedItem=null;AF.value=AE.value||null}function i(AF){if(S.ARROW_KEY_EXP.test(AF.keyCode)||AF.keyCode===S.ENTER){return w&&w.stop()}var AG=this.id.replace(/-input$/,""),AE=x.getById(AG);this.defaultValue=this.value;if(!AE.requestInputPattern.test(this.value)){s(AE);r(AE)}else{if(!h(AE,this.defaultValue)){s(AE);X(AE)}}}function o(AF){var AG=AF.keyCode,AE=x.getById(this.id.replace("-input",""));if(!h(AE,this.defaultValue)){return}if(!w||!w.playing){if(AG===S.UP){return T(AE)}else{if(AG===S.DOWN){return n(AE)}}}if(AG===S.ESC&&p(AE)){t(AE)}else{if(AG===S.ENTER&&p(AE)){t(AE);R.preventDefault(AF)}}}function z(){var AE=this.id.substring(0,this.id.indexOf("-"));s(x.getById(AE))}function t(AE){s(AE);if(AE.onchange()!==false){r(AE)}}function r(AF){var AE=document.getElementById(AF.id+"-input");AF.value=AE.value}function p(AE){var AF=document.getElementById(AE.id+"-list");return AF.style.display!=="none"}function s(AE){var AF=document.getElementById(AE.id+"-list");if(AF){AF.style.display="none"}}function h(AF,AE){return AE===AF.listValue&&AF.data.length>0&&document.getElementById(AF.id+"-list")!==null}function T(AE){var AF=AE.selectedItem;if(!AF){AF=document.getElementById(AE.id+"-list").lastChild}else{AF=AF.previousSibling}if(AF){k(AE,AF);AC(AE,"prev")}}function n(AE){var AF=AE.selectedItem;if(!AF){AF=document.getElementById(AE.id+"-list").firstChild}else{AF=AF.nextSibling}if(AF){k(AE,AF);AC(AE,"next")}}var w,e;function AC(AF,AE){c();e=AE;if(w){w.run=function(AG){if(e==="next"){n(AF)}else{if(e==="prev"){T(AF)}}};if(!w.playing){w.startAfter(400)}}}function c(){if(!w&&N){w=new N.Animation(3000)}}function k(AG,AF){if(p(AG)){u(AG);AG.selectedItem=AF;if(B){AF.scrollIntoView(false)}if(AG.onhighlight()!==false){var AE=document.getElementById(AG.id+"-input");AE.value=AG.getInputValueFromHighlightedItem()}}else{d(AG)}b(AG)}function u(AE){if(AE.selectedItem===null){return}P.removeClass(AE.selectedItem,F)}function b(AE){P.addClass(AE.selectedItem,F)}function X(AG){var AH=q(AG),AF=document.getElementById(AG.id+"-input"),AE;AG.value=AF.value;AE=AG.paramName+"="+AG.getValueForServer()+a(AG);if(AH.post){AH.onsucceed=m;AG.callback=v}else{AG.callback=U}AH.abort();AH.get(AE);AG.onrequest()}function v(AE){return AE}function U(AE){this.responseObject=AE;this.data=this.getListData(AE)}function a(AE){return AE.jsonpParamName?"&"+AE.jsonpParamName+"="+l(AE):""}function l(AE){return encodeURIComponent("APE.widget.Autocomplete.instances."+AE.id+".callback")}function q(AE){return(AE.loader||O.ajax.AsyncRequest).getById(AE.id,AE.dataSource)}function m(){var AG=x.getById(this.id),AE=document.getElementById(AG.id+"-input"),AF=j(AG,this.req.responseText);AG.data=AG.getListData(AF);AG.responseObject=AF;AG.selectedItem=null;AG.listValue=AE.defaultValue=AG.value;if(AG.data&&AG.data.length>0){Y(AG,AA(AG));AG.onrender();d(AG);AB(AG)}}function j(AF,AG){if(AG){var AE=new Function("return("+AG+");");return AE()}return""}function d(AE){var AG=AA(AE),AF=AE.selectedItem;AG.style.display="block";if(AF&&B){AF.scrollIntoView(false)}}function AB(AH){if(AH.matcher){var AG,AI=document.getElementById(AH.id+"-list"),AE=AI.getElementsByTagName("li"),AF=[];for(AG=0;AG<AE.length;AG++){Z(AH,AE[AG],AF)}}}function Z(AH,AG,AF){try{AH.matcher(AG,AH.value,AG[P.TEXT_CONTENT])}catch(AE){len=AF[AF.length]=AE.message}if(AF.length){setTimeout(function(){throw AF},1)}}function AA(AF){var AH=AF.id,AE=AF.id+"-list",AG=document.getElementById(AE);if(!AG){AG=document.createElement("ul");AG.id=AE;AG.className="ape-autocomplete-list"}return AG}function Y(AI,AJ){var AF=AI.data,AE=AF.length,AH=[],AG;AH.length=AE;AJ.id=AI.id+"-list";for(AG=0;AG<AE;AG++){AH[AG]="<li>"+AI.itemRenderer(AF[AG])+"</li>"}AJ.innerHTML=AH.join("");document.getElementById(AI.id).appendChild(AJ);B=!!AJ.childNodes[0].scrollIntoView;R.addCallback(AJ,"click",f);R.addCallback(AJ,"mouseover",W);return AJ}function f(AG){var AF,AE=g(AG,this);if(AE){AF=x.getById(this.id.replace(/-list$/,""));k(AF,AE);setTimeout(function(){t(AF);document.getElementById(AF.id+"-input").focus()},140);AE=null}}function W(AF){var AE=g(AF,this);if(AE){AE.onmouseout=AD;P.addClass(AE,C)}}function AD(AF){var AE=R.getRelatedTarget(AF);if(!P.contains(this,AE)){P.removeClass(this,C)}}function g(AF,AG){var AE=R.getTarget(AF);if(AE.tagName!=="LI"){AE=P.findAncestorWithTagName(AE,"LI",AG)}return AE}}});