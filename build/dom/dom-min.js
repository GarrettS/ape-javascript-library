APE.namespace("APE.dom").mixin(function(){var A="ownerDocument",C=document,D=C.documentElement,B=C.defaultView;return{TEXT_CONTENT:typeof D.textContent==="string"?"textContent":"innerText",OWNER_DOCUMENT:D&&typeof D[A]!=="undefined"?A:"document",IS_COMPUTED_STYLE:(typeof B!="undefined"&&"getComputedStyle" in B)}}());APE.namespace("APE.dom").key={LEFT:37,UP:38,RIGHT:39,DOWN:40,ARROW_KEY_EXP:/^(?:37|38|39|40)$/,ENTER:13,TAB:9,ESC:27};APE.namespace("APE.dom");(function(){var A="documentElement",E=document[A].clientWidth===0,D=APE.dom;D.mixin({getScrollOffsets:B,getViewportDimensions:C});function B(H){H=H||window;var G,F;if("pageXOffset" in H){G=function(I){I=I||window;return{left:I.pageXOffset,top:I.pageYOffset}}}else{G=function(J){J=J||window;var I=J.document[E?"body":A];return{left:I.scrollLeft,top:I.scrollTop}}}F=(D.getScrollOffsets=G)(H);H=null;return F}function C(K){K=K||window;var G="document",M=G,L=K[G],N="client",I,J,F;if(typeof L.clientWidth=="number"){G="window"}else{if(E){G=A;M="body"}else{if(L[A].clientHeight>0){M=A}}}I=N+"Width";J=N+"Height";function H(P){var O=(P||window)[G][M];return{width:O[I],height:O[J]}}F=(D.getViewportDimensions=H)(K);K=L=null;return F}})();APE.namespace("APE.dom");(function(){var B=APE.dom,N=typeof document.createElement("p").scrollLeft=="number";APE.createMixin(B,{getOffsetCoords:J,isAboveElement:U,isBelowElement:D,isInsideElement:P,IS_SCROLL_SUPPORTED:N});var I=this.document,c,O=I.documentElement,f=Math.round,W=Math.max,S=self.parseFloat,k="getComputedStyle",Z="defaultView",e=O&&O.clientWidth===0,Q="clientTop" in O,X=/^h/.test(O.tagName)?"table":"TABLE",j="currentStyle" in O,K,C,b,L,i,g,d,T,Y,F,A,H=I[Z]&&typeof I[Z][k]!="undefined",G="getBoundingClientRect",M="relative",R="borderTopWidth",a="borderLeftWidth",E=/^(?:r|a)/,V=/^(?:a|f)/;I=O=null;function J(m,AE,AK){var AQ=m[B.OWNER_DOCUMENT],AO=AQ.documentElement,AB=AQ.body;if(!AE){AE=AQ}if(!AK){AK={x:0,y:0}}AK.x=AK.y=0;if(m===AE){return AK}if(G in m){var AM=e?AB:AO,z=m[G](),w=z.left+W(AO.scrollLeft,AB.scrollLeft),u=z.top+W(AO.scrollTop,AB.scrollTop),AJ,AG=AM.clientTop,n=AM.clientLeft;if(Q){w-=n;u-=AG}if(AE!==AQ){z=J(AE,null);w-=z.x;u-=z.y;if(Q){if(e&&AE===AB){w-=n;u-=AG}else{if(AE!==AQ&&AE!==AO&&AE!==AB){w-=AE.clientLeft;u-=AE.clientTop}}}}if(e&&j&&AE!=AQ&&AE!==AB){AJ=AB.currentStyle;w+=S(AJ.marginLeft)||0+S(AJ.left)||0;u+=S(AJ.marginTop)||0+S(AJ.top)||0}AK.x=w;AK.y=u;return AK}else{if(H){if(!c){h()}var s=m.offsetLeft,AL=m.offsetTop,AH=AQ[Z],r=AH[k](m,"")||m.style;if(r.position=="fixed"&&N){AK.x=s+AO.scrollLeft;AK.y=AL+AO.scrollTop;return AK}var AA=AH[k](AB,""),AC=!E.test(AA.position),q=m,t=m.parentNode,l=m.offsetParent;for(;t&&t!==AE;t=t.parentNode){if(t!==AB&&t!==AO&&N){s-=t.scrollLeft;AL-=t.scrollTop}if(t===l){if(t===AB&&AC){}else{if(!K&&!(t.tagName===X&&i)){var p=AH[k](t,"");s+=S(p[a])||0;AL+=S(p[R])||0}if(t!==AB){s+=l.offsetLeft;AL+=l.offsetTop;q=l;l=t.offsetParent}}}}var v=0,AI=0,AP,AD,AN=AE===AQ||AE===AO,AF,o;if(q!=AQ){r=AH[k](q,"");if(r){o=r.position;AP=V.test(o);AD=AP||E.test(o)}}if((q===m&&m.offsetParent===AB&&!C&&AE!==AB&&!(AC&&L))||(C&&q===m&&!AD)||!AC&&AD&&d&&AN){AI+=S(AA.marginTop)||0;v+=S(AA.marginLeft)||0}if(AE===AB){AF=AH[k](AO,"");if((!AC&&((Y&&!AP)||(F&&AP)))||AC&&T){AI-=S(AF.paddingTop)||0;v-=S(AF.paddingLeft)||0}if(A){if(!AD||AD&&!AC){AI-=S(AF.marginTop)||0}v-=S(AF.marginLeft)||0}}if(AC){if(g||(!AP&&!K&&AN)){AI+=S(AA[R]);v+=S(AA[a])}}else{if(L){if(AN){if(!b){AI+=S(AA.top)||0;v+=S(AA.left)||0;if(AP&&K){AI+=S(AA[R]);v+=S(AA[a])}}if(AE===AQ&&!AC&&!Y){if(!AF){AF=AH[k](AO,"")}AI+=S(AF.paddingTop)||0;v+=S(AF.paddingLeft)||0}}else{if(b){AI-=S(AA.top);v-=S(AA.left)}}if(C&&(!AD||AE===AB)){AI-=S(AA.marginTop)||0;v-=S(AA.marginLeft)||0}}}AK.x=f(s+v);AK.y=f(AL+AI);return AK}}}function h(){c=true;var AC=document,p=AC.body;if(!p){return}var l="marginTop",AE="position",r="padding",AB="static",v="border",q=p.style,AF=q.cssText,AA="1px solid transparent",m="0",u="1px",w="offsetTop",t=AC.documentElement.style,AD=t.cssText,o=AC.createElement("div"),n=o.style,y=AC.createElement(X);q[r]=q[l]=q.top=m;t.position=AB;q[v]=AA;n.margin=m;n[AE]=AB;o=p.insertBefore(o,p.firstChild);K=(o[w]===1);q[v]=m;y.innerHTML="<tbody><tr><td>x</td></tr></tbody>";y.style[v]="7px solid";y.cellSpacing=y.cellPadding=m;p.insertBefore(y,p.firstChild);i=y.getElementsByTagName("td")[0].offsetLeft===7;p.removeChild(y);q[l]=u;q[AE]=M;C=(o[w]===1);L=p[w]===0;q[l]=m;q.top=u;b=o[w]===1;q.top=m;q[l]=u;q[AE]=n[AE]=M;d=o[w]===0;n[AE]="absolute";q[AE]=AB;if(o.offsetParent===p){q[v]=AA;n.top="2px";g=o[w]===1;q[v]=m;n[AE]=M;t[r]=u;q[l]=m;T=o[w]===3;q[AE]=M;Y=o[w]===3;n[AE]="absolute";F=o[w]===3;t[r]=m;t[l]=u;A=o[w]===3}p.removeChild(o);q.cssText=AF||"";t.cssText=AD||""}function P(m,l){var o=J(m).y,n=J(l).y;return o+m.offsetHeight<=n+l.offsetHeight&&o>=n}function U(m,l){return(J(m).y<=J(l).y)}function D(m,l){return(J(m).y+m.offsetHeight>=J(l).y+l.offsetHeight)}})();APE.namespace("APE.dom").mixin(function(){var F="className",A={};return{hasToken:D,removeClass:H,addClass:E,getElementsByClassName:I,findAncestorWithClass:G};function D(K,J){return B(J,"").test(K)}function H(K,J){var L=K[F];if(!L){return}if(L===J){K[F]="";return}K[F]=C(L.replace(B(J,"g")," "))}function E(K,J){if(!K[F]){K[F]=J}if(!B(J).test(K[F])){K[F]+=" "+J}}function B(K,J){var L=K+"$"+J;return(A[L]||(A[L]=RegExp("(?:^|\\s)"+K+"(?:$|\\s)",J)))}function I(K,L,R){if(!R){return[]}L=L||"*";if(K.getElementsByClassName&&(L==="*")){return K.getElementsByClassName(R)}var M=B(R,""),O=K.getElementsByTagName(L),Q=[],P=Q.length=O.length,J=0,N;for(N=0;N<P;N++){if(M.test(O[N][F])){Q[J++]=O[N]}}Q.length=J;return Q}function G(M,J,K){if(M==null||M===K){return null}var N=B(J,""),L;for(L=M.parentNode;L!=K;){if(N.test(L[F])){return L}L=L.parentNode}return null}function C(J){return J.replace(/^\s+|\s+$/g,"").replace(/\s\s+/g," ")}}());APE.namespace("APE.dom");(function(){var D=document.documentElement,B="getNamedItem" in D.attributes,K="nodeType",L="compareDocumentPosition",I="parentNode",F=/^H/.test(D.tagName)?"toUpperCase":"toLowerCase";APE.dom.mixin({contains:H(),findAncestorWithAttribute:A,findAncestorWithTagName:J,findNextSiblingElement:C,findPreviousSiblingElement:E,getChildElements:G});D=null;function H(){if(L in D){return function(O,N,M){return O&&(M&&(O===N)||(O[L](N)&16)!==0)}}else{if("contains" in D){return function(O,N,M){return O!==null&&(M?O===N||O.contains(N):O!==N&&O.contains(N))}}}return function(O,N,M){if(!O||!M&&O===N){return false}while(O&&O!==N&&(N=N[I])!==null){}return O===N}}function A(O,R,P){for(var M,Q,N=O[I];N!==null;){Q=N.attributes;if(!Q||!B){return null}M=Q.getNamedItem(R);if(M&&M.specified){if(M.value===P||(P===undefined)){return N}}N=N[I]}return null}function J(O,M){M=M[F]();for(var N=O[I];N!==null;){if(N.tagName===M){return N}N=N[I]}return null}function C(N){for(var M=N.nextSibling;M!==null;M=M.nextSibling){if(M[K]===1){return M}}return null}function E(M){for(var N=M.previousSibling;N!==null;N=N.previousSibling){if(N[K]===1){return N}}return null}function G(Q){var P,O,N=[],S=Q.childNodes,M=S.length,R;N.length=M;for(P=O=0;P<M;P++){R=S[P];if(R[K]!==1){continue}N[O++]=R}N.length=O;return N}})();APE.namespace("APE.dom").Event=(function(){var HAS_EVENT_TARGET="addEventListener" in this,TARGET=HAS_EVENT_TARGET?"target":"srcElement",FOCUS_DELEGATED=HAS_EVENT_TARGET?"focus":"focusin",BLUR_DELEGATED=HAS_EVENT_TARGET?"blur":"focusout",Registry={},isMaybeLeak
/*@cc_on=(@_jscript_version<5.7)@*/
,useCaptureMap={focus:FOCUS_DELEGATED,blur:BLUR_DELEGATED},Event={get:get,getTarget:getTarget,add:addCallback,addCallback:addCallback,remove:removeCallback,removeCallback:removeCallback,preventDefault:preventDefault,stopPropagation:stopPropagation,toString:function(){return"APE.dom.Event"}};function get(src,sEvent){Event.get=get;function DomEventPublisher(src,type){if(!src.addEventListener&&!src.attachEvent){throw TypeError(src+" is not a compatible object.")}this.src=src;this.type=type;this._callStack=[]}DomEventPublisher.prototype={add:function(callback){this.add=add;this.add(callback);function add(callback){var o=this.src,captureAdapterType=useCaptureMap[this.type],type=captureAdapterType||this.type;if(HAS_EVENT_TARGET){o.addEventListener(type,callback,!!captureAdapterType)}else{callback=getBoundCallback(o,callback);o.attachEvent("on"+type,callback)}this._callStack.push(callback)}function getBoundCallback(o,cb){if(o===window){return cb}function bound(ev){bound.original.call(bound.context,ev)}bound.original=cb;bound.context=o;cb=o=null;return bound}},remove:function(callback){this.remove=remove;this.remove(callback);function remove(callback){callback=removeFromCallStack(this._callStack,callback);if(callback){if(HAS_EVENT_TARGET){this.src.removeEventListener(this.type,callback,this.type in useCaptureMap)}else{this.src.detachEvent("on"+this.type,callback)}}}function removeFromCallStack(callStack,callback){var cb,i,len;for(i=0,len=callStack.length;i<len;i++){cb=callStack[i];if((cb.original||cb)===callback){delete cb.original;delete cb.context;return callStack.splice(i,1)[0]}}return null}},toString:function(){return"DomEventPublisher: src: "+this.src+", type: "+this.type}};function get(src,sEvent){var publisherList=Registry[sEvent]||(Registry[sEvent]=[]),i,len,publisher;for(i=0,len=publisherList.length;i<len;i++){publisher=publisherList[i];if(publisher.src===src){return publisher}}publisher=new DomEventPublisher(src,sEvent);publisherList[len]=publisher;if(isMaybeLeak){get(window,"unload").add(cleanUp);isMaybeLeak=false}return publisher}return get(src,sEvent)}function getTarget(ev){ev=ev||window.event;if(!ev){return null}var t=(ev||window.event)[TARGET];if(t&&t.nodeName==="#text"){t=t.parentNode}return t}function addCallback(o,type,cb){Event.get(o,type).add(cb)}function removeCallback(o,type,bound,useCapture){Event.get(o,type).remove(bound)}function preventDefault(ev){ev=ev||window.event;if("preventDefault" in ev){ev.preventDefault()}else{if("returnValue" in ev){ev.returnValue=false}}}function stopPropagation(ev){if(HAS_EVENT_TARGET){ev.stopPropagation()}else{(window.event||ev).cancelBubble=true}}function cleanUp(){var sEvent,publisherList,i,publisher;for(sEvent in Registry){publisherList=Registry[sEvent];for(i=publisherList.length;i--;publisherList.length=i){publisher=publisherList[i];if(publisher.src!=publisher.src.window){unbindCallstack(publisher)}}delete Registry[sEvent]}removeCallback(window,"onunload",cleanUp);function unbindCallstack(publisher){var callStack=publisher._callStack,i,len,bound;for(i=0,len=callStack.length;i<len;i++){bound=callStack[i];publisher.remove(bound)}delete publisher._callStack}}return Event})();APE.namespace("APE.dom.Event").getCoords=function(B){var C=APE.dom,A;if("pageX" in B){A=function(D){return{x:D.pageX,y:D.pageY}}}else{A=function(E){var D=C.getScrollOffsets();E=E||window.event;return{x:E.clientX+D.left,y:E.clientY+D.top}}}return(C.Event.getCoords=A)(B)};APE.namespace("APE.dom");(function(){var Q=APE.dom;Q.getStyle=D;Q.setOpacity=S;var R="getComputedStyle",E=Q.IS_COMPUTED_STYLE,P="currentStyle",O="opacity",F="style",G="px",J="filter",I="alpha("+O+"=",M=/^(?:margin|(border)(Width|Color|Style)|padding)$/,N=/\Wopacity\s*=\s*([\d]+)/i,A=/^auto|\d%$/,L="cssFloat",C=["Top","Right","Bottom","Left"];if(!(L in document.documentElement[F])){L="styleFloat"}function K(V){var X,W=V[J];if(!N.test(W)){return 1}X=N.exec(W);return X[1]/100}function S(Y,V){var X=Y[F],W;if(O in X){X[O]=V}else{if(J in X){X[J]=I+(V*100)+")";W=Y[P];if(W&&!W.hasLayout){X.zoom=1}}}}function D(W,V){var d="",a,Z,X,Y,b,c=W[Q.OWNER_DOCUMENT];if(/float/.test(V)){V=L}if(E){a=c.defaultView[R](W,"");if(!(V in a)){return""}d=a[V];if(d===""){d=T(a,V).join(" ")}if(V=="zIndex"&&d=="normal"){return"0"}if(A.test(d)){d=U(W,V)}}else{a=W[P];if(V===O){d=K(a)}else{d=a[V];if(A.test(d)){d=U(W,V)}else{if(!(V in a)){return""}}}Z=H.exec(d);if(Z){X=d.split(" ");X[0]=B(W,Z[0]);for(Y=1,b=X.length;Y<b;Y++){Z=H.exec(X[Y]);X[Y]=B(W,Z[0])}d=X.join(" ")}}return d}function U(X,W){var d=X[F],c,Y,V,Z,b,a;if("pixelWidth" in d&&/width|height|top|left/.test(W)){Y="pixel"+(W.charAt(0).toUpperCase())+W.substring(1);c=d[Y]}if(c){return c+G}if(W==="width"){b=X.clientLeft||0;V=parseFloat(D(X,"borderRightWidth"))||b;a=parseFloat(D(X,"paddingLeft"))||0+parseFloat(D(X,"paddingRight"))||0;return X.offsetWidth-b-V-a+G}else{if(W==="height"){Z=X.clientTop||0;V=parseFloat(D(X,"borderBottomWidth"))||Z;a=parseFloat(D(X,"paddingTop"))||0+parseFloat(D(X,"paddingBottom"))||0;return X.offsetHeight-Z-V+G}else{if(W=="margin"&&X[P].position!="absolute"){c=parseFloat(D(X.parentNode,"width"))-X.offsetWidth;if(c===0){return"0px"}c="0px "+c;return c+" "+c}}}return"0"}function T(b,W){var X=M.exec(W),Z,f,a,d,e,c=true,V,Y=1;if(X&&X[0]){V=C;Z=X[1]||X[0];f=X[2]||""}else{return[""]}a=b[Z+V[0]+f];e=[a];while(Y<4){d=b[Z+V[Y]+f];c=c&&d==a;a=d;e[Y++]=d}if(c){return[a]}return e}var H=/(-?\d+|(?:-?\d*\.\d+))(?:em|ex|pt|pc|in|cm|mm\s*)/;function B(Z,a){if(Z.runtimeStyle){if(parseFloat(a)===0){return"0px"}var Y=Z[F],X=Y.left,W=Z.runtimeStyle,V=W.left;W.left=Z[P].left;Y.left=(a||0);a=Y.pixelLeft+G;Y.left=X;W.left=V;return a}}})();