APE.namespace("APE.dom");(function(){var F="addEventListener" in this,G=F?"target":"srcElement",L=F?"focus":"focusin",J=F?"blur":"focusout";APE.mixin(APE.dom.Event={},{getTarget:B,addCallback:K,removeCallback:E,addDelegatedFocus:M,addDelegatedBlur:D,removeDelegatedFocus:C,removeDelegatedBlur:A,preventDefault:H,stopPropagation:I});function B(P){P=P||window.event;if(!P){return null}var O=(P||window.event)[G];if(O==null){return null}if(O.nodeName==="#text"){O=O.parentNode}return O}function N(P,O){return function(Q){O.call(P,Q)}}function K(S,R,P,O){if(F){S.addEventListener(R,P,!!O)}else{var Q=N(S,P);S.attachEvent("on"+R,Q)}return Q||P}function E(R,Q,P,O){if(F){R.removeEventListener(Q,P,!!O)}else{R.detachEvent("on"+Q,P)}return P}function M(P,O){return K(P,L,O,true)}function D(P,O){return K(P,J,O,true)}function C(P,O){E(P,L,O,true)}function A(P,O){E(P,J,O,true)}function H(O){O=O||window.event;if("preventDefault" in O){O.preventDefault()}else{if("returnValue" in O){O.returnValue=false}}}function I(O){if(F){O.stopPropagation()}else{(window.event||O).cancelBubble=true}}})();