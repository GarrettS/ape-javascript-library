APE.test.TestReporter=function(H,G){APE.EventPublisher.add(H,"oncomplete",I);var B;function I(){B=document.createElement("b");B.appendChild(document.createTextNode("\u00a0PASS"));B.className="pass-flag";G=G||document.body.lastChild;var K=F(this);G.parentNode.insertBefore(K,G);G=null;B=null}this.insertBefore=function(M,K){var L=F(H,M.ownerDocument);M.insertBefore(L,K||M.firstChild)};function F(N,Q){Q=Q||document;var P=Q.createElement("ul"),M=N.testableList,O,L=M.length,K;for(O=0;O<L;O++){K=E(M[O],Q);K.className="test-case";P.appendChild(K)}P.onclick=A;return P}function D(P,O){O=O||document;var N=O.createElement("ul"),M,L=P.length,K;for(M=0;M<L;M++){K=C(P[M],O);N.appendChild(K)}return N}function C(Q){var L=document.createElement("li"),P=document.createElement("ul"),M,R,K,O=Q.stack,N;R=L.cloneNode(false);K=L.cloneNode(false);K.className="errorStack";R.appendChild(document.createTextNode("message: "+Q.message));if(Q.stack){K.appendChild(document.createTextNode("stack: "));O=O.replace("@","<br>@");N=document.createElement("pre");N.innerHTML=O;K.appendChild(N)}L.appendChild(document.createTextNode(Q.name+":"));P.appendChild(R);P.appendChild(K);L.appendChild(P);L.className="error";return L}function E(N,P){var L=P.createElement("li"),O=N.errorList.length,K=!!O,M=!!N.testableList.length,Q='"'+N.name;if(N.parent&&!N.parent.parent){Q+='"; failure count: '+O}L.id=N.id;APE.dom.addClass(L,K?"test-fail":"test-pass");L.appendChild(P.createTextNode(Q));if(M){L.appendChild(F(N,P))}else{if(K){L.appendChild(D(N.errorList,P))}else{L.appendChild(B.cloneNode(true))}}return L}function A(K){var L=APE.dom.Event.getTarget(K);if(L.tagName==="LI"){J(L)}APE.dom.Event.stopPropagation(K)}function J(K){APE.dom.toggleClass(K,"expandedNode")}};