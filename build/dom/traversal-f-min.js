APE.namespace("APE.dom");(function(){var D=document.documentElement,F="nodeType",E="tagName",H="parentNode",B="compareDocumentPosition",I=/^H/.test(D[E])?"toUpperCase":"toLowerCase",K=/^[A-Z]/;APE.mixin(APE.dom,{contains:L(),findAncestorWithAttribute:A,findAncestorWithTagName:M,findNextSiblingElement:C,findPreviousSiblingElement:G,getChildElements:J});function L(){if(B in D){return function(O,N){return(O[B](N)&16)!==0}}else{if("contains" in D){return function(O,N){return O!==N&&O.contains(N)}}}return function(O,N){if(O===N){return false}while(O!=N&&(N=N[H])!==null){}return O===N}}function A(P,S,Q){for(var R,O=P[H];O!==null;){R=O.attributes;if(!R){return null}var N=R[S];if(N&&N.specified){if(N.value===Q||(Q===undefined)){return O}}O=O[H]}return null}function M(P,N){N=N[I]();for(var O=P[H];O!==null;){if(O[E]===N){return O}O=O[H]}return null}function C(O){for(var N=O.nextSibling;N!==null;N=N.nextSibling){if(N[F]===1){return N}}return null}function G(N){for(var O=N.previousSibling;O!==null;O=O.previousSibling){if(O[F]===1){return O}}return null}function J(R){var Q=0,P=[],O,N,T=R.children||R.childNodes,S;for(O=T.length;Q<O;Q++){S=T[Q];if(S[F]!==1){continue}P[P.length]=S}return P}})();