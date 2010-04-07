(function(){if(typeof APE!=="undefined"){throw Error("APE is already defined.")}var I="instances",J="prototype",B=Object[J],E=B.hasOwnProperty,A=["toString","valueOf"];function O(){}function M(P,F){return N.call(P,F)}function H(S){var T=S.split("."),Q=self,R=0,F=T.length,P;for(;R<F;R++){P=T[R];if(!G(Q,P)){Q[P]=new L(Q,P)}Q=Q[P]}return Q}function N(Q){if(!Q){return}var R,P=0,F;for(R in Q){if(G(Q,R)){this[R]=Q[R]}}for(;P<A.length;P++){F=A[P];if(G(Q,F)){this[F]=Q[F]}}return this}function D(F,R,P){O[J]=R[J];var Q=F[J]=new O;if(typeof P=="object"){M(Q,P)}Q.constructor=F;return F}function L(Q,F){var P=Q.qualifiedName?Q.qualifiedName+".":"";this.qualifiedName=P+F}L[J]={toString:function(){return"["+this.qualifiedName+"]"},defineFactory:function(F,P){return this[F]=new C(F,P)},defineCustomFactory:function(F,P){return this[F]=new C(F,P,true)},mixin:N};function C(P,R,T){var Q=0,S;this.name=P;this.getById=this.getByNode=F;if(T){R=R(this)}function F(W,U){if(typeof W.id==="string"){W=W.id||(W.id=P+Q++)}var V=this[I];if(!V){V=this[I]={};S=R(this)}return V[W]||(V[W]=new S(W,U))}}C[J].toString=function(){return"Factory "+this.name};function G(Q,P){if(P in Q){if(E){return E.call(Q,P)}var F=Q.__proto__;if(F){return !(P in F)||F[P]!==Q[P]}return B[P]!==Q[P]}return false}if(E&&!E.call(self,"Object")){var K=E;E=B.hasOwnProperty=function(F){return(this===self)?(F in this&&this[F]!==B[F]):K.call(this,F)}}H("APE").mixin({namespace:H,createSubclass:D,createFactory:function(F,P){return new C(F,P)},createMixin:M})})();(function(){var APE=self.APE,Registry={},isMaybeLeak
/*@cc_on=(@_jscript_version<5.7)@*/
;APE.EventPublisher=EventPublisher;APE.createMixin(EventPublisher,{get:get,add:add,remove:remove,fire:fire,cleanUp:cleanUp});function EventPublisher(src,type){this.src=src;this._callStack=[];this.type=type}EventPublisher.prototype={add:function(fp,thisArg){this._callStack.push([fp,thisArg||this.src]);return this},addBefore:function(f,thisArg){return add(this,"beforeFire",f,thisArg||this.src)},addAfter:function(f,thisArg){return add(this,"afterFire",f,thisArg||this.src)},getEvent:function(type){return get(this,type)},remove:function(fp,thisArg){var cs=this._callStack,i,call;thisArg=thisArg||this.src;for(i=0;i<cs.length;i++){call=cs[i];if(call[0]===fp&&call[1]===thisArg){cs.splice(i,1)}}return this},removeBefore:function(fp,thisArg){return get(this,"beforeFire").remove(fp,thisArg||this.src)},removeAfter:function(fp,thisArg){return get(this,"afterFire").remove(fp,thisArg||this.src)},fire:function(payload){return fire(this)(payload)},toString:function(){return"APE.EventPublisher: {src="+this.src+", type="+this.type+", length="+this._callStack.length+"}"}};function cleanUp(){var type,publisherList,publisher,i,len;for(type in Registry){publisherList=Registry[type];for(i=0,len=publisherList.length;i<len;i++){publisher=publisherList[i];publisher.src[publisher.type]=null}}Registry={}}function add(src,sEvent,fp,thisArg){return get(src,sEvent).add(fp,thisArg)}function remove(src,sEvent,fp,thisArg){return get(src,sEvent).remove(fp,thisArg)}function fire(publisher){return fireEvent;function fireEvent(e){var preventDefault=false,i,cs=publisher._callStack,csi;if(typeof publisher.beforeFire=="function"){try{if(publisher.beforeFire(e)==false){preventDefault=true}}catch(ex){deferError(ex)}}for(i=0;i<cs.length;i++){csi=cs[i];try{if(csi[0].call(csi[1],e)==false){preventDefault=true}}catch(ex){deferError(ex)}}if(typeof publisher.afterFire=="function"){if(publisher.afterFire(e)==false){preventDefault=true}}return !preventDefault}}function deferError(error){self.setTimeout(function(){throw error},1)}function get(src,sEvent){var publisherList=Registry[sEvent]||(Registry[sEvent]=[]),i,len,publisher;for(i=0,len=publisherList.length;i<len;i++){publisher=publisherList[i];if(publisher.src===src){return publisher}}publisher=new EventPublisher(src,sEvent);if(src[sEvent]){publisher.add(src[sEvent],src)}src[sEvent]=fire(publisher);publisherList[len]=publisher;return publisher}if(isMaybeLeak){get(window,"onunload").addAfter(cleanUp,EventPublisher)}})();APE.namespace("APE.dom").mixin(function(){var A="ownerDocument",C=document,D=C.documentElement,B=C.defaultView;return{TEXT_CONTENT:typeof D.textContent==="string"?"textContent":"innerText",OWNER_DOCUMENT:D&&typeof D[A]!=="undefined"?A:"document",IS_COMPUTED_STYLE:(typeof B!="undefined"&&"getComputedStyle" in B)}}());APE.namespace("APE.dom").key={LEFT:37,UP:38,RIGHT:39,DOWN:40,ARROW_KEY_EXP:/^(?:37|38|39|40)$/,ENTER:13,TAB:9,ESC:27};APE.namespace("APE.dom");(function(){var A="documentElement",E=document[A].clientWidth===0,D=APE.dom;D.mixin({getScrollOffsets:B,getViewportDimensions:C});function B(H){H=H||window;var G,F;if("pageXOffset" in H){G=function(I){I=I||window;return{left:I.pageXOffset,top:I.pageYOffset}}}else{G=function(J){J=J||window;var I=J.document[E?"body":A];return{left:I.scrollLeft,top:I.scrollTop}}}F=(D.getScrollOffsets=G)(H);H=null;return F}function C(K){K=K||window;var G="document",M=G,L=K[G],N="client",I,J,F;if(typeof L.clientWidth=="number"){G="window"}else{if(E){G=A;M="body"}else{if(L[A].clientHeight>0){M=A}}}I=N+"Width";J=N+"Height";function H(P){var O=(P||window)[G][M];return{width:O[I],height:O[J]}}F=(D.getViewportDimensions=H)(K);K=L=null;return F}})();APE.namespace("APE.dom");(function(){var B=APE.dom,N=typeof document.createElement("p").scrollLeft=="number";APE.createMixin(B,{getOffsetCoords:J,isAboveElement:U,isBelowElement:D,isInsideElement:P,IS_SCROLL_SUPPORTED:N});var I=this.document,c,O=I.documentElement,f=Math.round,W=Math.max,S=self.parseFloat,k="getComputedStyle",Z="defaultView",e=O&&O.clientWidth===0,Q="clientTop" in O,X=/^h/.test(O.tagName)?"table":"TABLE",j="currentStyle" in O,K,C,b,L,i,g,d,T,Y,F,A,H=I[Z]&&typeof I[Z][k]!="undefined",G="getBoundingClientRect",M="relative",R="borderTopWidth",a="borderLeftWidth",E=/^(?:r|a)/,V=/^(?:a|f)/;I=O=null;function J(m,AE,AK){var AQ=m[B.OWNER_DOCUMENT],AO=AQ.documentElement,AB=AQ.body;if(!AE){AE=AQ}if(!AK){AK={x:0,y:0}}AK.x=AK.y=0;if(m===AE){return AK}if(G in m){var AM=e?AB:AO,z=m[G](),w=z.left+W(AO.scrollLeft,AB.scrollLeft),u=z.top+W(AO.scrollTop,AB.scrollTop),AJ,AG=AM.clientTop,n=AM.clientLeft;if(Q){w-=n;u-=AG}if(AE!==AQ){z=J(AE,null);w-=z.x;u-=z.y;if(Q){if(e&&AE===AB){w-=n;u-=AG}else{if(AE!==AQ&&AE!==AO&&AE!==AB){w-=AE.clientLeft;u-=AE.clientTop}}}}if(e&&j&&AE!=AQ&&AE!==AB){AJ=AB.currentStyle;w+=S(AJ.marginLeft)||0+S(AJ.left)||0;u+=S(AJ.marginTop)||0+S(AJ.top)||0}AK.x=w;AK.y=u;return AK}else{if(H){if(!c){h()}var s=m.offsetLeft,AL=m.offsetTop,AH=AQ[Z],r=AH[k](m,"")||m.style;if(r.position=="fixed"&&N){AK.x=s+AO.scrollLeft;AK.y=AL+AO.scrollTop;return AK}var AA=AH[k](AB,""),AC=!E.test(AA.position),q=m,t=m.parentNode,l=m.offsetParent;for(;t&&t!==AE;t=t.parentNode){if(t!==AB&&t!==AO&&N){s-=t.scrollLeft;AL-=t.scrollTop}if(t===l){if(t===AB&&AC){}else{if(!K&&!(t.tagName===X&&i)){var p=AH[k](t,"");s+=S(p[a])||0;AL+=S(p[R])||0}if(t!==AB){s+=l.offsetLeft;AL+=l.offsetTop;q=l;l=t.offsetParent}}}}var v=0,AI=0,AP,AD,AN=AE===AQ||AE===AO,AF,o;if(q!=AQ){r=AH[k](q,"");if(r){o=r.position;AP=V.test(o);AD=AP||E.test(o)}}if((q===m&&m.offsetParent===AB&&!C&&AE!==AB&&!(AC&&L))||(C&&q===m&&!AD)||!AC&&AD&&d&&AN){AI+=S(AA.marginTop)||0;v+=S(AA.marginLeft)||0}if(AE===AB){AF=AH[k](AO,"");if((!AC&&((Y&&!AP)||(F&&AP)))||AC&&T){AI-=S(AF.paddingTop)||0;v-=S(AF.paddingLeft)||0}if(A){if(!AD||AD&&!AC){AI-=S(AF.marginTop)||0}v-=S(AF.marginLeft)||0}}if(AC){if(g||(!AP&&!K&&AN)){AI+=S(AA[R]);v+=S(AA[a])}}else{if(L){if(AN){if(!b){AI+=S(AA.top)||0;v+=S(AA.left)||0;if(AP&&K){AI+=S(AA[R]);v+=S(AA[a])}}if(AE===AQ&&!AC&&!Y){if(!AF){AF=AH[k](AO,"")}AI+=S(AF.paddingTop)||0;v+=S(AF.paddingLeft)||0}}else{if(b){AI-=S(AA.top);v-=S(AA.left)}}if(C&&(!AD||AE===AB)){AI-=S(AA.marginTop)||0;v-=S(AA.marginLeft)||0}}}AK.x=f(s+v);AK.y=f(AL+AI);return AK}}}function h(){c=true;var AC=document,p=AC.body;if(!p){return}var l="marginTop",AE="position",r="padding",AB="static",v="border",q=p.style,AF=q.cssText,AA="1px solid transparent",m="0",u="1px",w="offsetTop",t=AC.documentElement.style,AD=t.cssText,o=AC.createElement("div"),n=o.style,y=AC.createElement(X);q[r]=q[l]=q.top=m;t.position=AB;q[v]=AA;n.margin=m;n[AE]=AB;o=p.insertBefore(o,p.firstChild);K=(o[w]===1);q[v]=m;y.innerHTML="<tbody><tr><td>x</td></tr></tbody>";y.style[v]="7px solid";y.cellSpacing=y.cellPadding=m;p.insertBefore(y,p.firstChild);i=y.getElementsByTagName("td")[0].offsetLeft===7;p.removeChild(y);q[l]=u;q[AE]=M;C=(o[w]===1);L=p[w]===0;q[l]=m;q.top=u;b=o[w]===1;q.top=m;q[l]=u;q[AE]=n[AE]=M;d=o[w]===0;n[AE]="absolute";q[AE]=AB;if(o.offsetParent===p){q[v]=AA;n.top="2px";g=o[w]===1;q[v]=m;n[AE]=M;t[r]=u;q[l]=m;T=o[w]===3;q[AE]=M;Y=o[w]===3;n[AE]="absolute";F=o[w]===3;t[r]=m;t[l]=u;A=o[w]===3}p.removeChild(o);q.cssText=AF||"";t.cssText=AD||""}function P(m,l){var o=J(m).y,n=J(l).y;return o+m.offsetHeight<=n+l.offsetHeight&&o>=n}function U(m,l){return(J(m).y<=J(l).y)}function D(m,l){return(J(m).y+m.offsetHeight>=J(l).y+l.offsetHeight)}})();APE.namespace("APE.dom").mixin(function(){var K="className",A,D,E=APE.dom,B,C,M=document.documentElement.classList!=D;if(!M){A={};B=function(O,N){var P=O+"$"+N;return A[P]||(A[P]=RegExp("(?:^|\\s)"+O+"(?:$|\\s)",N))};C=function(N){return N.replace(/^\s+|\s+$/g,"").replace(/\s\s+/g," ")}}return{hasClass:F,removeClass:J,addClass:G,toggleClass:L,getElementsByClassName:I,findAncestorWithClass:H};function F(O,N){return(E.hasClass=M?function(Q,P){return Q.classList.contains(P)}:function(Q,P){return B(P,"").test(Q.className)})(O,N)}function L(O,N){(F(O,N)?J:G)(O,N)}function J(O,N){(E.removeClass=M?function(Q,P){Q.classList.remove(P)}:function(Q,P){var R=Q[K];if(!R){return}Q[K]=R===P?"":C(R.replace(B(P,"g")," "))})(O,N)}function G(O,N){(E.addClass=M?function(Q,P){return Q.classList.add(P)}:function(Q,P){if(!Q[K]){Q[K]=P}else{if(!B(P).test(Q[K])){Q[K]+=" "+P}}})(O,N)}function I(O,P,V){if(!V){return[]}P=P||"*";if(O.getElementsByClassName&&(P==="*")){return O.getElementsByClassName(V)}var Q=B(V,""),S=O.getElementsByTagName(P),U=[],T=U.length=S.length,N=0,R;for(R=0;R<T;R++){if(Q.test(S[R][K])){U[N++]=S[R]}}U.length=N;return U}function H(Q,N,O){if(Q==null||Q===O){return null}for(var P=Q.parentNode;P&&P!=O&&P.className;){if(F(P,N)){return P}P=P.parentNode}return null}}());APE.namespace("APE.dom").mixin(function(){var D=document.documentElement,B="getNamedItem" in D.attributes,K="parentNode",H=/^H/.test(D.tagName)?"toUpperCase":"toLowerCase";D=null;return{contains:E,isOrContains:J,findAncestorWithAttribute:A,findAncestorWithTagName:L,findNextSiblingElement:C,findPreviousSiblingElement:G,getChildElements:I};function E(O,M){if(!O){return false}var P="compareDocumentPosition",N=(P in O)?function(S,R){try{return !!(S&&R)&&((S[P](R)&16)!==0)}catch(Q){return false}}:("contains" in O)?function(R,Q){return !!R&&R!==Q&&R.contains(Q)}:function(R,Q){if(!R||!Q||R===Q){return false}while(R&&R!==Q&&(Q=Q[K])!==null){}return R===Q};return(E=APE.dom.contains=N)(O,M)}function J(N,M){return N===M||APE.dom.contains(N,M)}function A(O,R,P){for(var M,Q,N=O[K];N!==null;){Q=N.attributes;if(!Q||!B){return null}M=Q.getNamedItem(R);if(M&&M.specified){if(M.value===P||(P===undefined)){return N}}N=N[K]}return null}function L(P,M,N){M=M[H]();N=N||null;for(var O=P[K];O&&O!==N;){if(O.tagName===M){return O}O=O[K]}return null}function C(M){return F(M,"nextSibling")}function G(M){return F(M,"previousSibling")}function F(M,N){for(var O=M[N];O!==null;O=O[N]){if(O.nodeType===1){return O}}return null}function I(Q){var P,O,N=[],S=Q.childNodes,M=S.length,R;N.length=M;for(P=O=0;P<M;P++){R=S[P];if(R.nodeType!==1){continue}N[O++]=R}N.length=O;return N}}());APE.namespace("APE.dom").Event=(function(){var F="addEventListener" in this,G=F?"target":"srcElement",L={get:C,getTarget:B,getRelatedTarget:A,add:J,addCallback:J,remove:E,removeCallback:E,purgeEvents:D,preventDefault:H,stopPropagation:I,toString:function(){return"APE.dom.Event"}};function C(M,N){L.get=O;var U=F?"focus":"focusin",T=F?"blur":"focusout",V={},P,S={focus:U,blur:T},R;function Q(X,W){if(!X.addEventListener&&!X.attachEvent){throw TypeError(X+" is not a compatible object.")}this.src=X;this.type=W;this._callStack=[]}Q.prototype={add:function(Y){Q.prototype.add=X;this.add(Y);function X(c){var b=this.src,Z=S[this.type],a=Z||this.type;if(F){b.addEventListener(a,c,!!Z)}else{c=W(b,c);b.attachEvent("on"+a,c)}this._callStack.push(c)}function W(b,Z){if(b===window){return Z}function a(c){a.original.call(a.context,c||window.event)}a.original=Z;a.context=b;Z=b=null;return a}},remove:function(Y){Q.prototype.remove=W;this.remove(Y);function W(Z){Z=X(this._callStack,Z);if(Z){if(F){this.src.removeEventListener(this.type,Z,this.type in S)}else{this.src.detachEvent("on"+this.type,Z)}}}function X(b,d){var a,c,Z;for(c=0,Z=b.length;c<Z;c++){a=b[c];if((a.original||a)===d){delete a.original;delete a.context;return b.splice(c,1)[0]}}return null}},purge:function(){var X=this._callStack,W,Y;for(Y=X.length;Y-->0;X.length=Y){W=X[Y];this.remove(W.original||W)}},toString:function(){return"DomEventPublisher: src: "+this.src+", type: "+this.type}};function O(b,a){var Z=V[a]||(V[a]=[]),X,W,Y;for(X=0,W=Z.length;X<W;X++){Y=Z[X];if(Y.src===b){return Y}}Y=new Q(b,a);Z[W]=Y;return Y}if(P){O(window,"unload").add(R=function(){var Z,Y,W,X;for(Z in V){Y=V[Z];for(W=Y.length;W-->0;Y.length=W){X=Y[W];if(X.src!=X.src.window){X.purge()}}delete V[Z]}E(window,"unload",R)})}return O(M,N)}function B(M){return(L.getTarget=F?function(N){return N&&K(N,G)}:function(N){N=window.event;return N&&N.srcElement})(M)}function A(P){if(!F){var O={mouseover:"fromElement",mouseenter:"fromElement",mouseout:"toElement",mouseleave:"toElement"};return(L.getRelatedTarget=function(R){R=R||window.event;if(R){var Q=O[R.type],S=K(R,Q);return S}})(P)}if(P){var N=P.relatedTarget||P.target;try{N.nodeName}catch(M){N=P.target}return N}}function K(O,M){var N=O[M];if(N&&N.nodeName==="#text"){N=N.parentNode}return N}function J(O,N,M){L.get(O,N).add(M)}function D(P,O){if(typeof O=="string"){L.get(P,O).purge()}else{for(var N=0,M=O.length;N<M;N++){L.get(P,O[N]).purge()}}}function E(P,O,N,M){L.get(P,O).remove(N)}function H(M){M=M||window.event;if("preventDefault" in M){M.preventDefault()}else{if("returnValue" in M){M.returnValue=false}}}function I(M){if(F){M.stopPropagation()}else{(window.event||M).cancelBubble=true}}return L})();APE.namespace("APE.dom.Event").getCoords=function(B){var C=APE.dom,A;if("pageX" in B){A=function(D){return{x:D.pageX,y:D.pageY}}}else{A=function(E){var D=C.getScrollOffsets();E=E||window.event;return{x:E.clientX+D.left,y:E.clientY+D.top}}}return(C.Event.getCoords=A)(B)};APE.namespace("APE.dom");(function(){var Q=APE.dom;Q.getStyle=D;Q.setOpacity=S;var R="getComputedStyle",E=Q.IS_COMPUTED_STYLE,P="currentStyle",O="opacity",F="style",G="px",J="filter",I="alpha("+O+"=",M=/^(?:margin|(border)(Width|Color|Style)|padding)$/,N=/\Wopacity\s*=\s*([\d]+)/i,A=/^auto|\d%$/,L="cssFloat",C=["Top","Right","Bottom","Left"];if(!(L in document.documentElement[F])){L="styleFloat"}function K(V){var X,W=V[J];if(!N.test(W)){return 1}X=N.exec(W);return X[1]/100}function S(Y,V){var X=Y[F],W;if(O in X){X[O]=V}else{if(J in X){X[J]=I+(V*100)+")";W=Y[P];if(W&&!W.hasLayout){X.zoom=1}}}}function D(W,V){var d="",a,Z,X,Y,b,c=W[Q.OWNER_DOCUMENT];if(/float/.test(V)){V=L}if(E){a=c.defaultView[R](W,"");if(!(V in a)){return""}d=a[V];if(d===""){d=T(a,V).join(" ")}if(V=="zIndex"&&d=="normal"){return"0"}if(A.test(d)){d=U(W,V)}}else{a=W[P];if(V===O){d=K(a)}else{d=a[V];if(A.test(d)){d=U(W,V)}else{if(!(V in a)){return""}}}Z=H.exec(d);if(Z){X=d.split(" ");X[0]=B(W,Z[0]);for(Y=1,b=X.length;Y<b;Y++){Z=H.exec(X[Y]);X[Y]=B(W,Z[0])}d=X.join(" ")}}return d}function U(X,W){var d=X[F],c,Y,V,Z,b,a;if("pixelWidth" in d&&/width|height|top|left/.test(W)){Y="pixel"+(W.charAt(0).toUpperCase())+W.substring(1);c=d[Y]}if(c){return c+G}if(W==="width"){b=X.clientLeft||0;V=parseFloat(D(X,"borderRightWidth"))||b;a=parseFloat(D(X,"paddingLeft"))||0+parseFloat(D(X,"paddingRight"))||0;return X.offsetWidth-b-V-a+G}else{if(W==="height"){Z=X.clientTop||0;V=parseFloat(D(X,"borderBottomWidth"))||Z;a=parseFloat(D(X,"paddingTop"))||0+parseFloat(D(X,"paddingBottom"))||0;return X.offsetHeight-Z-V+G}else{if(W=="margin"&&X[P].position!="absolute"){c=parseFloat(D(X.parentNode,"width"))-X.offsetWidth;if(c===0){return"0px"}c="0px "+c;return c+" "+c}}}return"0"}function T(b,W){var X=M.exec(W),Z,f,a,d,e,c=true,V,Y=1;if(X&&X[0]){V=C;Z=X[1]||X[0];f=X[2]||""}else{return[""]}a=b[Z+V[0]+f];e=[a];while(Y<4){d=b[Z+V[Y]+f];c=c&&d==a;a=d;e[Y++]=d}if(c){return[a]}return e}var H=/(-?\d+|(?:-?\d*\.\d+))(?:em|ex|pt|pc|in|cm|mm\s*)/;function B(Z,a){if(Z.runtimeStyle){if(parseFloat(a)===0){return"0px"}var Y=Z[F],X=Y.left,W=Z.runtimeStyle,V=W.left;W.left=Z[P].left;Y.left=(a||0);a=Y.pixelLeft+G;Y.left=X;W.left=V;return a}}})();