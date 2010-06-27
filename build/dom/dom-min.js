APE.namespace("APE.dom").getConstants=function(G){G=G||document;var A="ownerDocument",H=G.documentElement,D="undefined",B=G.defaultView,F=G.compatMode,E,C=F?F!="BackCompat":((E=G.createElement("p").style).width="1",!E.width);return{TEXT_CONTENT:typeof H.textContent==="string"?"textContent":"innerText",IS_BODY_ACTING_ROOT:H.clientWidth===0,OWNER_DOCUMENT:H&&typeof H[A]!==D?A:"document",IS_CURRENT_STYLE_SUPPORTED:typeof H.currentStyle!=D,IS_COMPUTED_STYLE_SUPPORTED:!!B&&B.getComputedStyle!=D,IS_COMPUTED_STYLE:B&&B.getComputedStyle!=D,IS_CLIENT_TOP_SUPPORTED:typeof H.clientTop!=D,IS_XML_DOM:H.tagName==="html",IS_QUIRKS_MODE:!C}};APE.dom.mixin(APE.dom.getConstants(document));APE.namespace("APE.dom").key={LEFT:37,UP:38,RIGHT:39,DOWN:40,ARROW_KEY_EXP:/^(?:37|38|39|40)$/,ENTER:13,TAB:9,ESC:27};APE.namespace("APE.dom");(function(){var A="documentElement",D=APE.dom;D.mixin({getScrollOffsets:B,getViewportDimensions:C});function B(G){G=G||window;var F,E;if("pageXOffset" in G){F=function(H){H=H||window;return{left:H.pageXOffset,top:H.pageYOffset}}}else{F=function(I){I=I||window;var H=I.document[D.IS_BODY_ACTING_ROOT?"body":A];return{left:H.scrollLeft,top:H.scrollTop}}}E=(D.getScrollOffsets=F)(G);G=null;return E}function C(J){J=J||window;var F="document",L=F,K=J[F],M="client",H,I,E;if(typeof K.clientWidth=="number"){F="window"}else{if(D.IS_BODY_ACTING_ROOT){F=A;L="body"}else{if(K[A].clientHeight>0){L=A}}}H=M+"Width";I=M+"Height";function G(O){var N=(O||window)[F][L];return{width:N[H],height:N[I]}}E=(D.getViewportDimensions=G)(J);J=K=null;return E}})();APE.namespace("APE.dom");(function(){var G=APE.dom,B=Math.round,A=Math.max,H=typeof document.createElement("p").scrollLeft=="number";APE.createMixin(G,{getOffsetCoords:E,isAboveElement:D,isBelowElement:C,isInsideElement:F,IS_SCROLL_SUPPORTED:H});function E(K,I,R){var S=K[G.OWNER_DOCUMENT],T=S.documentElement,N=S.body;if(!I){I=S}if(!R){R={x:0,y:0}}R.x=R.y=0;if(K===I){return R}var J=G.IS_BODY_ACTING_ROOT?N:T,M=K.getBoundingClientRect(),Q=M.left+A(T.scrollLeft,N.scrollLeft),P=M.top+A(T.scrollTop,N.scrollTop),U,L=J.clientTop,O=J.clientLeft;if(G.IS_CLIENT_TOP_SUPPORTED){Q-=O;P-=L}if(I!==S){M=E(I,null);Q-=M.x;P-=M.y;if(G.IS_CLIENT_TOP_SUPPORTED){if(G.IS_BODY_ACTING_ROOT&&I===N){Q-=O;P-=L}else{if(I!==S&&I!==T&&I!==N){Q-=I.clientLeft;P-=I.clientTop}}}}if(G.IS_BODY_ACTING_ROOT&&G.IS_CURRENT_STYLE_SUPPORTED&&I!=S&&I!==N){U=N.currentStyle;Q+=parseFloat(U.marginLeft)||0+parseFloat(U.left)||0;P+=parseFloat(U.marginTop)||0+parseFloat(U.top)||0}R.x=Q;R.y=P;return R}function F(J,I){var L=G.getOffsetCoords(J).y,K=G.getOffsetCoords(I).y;return L+J.offsetHeight<=K+I.offsetHeight&&L>=K}function D(J,I){return(G.getOffsetCoords(J).y<=G.getOffsetCoords(I).y)}function C(J,I){return(G.getOffsetCoords(J).y+J.offsetHeight>=G.getOffsetCoords(I).y+I.offsetHeight)}})();(function(){var W=APE.dom,d=this.document,V,c=d.documentElement;if(W.IS_COMPUTED_STYLE_SUPPORTED&&!c.getBoundingClientRect){W.getOffsetCoords=Y;var Z=Math.round,T=Math.max,C=self.parseFloat,E="getComputedStyle",D="defaultView",M=typeof document.createElement("p").scrollLeft=="number",N=c&&c.clientWidth===0,L=/^h/.test(c.tagName)?"table":"TABLE",P,F,a,R,O,K,G,H,A,J,b,X="relative",U="borderTopWidth",B="borderLeftWidth",I=/^(?:r|a)/,Q=/^(?:a|f)/;d=c=null}function Y(f,r,v){var AA=f[W.OWNER_DOCUMENT],y=AA.documentElement,o=AA.body;if(!r){r=AA}if(!v){v={x:0,y:0}}v.x=v.y=0;if(f===r){return v}if(!V){S()}var k=f.offsetLeft,w=f.offsetTop,t=AA[D],j=t[E](f,"")||f.style;if(j.position=="fixed"&&M){v.x=k+y.scrollLeft;v.y=w+y.scrollTop;return v}var n=t[E](o,""),p=!I.test(n.position),h=f,l=f.parentNode,e=f.offsetParent;for(;l&&l!==r;l=l.parentNode){if(l!==o&&l!==y&&M){k-=l.scrollLeft;w-=l.scrollTop}if(l===e){if(l===o&&p){}else{if(!P&&!(l.tagName===L&&O)){var i=t[E](l,"");k+=C(i[B])||0;w+=C(i[U])||0}if(l!==o){k+=e.offsetLeft;w+=e.offsetTop;h=e;e=l.offsetParent}}}}var m=0,u=0,z,q,x=r===AA||r===y,s,g;if(h!=AA){j=t[E](h,"");if(j){g=j.position;z=Q.test(g);q=z||I.test(g)}}if((h===f&&f.offsetParent===o&&!F&&r!==o&&!(p&&R))||(F&&h===f&&!q)||!p&&q&&G&&x){u+=C(n.marginTop)||0;m+=C(n.marginLeft)||0}if(r===o){s=t[E](y,"");if((!p&&((A&&!z)||(J&&z)))||p&&H){u-=C(s.paddingTop)||0;m-=C(s.paddingLeft)||0}if(b){if(!q||q&&!p){u-=C(s.marginTop)||0}m-=C(s.marginLeft)||0}}if(p){if(K||(!z&&!P&&x)){u+=C(n[U]);m+=C(n[B])}}else{if(R){if(x){if(!a){u+=C(n.top)||0;m+=C(n.left)||0;if(z&&P){u+=C(n[U]);m+=C(n[B])}}if(r===AA&&!p&&!A){if(!s){s=t[E](y,"")}u+=C(s.paddingTop)||0;m+=C(s.paddingLeft)||0}}else{if(a){u-=C(n.top);m-=C(n.left)}}if(F&&(!q||r===o)){u-=C(n.marginTop)||0;m-=C(n.marginLeft)||0}}}v.x=Z(k+m);v.y=Z(w+u);return v}function S(){V=true;var t=document,i=t.body;if(!i){return}var e="marginTop",v="position",k="padding",r="static",n="border",j=i.style,w=j.cssText,q="1px solid transparent",f="0",m="1px",o="offsetTop",l=t.documentElement.style,u=l.cssText,h=t.createElement("div"),g=h.style,p=t.createElement(L);j[k]=j[e]=j.top=f;l.position=r;j[n]=q;g.margin=f;g[v]=r;h=i.insertBefore(h,i.firstChild);P=(h[o]===1);j[n]=f;p.innerHTML="<tbody><tr><td>x</td></tr></tbody>";p.style[n]="7px solid";p.cellSpacing=p.cellPadding=f;i.insertBefore(p,i.firstChild);O=p.getElementsByTagName("td")[0].offsetLeft===7;i.removeChild(p);j[e]=m;j[v]=X;F=(h[o]===1);R=i[o]===0;j[e]=f;j.top=m;a=h[o]===1;j.top=f;j[e]=m;j[v]=g[v]=X;G=h[o]===0;g[v]="absolute";j[v]=r;if(h.offsetParent===i){j[n]=q;g.top="2px";K=h[o]===1;j[n]=f;g[v]=X;l[k]=m;j[e]=f;H=h[o]===3;j[v]=X;A=h[o]===3;g[v]="absolute";J=h[o]===3;l[k]=f;l[e]=m;b=h[o]===3}i.removeChild(h);j.cssText=w||"";l.cssText=u||""}})();APE.namespace("APE.dom").mixin(function(){var B={},D=APE.dom,C,E,F,I,J,K=document.documentElement.classList!=undefined;function A(M,L){var N=M+"$"+L;return B[N]||(B[N]=RegExp("(?:^|\\s)"+M+"(?:$|\\s)",L))}if(!K){E=function(M,L){return A(L,"").test(M.className)};F=function(M,L){if(!M.className){M.className=L}else{if(!A(L).test(M.className)){M.className+=" "+L}}};I=function(M,L){var N=M.className;if(N){M.className=N===L?"":C(N.replace(A(L,"g")," "))}};J=function(M,L){(E(M,L)?I:F)(M,L)};C=function(L){return L.replace(/^\s+|\s+$/g,"").replace(/\s\s+/g," ")}}else{E=function(M,L){return M.classList.contains(L)};F=function(M,L){return M.classList.add(L)};I=function(M,L){return M.classList.remove(L)};J=function(M,L){M.classList.toggle(L)}}function H(M,N,T){if(!T){return[]}N=N||"*";if(M.getElementsByClassName&&(N==="*")){return M.getElementsByClassName(T)}var O=A(T,""),Q=M.getElementsByTagName(N),S=[],R=S.length=Q.length,L=0,P;for(P=0;P<R;P++){if(O.test(Q[P].className)){S[L++]=Q[P]}}S.length=L;return S}function G(O,L,M){if(O==null||O===M){return null}for(var N=O.parentNode;N&&N!=M&&N.className;){if(E(N,L)){return N}N=N.parentNode}return null}return{hasClass:E,addClass:F,removeClass:I,toggleClass:J,getElementsByClassName:H,findAncestorWithClass:G}}());APE.namespace("APE.dom").mixin(function(){var D=document.documentElement,B="getNamedItem" in D.attributes,K="parentNode",H=/^H/.test(D.tagName)?"toUpperCase":"toLowerCase";D=null;return{contains:E,isOrContains:J,findAncestorWithAttribute:A,findAncestorWithTagName:L,findNextSiblingElement:C,findPreviousSiblingElement:G,getChildElements:I};function E(O,M){if(!O){return false}var P="compareDocumentPosition",N=(P in O)?function(S,R){try{return !!(S&&R)&&((S[P](R)&16)!==0)}catch(Q){return false}}:("contains" in O)?function(R,Q){return !!R&&R!==Q&&R.contains(Q)}:function(R,Q){if(!R||!Q||R===Q){return false}while(R&&R!==Q&&(Q=Q[K])!==null){}return R===Q};return(E=APE.dom.contains=N)(O,M)}function J(N,M){return N===M||APE.dom.contains(N,M)}function A(O,R,P){for(var M,Q,N=O[K];N!==null;){Q=N.attributes;if(!Q||!B){return null}M=Q.getNamedItem(R);if(M&&M.specified){if(M.value===P||(P===undefined)){return N}}N=N[K]}return null}function L(P,M,N){M=M[H]();N=N||null;for(var O=P[K];O&&O!==N;){if(O.tagName===M){return O}O=O[K]}return null}function C(M){return F(M,"nextSibling")}function G(M){return F(M,"previousSibling")}function F(M,N){for(var O=M[N];O!==null;O=O[N]){if(O.nodeType===1){return O}}return null}function I(Q){var P,O,N=[],S=Q.childNodes,M=S.length,R;N.length=M;for(P=O=0;P<M;P++){R=S[P];if(R.nodeType!==1){continue}N[O++]=R}N.length=O;return N}}());APE.namespace("APE.dom").Event=function(){var F="addEventListener" in this,G=F?"target":"srcElement",L={get:C,getTarget:B,getRelatedTarget:A,add:J,addCallback:J,remove:E,removeCallback:E,purgeEvents:D,preventDefault:H,stopPropagation:I,toString:function(){return"APE.dom.Event"}};function C(M,N){L.get=O;var U=F?"focus":"focusin",T=F?"blur":"focusout",V={},P,S={focus:U,blur:T},R;function Q(X,W){if(!X.addEventListener&&!X.attachEvent){throw TypeError(X+" is not a compatible object.")}this.src=X;this.type=W;this._callStack=[]}Q.prototype={add:function(Y){Q.prototype.add=X;this.add(Y);function X(c){var b=this.src,Z=S[this.type],a=Z||this.type;if(F){b.addEventListener(a,c,!!Z)}else{c=W(b,c);b.attachEvent("on"+a,c)}this._callStack.push(c)}function W(b,Z){if(b===window){return Z}function a(c){a.original.call(a.context,c||window.event)}a.original=Z;a.context=b;Z=b=null;return a}},remove:function(Y){Q.prototype.remove=W;this.remove(Y);function W(Z){Z=X(this._callStack,Z);if(Z){if(F){this.src.removeEventListener(this.type,Z,this.type in S)}else{this.src.detachEvent("on"+this.type,Z)}}}function X(b,d){var a,c,Z;for(c=0,Z=b.length;c<Z;c++){a=b[c];if((a.original||a)===d){delete a.original;delete a.context;return b.splice(c,1)[0]}}return null}},purge:function(){var X=this._callStack,W,Y;for(Y=X.length;Y-->0;X.length=Y){W=X[Y];this.remove(W.original||W)}},toString:function(){return"DomEventPublisher: src: "+this.src+", type: "+this.type}};function O(b,a){var Z=V[a]||(V[a]=[]),X,W,Y;for(X=0,W=Z.length;X<W;X++){Y=Z[X];if(Y.src===b){return Y}}Y=new Q(b,a);Z[W]=Y;return Y}if(P){O(window,"unload").add(R=function(){var Z,Y,W,X;for(Z in V){Y=V[Z];for(W=Y.length;W-->0;Y.length=W){X=Y[W];if(X.src!=X.src.window){X.purge()}}delete V[Z]}E(window,"unload",R)})}return O(M,N)}function B(M){return(L.getTarget=F?function(N){return N&&K(N,G)}:function(N){N=window.event;return N&&N.srcElement})(M)}function A(P){if(!F){var O={mouseover:"fromElement",mouseenter:"fromElement",mouseout:"toElement",mouseleave:"toElement"};return(L.getRelatedTarget=function(R){R=R||window.event;if(R){var Q=O[R.type],S=K(R,Q);return S}})(P)}if(P){var N=P.relatedTarget;try{N.nodeName}catch(M){}return N}}function K(O,M){var N=O[M];if(N&&N.nodeName==="#text"){N=N.parentNode}return N}function J(O,N,M){L.get(O,N).add(M)}function D(P,O){if(typeof O=="string"){L.get(P,O).purge()}else{for(var N=0,M=O.length;N<M;N++){L.get(P,O[N]).purge()}}}function E(P,O,N,M){L.get(P,O).remove(N)}function H(M){M=M||window.event;if("preventDefault" in M){M.preventDefault()}else{if("returnValue" in M){M.returnValue=false}}}function I(M){if(F){M.stopPropagation()}else{(window.event||M).cancelBubble=true}}return L}();APE.dom.Event.getCoords=function(C){var D=APE.dom,B,A;if("pageX" in C){B=function(E){return{x:E.pageX,y:E.pageY}}}else{B=function(F){var E=D.getScrollOffsets();F=F||window.event;return{x:F.clientX+E.left,y:F.clientY+E.top}}}A=(D.Event.getCoords=B)(C);C=null;return A};APE.namespace("APE.dom");(function(){var Q=APE.dom;Q.getStyle=D;Q.setOpacity=R;var E=Q.IS_COMPUTED_STYLE_SUPPORTED,P="currentStyle",O="opacity",F="style",G="px",J="filter",I="alpha("+O+"=",M=/^(?:margin|(border)(Width|Color|Style)|padding)$/,N=/\Wopacity\s*=\s*([\d]+)/i,A=/^auto|\d%$/,L="cssFloat",C=["Top","Right","Bottom","Left"];if(!(L in document.documentElement[F])){L="styleFloat"}function K(U){var W,V=U[J];if(!N.test(V)){return 1}W=N.exec(V);return W[1]/100}function R(X,U){var W=X[F],V;if(O in W){W[O]=U}else{if(J in W){W[J]=I+(U*100)+")";V=X[P];if(V&&!V.hasLayout){W.zoom=1}}}}function D(V,U){var c="",Z,Y,W,X,a,b=V[Q.OWNER_DOCUMENT];if(/float/.test(U)){U=L}if(E){Z=b.defaultView.getComputedStyle(V,"");if(!(U in Z)){return""}c=Z[U];if(c===""){c=S(Z,U).join(" ")}if(U=="zIndex"&&c=="normal"){return"0"}if(A.test(c)){c=T(V,U)}}else{Z=V[P];if(U===O){c=K(Z)}else{c=Z[U];if(A.test(c)){c=T(V,U)}else{if(!(U in Z)){return""}}}Y=H.exec(c);if(Y){W=c.split(" ");W[0]=B(V,Y[0]);for(X=1,a=W.length;X<a;X++){Y=H.exec(W[X]);W[X]=B(V,Y[0])}c=W.join(" ")}}return c}function T(W,V){var c=W[F],b,X,U,Y,a,Z;if("pixelWidth" in c&&/width|height|top|left/.test(V)){X="pixel"+(V.charAt(0).toUpperCase())+V.substring(1);b=c[X]}if(b){return b+G}if(V==="width"){a=W.clientLeft||0;U=parseFloat(D(W,"borderRightWidth"))||a;Z=parseFloat(D(W,"paddingLeft"))||0+parseFloat(D(W,"paddingRight"))||0;return W.offsetWidth-a-U-Z+G}else{if(V==="height"){Y=W.clientTop||0;U=parseFloat(D(W,"borderBottomWidth"))||Y;Z=parseFloat(D(W,"paddingTop"))||0+parseFloat(D(W,"paddingBottom"))||0;return W.offsetHeight-Y-U+G}else{if(V=="margin"&&W[P].position!="absolute"){b=parseFloat(D(W.parentNode,"width"))-W.offsetWidth;if(b===0){return"0px"}b="0px "+b;return b+" "+b}}}return"0"}function S(a,V){var W=M.exec(V),Y,e,Z,c,d,b=true,U,X=1;if(W&&W[0]){U=C;Y=W[1]||W[0];e=W[2]||""}else{return[""]}Z=a[Y+U[0]+e];d=[Z];while(X<4){c=a[Y+U[X]+e];b=b&&c==Z;Z=c;d[X++]=c}if(b){return[Z]}return d}var H=/(-?\d+|(?:-?\d*\.\d+))(?:em|ex|pt|pc|in|cm|mm\s*)/;function B(Y,Z){if(Y.runtimeStyle){if(parseFloat(Z)===0){return"0px"}var X=Y[F],W=X.left,V=Y.runtimeStyle,U=V.left;V.left=Y[P].left;X.left=(Z||0);Z=X.pixelLeft+G;X.left=W;V.left=U;return Z}}})();APE.dom.getPixelCoords=function(B){var A,D=APE.dom,E=self.parseInt,C=(D.IS_COMPUTED_STYLE_SUPPORTED?function(G){var F=G[D.OWNER_DOCUMENT].defaultView.getComputedStyle(G,"");return{x:E(F.left,10)||0,y:E(F.top,10)||0}}:function(G){var F=G.style;return{x:F.pixelLeft||E(D.getStyle(G,"left"),10)||0,y:F.pixelTop||E(D.getStyle(G,"top"),10)||0}});A=(D.getPixelCoords=C)(B);B=null;return A};