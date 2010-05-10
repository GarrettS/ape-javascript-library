(function(){var I="instances",J="prototype",B=Object[J],E=B.hasOwnProperty,A=["toString","valueOf"];function P(){}function N(Q,F){return O.call(Q,F)}function H(T){var U=T.split("."),R=self,S=0,F=U.length,Q;for(;S<F;S++){Q=U[S];if(!G(R,Q)){R[Q]=new L(R,Q)}R=R[Q]}return R}function O(R){if(!R){return}var S,Q=0,F;for(S in R){if(G(R,S)){this[S]=R[S]}}for(;Q<A.length;Q++){F=A[Q];if(G(R,F)){this[F]=R[F]}}return this}function D(F,S,Q){P[J]=S[J];var R=F[J]=new P;if(typeof Q=="object"){N(R,Q)}R.constructor=F;return F}function L(R,F){var Q=R.qualifiedName?R.qualifiedName+".":"";this.qualifiedName=Q+F}L[J]={toString:function(){return"["+this.qualifiedName+"]"},defineFactory:function(F,Q){M(this,F);return this[F]=new C(F,Q)},defineCustomFactory:function(F,Q){M(this,F);return this[F]=new C(F,Q,true)},mixin:O};function M(Q,F){if(G(Q,F)){throw Error(F+" is already defined on "+Q)}}function C(Q,S,U){var R=0,T;this.name=Q;this.getById=this.getByNode=F;if(U){S=S(this)}function F(X,V){if(typeof X.id==="string"){X=X.id||(X.id=Q+R++)}var W=this[I];if(!W){W=this[I]={};T=S(this)}return W[X]||(W[X]=new T(X,V))}}C[J].toString=function(){return"Factory "+this.name};function G(R,Q){if(Q in R){if(E){return E.call(R,Q)}var F=R.__proto__;if(F){return !(Q in F)||F[Q]!==R[Q]}return B[Q]!==R[Q]}return false}if(E&&!E.call(self,"Object")){var K=E;E=B.hasOwnProperty=function(F){return(this===self)?(F in this&&this[F]!==B[F]):K.call(this,F)}}H("APE").mixin({namespace:H,createSubclass:D,createFactory:function(F,Q){return new C(F,Q)},createMixin:N})})();(function(){var APE=self.APE,Registry={},isMaybeLeak
/*@cc_on=(@_jscript_version<5.7)@*/
;function EventPublisher(src,type){this.src=src;this._callStack=[];this.type=type}APE.EventPublisher=APE.createMixin(EventPublisher,{get:get,add:add,remove:remove,fire:fire,cleanUp:cleanUp,prototype:{add:function(fp,thisArg){this._callStack.push([fp,thisArg||this.src]);return this},addBefore:function(f,thisArg){return add(this,"beforeFire",f,thisArg||this.src)},addAfter:function(f,thisArg){return add(this,"afterFire",f,thisArg||this.src)},getEvent:function(type){return get(this,type)},remove:function(fp,thisArg){var cs=this._callStack,i,call;thisArg=thisArg||this.src;for(i=0;i<cs.length;i++){call=cs[i];if(call[0]===fp&&call[1]===thisArg){cs.splice(i,1)}}return this},removeBefore:function(fp,thisArg){return get(this,"beforeFire").remove(fp,thisArg||this.src)},removeAfter:function(fp,thisArg){return get(this,"afterFire").remove(fp,thisArg||this.src)},fire:function(payload){return fire(this)(payload)},toString:function(){return"APE.EventPublisher: {src="+this.src+", type="+this.type+", length="+this._callStack.length+"}"}}});function cleanUp(){var type,publisherList,publisher,i,len;for(type in Registry){publisherList=Registry[type];for(i=0,len=publisherList.length;i<len;i++){publisher=publisherList[i];publisher.src[publisher.type]=null}}Registry={}}function add(src,sEvent,fp,thisArg){return get(src,sEvent).add(fp,thisArg)}function remove(src,sEvent,fp,thisArg){return get(src,sEvent).remove(fp,thisArg)}function fire(publisher){return fireEvent;function fireEvent(e){var preventDefault=false,i,cs=publisher._callStack,csi;if(typeof publisher.beforeFire=="function"){try{if(publisher.beforeFire(e)==false){preventDefault=true}}catch(ex){deferError(ex)}}for(i=0;i<cs.length;i++){csi=cs[i];try{if(csi[0].call(csi[1],e)==false){preventDefault=true}}catch(ex){deferError(ex)}}if(typeof publisher.afterFire=="function"){if(publisher.afterFire(e)==false){preventDefault=true}}return !preventDefault}}function deferError(error){self.setTimeout(function(){throw error},1)}function get(src,sEvent){var publisherList=Registry[sEvent]||(Registry[sEvent]=[]),i,len,publisher;for(i=0,len=publisherList.length;i<len;i++){publisher=publisherList[i];if(publisher.src===src){return publisher}}publisher=new EventPublisher(src,sEvent);if(src[sEvent]){publisher.add(src[sEvent],src)}src[sEvent]=fire(publisher);publisherList[len]=publisher;return publisher}if(isMaybeLeak){get(window,"onunload").addAfter(cleanUp,EventPublisher)}})();APE.namespace("APE.dom").mixin(function(){var A="ownerDocument",C=document,D=C.documentElement,B=C.defaultView;return{TEXT_CONTENT:typeof D.textContent==="string"?"textContent":"innerText",OWNER_DOCUMENT:D&&typeof D[A]!=="undefined"?A:"document",IS_COMPUTED_STYLE:(typeof B!="undefined"&&"getComputedStyle" in B)}}());APE.namespace("APE.dom").key={LEFT:37,UP:38,RIGHT:39,DOWN:40,ARROW_KEY_EXP:/^(?:37|38|39|40)$/,ENTER:13,TAB:9,ESC:27};APE.namespace("APE.dom");(function(){var A="documentElement",E=document[A].clientWidth===0,D=APE.dom;D.mixin({getScrollOffsets:B,getViewportDimensions:C});function B(H){H=H||window;var G,F;if("pageXOffset" in H){G=function(I){I=I||window;return{left:I.pageXOffset,top:I.pageYOffset}}}else{G=function(J){J=J||window;var I=J.document[E?"body":A];return{left:I.scrollLeft,top:I.scrollTop}}}F=(D.getScrollOffsets=G)(H);H=null;return F}function C(K){K=K||window;var G="document",M=G,L=K[G],N="client",I,J,F;if(typeof L.clientWidth=="number"){G="window"}else{if(E){G=A;M="body"}else{if(L[A].clientHeight>0){M=A}}}I=N+"Width";J=N+"Height";function H(P){var O=(P||window)[G][M];return{width:O[I],height:O[J]}}F=(D.getViewportDimensions=H)(K);K=L=null;return F}})();APE.namespace("APE.dom");(function(){var B=APE.dom,N=typeof document.createElement("p").scrollLeft=="number";APE.createMixin(B,{getOffsetCoords:J,isAboveElement:U,isBelowElement:D,isInsideElement:P,IS_SCROLL_SUPPORTED:N});var I=this.document,c,O=I.documentElement,f=Math.round,W=Math.max,S=self.parseFloat,k="getComputedStyle",Z="defaultView",e=O&&O.clientWidth===0,Q="clientTop" in O,X=/^h/.test(O.tagName)?"table":"TABLE",j="currentStyle" in O,K,C,b,L,i,g,d,T,Y,F,A,H=I[Z]&&typeof I[Z][k]!="undefined",G="getBoundingClientRect",M="relative",R="borderTopWidth",a="borderLeftWidth",E=/^(?:r|a)/,V=/^(?:a|f)/;I=O=null;function J(m,AE,AK){var AQ=m[B.OWNER_DOCUMENT],AO=AQ.documentElement,AB=AQ.body;if(!AE){AE=AQ}if(!AK){AK={x:0,y:0}}AK.x=AK.y=0;if(m===AE){return AK}if(G in m){var AM=e?AB:AO,z=m[G](),w=z.left+W(AO.scrollLeft,AB.scrollLeft),u=z.top+W(AO.scrollTop,AB.scrollTop),AJ,AG=AM.clientTop,n=AM.clientLeft;if(Q){w-=n;u-=AG}if(AE!==AQ){z=J(AE,null);w-=z.x;u-=z.y;if(Q){if(e&&AE===AB){w-=n;u-=AG}else{if(AE!==AQ&&AE!==AO&&AE!==AB){w-=AE.clientLeft;u-=AE.clientTop}}}}if(e&&j&&AE!=AQ&&AE!==AB){AJ=AB.currentStyle;w+=S(AJ.marginLeft)||0+S(AJ.left)||0;u+=S(AJ.marginTop)||0+S(AJ.top)||0}AK.x=w;AK.y=u;return AK}else{if(H){if(!c){h()}var s=m.offsetLeft,AL=m.offsetTop,AH=AQ[Z],r=AH[k](m,"")||m.style;if(r.position=="fixed"&&N){AK.x=s+AO.scrollLeft;AK.y=AL+AO.scrollTop;return AK}var AA=AH[k](AB,""),AC=!E.test(AA.position),q=m,t=m.parentNode,l=m.offsetParent;for(;t&&t!==AE;t=t.parentNode){if(t!==AB&&t!==AO&&N){s-=t.scrollLeft;AL-=t.scrollTop}if(t===l){if(t===AB&&AC){}else{if(!K&&!(t.tagName===X&&i)){var p=AH[k](t,"");s+=S(p[a])||0;AL+=S(p[R])||0}if(t!==AB){s+=l.offsetLeft;AL+=l.offsetTop;q=l;l=t.offsetParent}}}}var v=0,AI=0,AP,AD,AN=AE===AQ||AE===AO,AF,o;if(q!=AQ){r=AH[k](q,"");if(r){o=r.position;AP=V.test(o);AD=AP||E.test(o)}}if((q===m&&m.offsetParent===AB&&!C&&AE!==AB&&!(AC&&L))||(C&&q===m&&!AD)||!AC&&AD&&d&&AN){AI+=S(AA.marginTop)||0;v+=S(AA.marginLeft)||0}if(AE===AB){AF=AH[k](AO,"");if((!AC&&((Y&&!AP)||(F&&AP)))||AC&&T){AI-=S(AF.paddingTop)||0;v-=S(AF.paddingLeft)||0}if(A){if(!AD||AD&&!AC){AI-=S(AF.marginTop)||0}v-=S(AF.marginLeft)||0}}if(AC){if(g||(!AP&&!K&&AN)){AI+=S(AA[R]);v+=S(AA[a])}}else{if(L){if(AN){if(!b){AI+=S(AA.top)||0;v+=S(AA.left)||0;if(AP&&K){AI+=S(AA[R]);v+=S(AA[a])}}if(AE===AQ&&!AC&&!Y){if(!AF){AF=AH[k](AO,"")}AI+=S(AF.paddingTop)||0;v+=S(AF.paddingLeft)||0}}else{if(b){AI-=S(AA.top);v-=S(AA.left)}}if(C&&(!AD||AE===AB)){AI-=S(AA.marginTop)||0;v-=S(AA.marginLeft)||0}}}AK.x=f(s+v);AK.y=f(AL+AI);return AK}}}function h(){c=true;var AC=document,p=AC.body;if(!p){return}var l="marginTop",AE="position",r="padding",AB="static",v="border",q=p.style,AF=q.cssText,AA="1px solid transparent",m="0",u="1px",w="offsetTop",t=AC.documentElement.style,AD=t.cssText,o=AC.createElement("div"),n=o.style,y=AC.createElement(X);q[r]=q[l]=q.top=m;t.position=AB;q[v]=AA;n.margin=m;n[AE]=AB;o=p.insertBefore(o,p.firstChild);K=(o[w]===1);q[v]=m;y.innerHTML="<tbody><tr><td>x</td></tr></tbody>";y.style[v]="7px solid";y.cellSpacing=y.cellPadding=m;p.insertBefore(y,p.firstChild);i=y.getElementsByTagName("td")[0].offsetLeft===7;p.removeChild(y);q[l]=u;q[AE]=M;C=(o[w]===1);L=p[w]===0;q[l]=m;q.top=u;b=o[w]===1;q.top=m;q[l]=u;q[AE]=n[AE]=M;d=o[w]===0;n[AE]="absolute";q[AE]=AB;if(o.offsetParent===p){q[v]=AA;n.top="2px";g=o[w]===1;q[v]=m;n[AE]=M;t[r]=u;q[l]=m;T=o[w]===3;q[AE]=M;Y=o[w]===3;n[AE]="absolute";F=o[w]===3;t[r]=m;t[l]=u;A=o[w]===3}p.removeChild(o);q.cssText=AF||"";t.cssText=AD||""}function P(m,l){var o=J(m).y,n=J(l).y;return o+m.offsetHeight<=n+l.offsetHeight&&o>=n}function U(m,l){return(J(m).y<=J(l).y)}function D(m,l){return(J(m).y+m.offsetHeight>=J(l).y+l.offsetHeight)}})();APE.namespace("APE.dom").mixin(function(){var B={},D=APE.dom,C,E,F,I,J,K=document.documentElement.classList!=undefined;function A(M,L){var N=M+"$"+L;return B[N]||(B[N]=RegExp("(?:^|\\s)"+M+"(?:$|\\s)",L))}if(!K){E=function(M,L){return A(L,"").test(M.className)};F=function(M,L){if(!M.className){M.className=L}else{if(!A(L).test(M.className)){M.className+=" "+L}}};I=function(M,L){var N=M.className;if(N){M.className=N===L?"":C(N.replace(A(L,"g")," "))}};J=function(M,L){(E(M,L)?I:F)(M,L)};C=function(L){return L.replace(/^\s+|\s+$/g,"").replace(/\s\s+/g," ")}}else{E=function(M,L){return M.classList.contains(L)};F=function(M,L){return M.classList.add(L)};I=function(M,L){return M.classList.remove(L)};J=function(M,L){M.classList.toggle(L)}}function H(M,N,T){if(!T){return[]}N=N||"*";if(M.getElementsByClassName&&(N==="*")){return M.getElementsByClassName(T)}var O=A(T,""),Q=M.getElementsByTagName(N),S=[],R=S.length=Q.length,L=0,P;for(P=0;P<R;P++){if(O.test(Q[P].className)){S[L++]=Q[P]}}S.length=L;return S}function G(O,L,M){if(O==null||O===M){return null}for(var N=O.parentNode;N&&N!=M&&N.className;){if(E(N,L)){return N}N=N.parentNode}return null}return{hasClass:E,addClass:F,removeClass:I,toggleClass:J,getElementsByClassName:H,findAncestorWithClass:G}}());APE.namespace("APE.dom").mixin(function(){var D=document.documentElement,B="getNamedItem" in D.attributes,K="parentNode",H=/^H/.test(D.tagName)?"toUpperCase":"toLowerCase";D=null;return{contains:E,isOrContains:J,findAncestorWithAttribute:A,findAncestorWithTagName:L,findNextSiblingElement:C,findPreviousSiblingElement:G,getChildElements:I};function E(O,M){if(!O){return false}var P="compareDocumentPosition",N=(P in O)?function(S,R){try{return !!(S&&R)&&((S[P](R)&16)!==0)}catch(Q){return false}}:("contains" in O)?function(R,Q){return !!R&&R!==Q&&R.contains(Q)}:function(R,Q){if(!R||!Q||R===Q){return false}while(R&&R!==Q&&(Q=Q[K])!==null){}return R===Q};return(E=APE.dom.contains=N)(O,M)}function J(N,M){return N===M||APE.dom.contains(N,M)}function A(O,R,P){for(var M,Q,N=O[K];N!==null;){Q=N.attributes;if(!Q||!B){return null}M=Q.getNamedItem(R);if(M&&M.specified){if(M.value===P||(P===undefined)){return N}}N=N[K]}return null}function L(P,M,N){M=M[H]();N=N||null;for(var O=P[K];O&&O!==N;){if(O.tagName===M){return O}O=O[K]}return null}function C(M){return F(M,"nextSibling")}function G(M){return F(M,"previousSibling")}function F(M,N){for(var O=M[N];O!==null;O=O[N]){if(O.nodeType===1){return O}}return null}function I(Q){var P,O,N=[],S=Q.childNodes,M=S.length,R;N.length=M;for(P=O=0;P<M;P++){R=S[P];if(R.nodeType!==1){continue}N[O++]=R}N.length=O;return N}}());APE.namespace("APE.dom").Event=(function(){var F="addEventListener" in this,G=F?"target":"srcElement",L={get:C,getTarget:B,getRelatedTarget:A,add:J,addCallback:J,remove:E,removeCallback:E,purgeEvents:D,preventDefault:H,stopPropagation:I,toString:function(){return"APE.dom.Event"}};function C(M,N){L.get=O;var U=F?"focus":"focusin",T=F?"blur":"focusout",V={},P,S={focus:U,blur:T},R;function Q(X,W){if(!X.addEventListener&&!X.attachEvent){throw TypeError(X+" is not a compatible object.")}this.src=X;this.type=W;this._callStack=[]}Q.prototype={add:function(Y){Q.prototype.add=X;this.add(Y);function X(c){var b=this.src,Z=S[this.type],a=Z||this.type;if(F){b.addEventListener(a,c,!!Z)}else{c=W(b,c);b.attachEvent("on"+a,c)}this._callStack.push(c)}function W(b,Z){if(b===window){return Z}function a(c){a.original.call(a.context,c||window.event)}a.original=Z;a.context=b;Z=b=null;return a}},remove:function(Y){Q.prototype.remove=W;this.remove(Y);function W(Z){Z=X(this._callStack,Z);if(Z){if(F){this.src.removeEventListener(this.type,Z,this.type in S)}else{this.src.detachEvent("on"+this.type,Z)}}}function X(b,d){var a,c,Z;for(c=0,Z=b.length;c<Z;c++){a=b[c];if((a.original||a)===d){delete a.original;delete a.context;return b.splice(c,1)[0]}}return null}},purge:function(){var X=this._callStack,W,Y;for(Y=X.length;Y-->0;X.length=Y){W=X[Y];this.remove(W.original||W)}},toString:function(){return"DomEventPublisher: src: "+this.src+", type: "+this.type}};function O(b,a){var Z=V[a]||(V[a]=[]),X,W,Y;for(X=0,W=Z.length;X<W;X++){Y=Z[X];if(Y.src===b){return Y}}Y=new Q(b,a);Z[W]=Y;return Y}if(P){O(window,"unload").add(R=function(){var Z,Y,W,X;for(Z in V){Y=V[Z];for(W=Y.length;W-->0;Y.length=W){X=Y[W];if(X.src!=X.src.window){X.purge()}}delete V[Z]}E(window,"unload",R)})}return O(M,N)}function B(M){return(L.getTarget=F?function(N){return N&&K(N,G)}:function(N){N=window.event;return N&&N.srcElement})(M)}function A(P){if(!F){var O={mouseover:"fromElement",mouseenter:"fromElement",mouseout:"toElement",mouseleave:"toElement"};return(L.getRelatedTarget=function(R){R=R||window.event;if(R){var Q=O[R.type],S=K(R,Q);return S}})(P)}if(P){var N=P.relatedTarget;try{N.nodeName}catch(M){}return N}}function K(O,M){var N=O[M];if(N&&N.nodeName==="#text"){N=N.parentNode}return N}function J(O,N,M){L.get(O,N).add(M)}function D(P,O){if(typeof O=="string"){L.get(P,O).purge()}else{for(var N=0,M=O.length;N<M;N++){L.get(P,O[N]).purge()}}}function E(P,O,N,M){L.get(P,O).remove(N)}function H(M){M=M||window.event;if("preventDefault" in M){M.preventDefault()}else{if("returnValue" in M){M.returnValue=false}}}function I(M){if(F){M.stopPropagation()}else{(window.event||M).cancelBubble=true}}return L})();APE.namespace("APE.dom.Event").getCoords=function(B){var C=APE.dom,A;if("pageX" in B){A=function(D){return{x:D.pageX,y:D.pageY}}}else{A=function(E){var D=C.getScrollOffsets();E=E||window.event;return{x:E.clientX+D.left,y:E.clientY+D.top}}}return(C.Event.getCoords=A)(B)};APE.namespace("APE.dom");(function(){var Q=APE.dom;Q.getStyle=D;Q.setOpacity=R;var E=Q.IS_COMPUTED_STYLE,P="currentStyle",O="opacity",F="style",G="px",J="filter",I="alpha("+O+"=",M=/^(?:margin|(border)(Width|Color|Style)|padding)$/,N=/\Wopacity\s*=\s*([\d]+)/i,A=/^auto|\d%$/,L="cssFloat",C=["Top","Right","Bottom","Left"];if(!(L in document.documentElement[F])){L="styleFloat"}function K(U){var W,V=U[J];if(!N.test(V)){return 1}W=N.exec(V);return W[1]/100}function R(X,U){var W=X[F],V;if(O in W){W[O]=U}else{if(J in W){W[J]=I+(U*100)+")";V=X[P];if(V&&!V.hasLayout){W.zoom=1}}}}function D(V,U){var c="",Z,Y,W,X,a,b=V[Q.OWNER_DOCUMENT];if(/float/.test(U)){U=L}if(E){Z=b.defaultView.getComputedStyle(V,"");if(!(U in Z)){return""}c=Z[U];if(c===""){c=S(Z,U).join(" ")}if(U=="zIndex"&&c=="normal"){return"0"}if(A.test(c)){c=T(V,U)}}else{Z=V[P];if(U===O){c=K(Z)}else{c=Z[U];if(A.test(c)){c=T(V,U)}else{if(!(U in Z)){return""}}}Y=H.exec(c);if(Y){W=c.split(" ");W[0]=B(V,Y[0]);for(X=1,a=W.length;X<a;X++){Y=H.exec(W[X]);W[X]=B(V,Y[0])}c=W.join(" ")}}return c}function T(W,V){var c=W[F],b,X,U,Y,a,Z;if("pixelWidth" in c&&/width|height|top|left/.test(V)){X="pixel"+(V.charAt(0).toUpperCase())+V.substring(1);b=c[X]}if(b){return b+G}if(V==="width"){a=W.clientLeft||0;U=parseFloat(D(W,"borderRightWidth"))||a;Z=parseFloat(D(W,"paddingLeft"))||0+parseFloat(D(W,"paddingRight"))||0;return W.offsetWidth-a-U-Z+G}else{if(V==="height"){Y=W.clientTop||0;U=parseFloat(D(W,"borderBottomWidth"))||Y;Z=parseFloat(D(W,"paddingTop"))||0+parseFloat(D(W,"paddingBottom"))||0;return W.offsetHeight-Y-U+G}else{if(V=="margin"&&W[P].position!="absolute"){b=parseFloat(D(W.parentNode,"width"))-W.offsetWidth;if(b===0){return"0px"}b="0px "+b;return b+" "+b}}}return"0"}function S(a,V){var W=M.exec(V),Y,e,Z,c,d,b=true,U,X=1;if(W&&W[0]){U=C;Y=W[1]||W[0];e=W[2]||""}else{return[""]}Z=a[Y+U[0]+e];d=[Z];while(X<4){c=a[Y+U[X]+e];b=b&&c==Z;Z=c;d[X++]=c}if(b){return[Z]}return d}var H=/(-?\d+|(?:-?\d*\.\d+))(?:em|ex|pt|pc|in|cm|mm\s*)/;function B(Y,Z){if(Y.runtimeStyle){if(parseFloat(Z)===0){return"0px"}var X=Y[F],W=X.left,V=Y.runtimeStyle,U=V.left;V.left=Y[P].left;X.left=(Z||0);Z=X.pixelLeft+G;X.left=W;V.left=U;return Z}}})();