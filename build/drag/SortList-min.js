(function(){APE.drag.SortList=APE.createFactory("SortList",A);function A(C){var F=APE.dom,G=APE.drag,E=G.Draggable;function B(M,K){this.id=M;var L=document.getElementById(M);L.onmousedown=H;this.dragOptions=K}function H(L){var N=F.Event.getTarget(L),K=N.tagName==="LI"?N:F.findAncestorWithTagName(N,"LI"),M;if(K){M=E.getByNode(K,C.getById(this.id).dragOptions);M.ondragend=J}}function J(S){var N=this.el,T=F.Event.getCoords(S.domEvent),R=S.draggableList,O=N.parentNode,L,M,P,K=[],Q=0;F.addClass(O,"hiddenSelection");M=D(O,R,T.y);for(L in R){N=R[L].el;N.style.top="";K[Q++]=N}if(Q>1){K.sort(I)}for(P=0;P<K.length;P++){O.insertBefore(K[P],M)}F.removeClass(O,"hiddenSelection")}function D(N,O,P){var R=N.getElementsByTagName("li"),Q,K,M,L,S=F.getOffsetCoords(N).y;for(M=0;M<R.length;M++){Q=R[M];L=Q.id;if(!L||!(L in O)){K=F.getOffsetCoords(Q).y;if(K+S>P){return Q}}}return null}var I=function(L,K){var M=document.documentElement,N;if(typeof M.sourceIndex=="number"){N=function(P,O){return P.sourceIndex-O.sourceIndex}}else{if("compareDocumentPosition" in M){N=function(P,O){return O.compareDocumentPosition(P)-3}}else{N=function(P,O){for(var Q=P.nextSibling;Q!==null;Q=Q.nextSibling){if(Q==O){return -1}}return 1}}}M=null;return(I=N)(L,K)};return B}})();