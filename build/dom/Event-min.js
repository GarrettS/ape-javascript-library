APE.namespace("APE.dom");(function(){var A="addEventListener" in this,F=A?"target":"srcElement";APE.mixin(APE.dom.Event={},{eventTarget:F,getTarget:D,addCallback:E,removeCallback:G,preventDefault:B});function D(H){return(H||window.event)[F]}function C(I,H){return A?H:function(J){H.call(I,J)}}function E(K,J,H){if(A){K.addEventListener(J,H,false)}else{var I=C(K,H);K.attachEvent("on"+J,I)}return I||H}function G(J,I,H){if(A){J.removeEventListener(I,H,false)}else{J.detachEvent("on"+I,H)}return H}function B(H){H=H||window.event;if("preventDefault" in H){H.preventDefault()}else{if("returnValue" in H){H.returnValue=false}}}})();