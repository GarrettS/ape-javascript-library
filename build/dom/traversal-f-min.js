APE.namespace("APE.dom").mixin(function(){var D=document.documentElement,B="getNamedItem" in D.attributes,K="parentNode",H=/^H/.test(D.tagName)?"toUpperCase":"toLowerCase";D=null;return{contains:E,isOrContains:J,findAncestorWithAttribute:A,findAncestorWithTagName:L,findNextSiblingElement:C,findPreviousSiblingElement:G,getChildElements:I};function E(N,M){var Q=document.documentElement,P="compareDocumentPosition",O=(P in Q)?function(S,R){return S&&R&&((S[P](R)&16)!==0)}:("contains" in Q)?function(S,R){return S&&S!==R&&S.contains(R)}:function(S,R){if(!S||!R||S===R){return false}while(S&&S!==R&&(R=R[K])!==null){}return S===R};Q=null;return(E=APE.dom.contains=O)(N,M)}function J(N,M){return N===M||APE.dom.contains(N,M)}function A(O,R,P){for(var M,Q,N=O[K];N!==null;){Q=N.attributes;if(!Q||!B){return null}M=Q.getNamedItem(R);if(M&&M.specified){if(M.value===P||(P===undefined)){return N}}N=N[K]}return null}function L(P,M,N){M=M[H]();N=N||null;for(var O=P[K];O&&O!==N;){if(O.tagName===M){return O}O=O[K]}return null}function C(M){return F(M,"nextSibling")}function G(M){return F(M,"previousSibling")}function F(M,N){for(var O=M[N];O!==null;O=O[N]){if(O.nodeType===1){return O}}return null}function I(Q){var P,O,N=[],S=Q.childNodes,M=S.length,R;N.length=M;for(P=O=0;P<M;P++){R=S[P];if(R.nodeType!==1){continue}N[O++]=R}N.length=O;return N}}());