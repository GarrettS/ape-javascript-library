(function(){if(typeof APE!=="undefined"){throw Error("APE is already defined.")}self.APE={namespace:K,mixin:N,extend:S,createFactory:R,getById:Q,deferError:D,toString:function(){return"[APE JavaScript Library]"}};function J(){}var A=0,U="instances",O="prototype",B=Object[O],M=B.hasOwnProperty,C=Function[O].toString,V=["toString","valueOf"];function K(Z){var a=Z.split("."),X=self,Y=0,F=a.length,W;for(;Y<F;Y++){W=a[Y];if(!G(X,W)){X[W]=new P((X.qualifiedName||"APE")+"."+W)}X=X[W]}return X}function N(Y,X){var Z,W=0,F;for(Z in X){if(G(X,Z)){Y[Z]=X[Z]}}for(;W<V.length;W++){F=V[W];if(G(X,F)){Y[F]=X[F]}}return Y}function S(F,Y,W){J[O]=Y[O];var X=F[O]=new J;if(typeof W=="object"){APE.mixin(X,W)}X.constructor=F;return F}function D(F){self.setTimeout(function(){throw F},1)}function R(F,X){return{getById:W,getByNode:W};function W(Y){var Z=(typeof Y==="string")?Y:I(Y);if(!(U in this)){if(typeof X==="function"){F[O]=X()}}return E.call(this,Z,F,arguments)}}function E(X,W,F){if(!G(this,U)){this[U]={}}return this[U][X]||(this[U][X]=H(W,F))}function Q(F){return E.call(this,F,this,arguments)}function I(F){var X=F.id,W;if(!X){W=T(this)||"APE";X=F.id=W+"_"+(A++)}return X}function T(F){if(typeof F.name==="string"){return F.name}var W=C.call(F).match(/\s([a-z]+)\(/i);return W&&W[1]||""}function H(Y,W){var X,F=J[O]=Y[O];F.constructor=Y;X=new J;Y.apply(X,W);return X}P[O].toString=function(){return"["+this.qualifiedName+"]"};function P(F){this.qualifiedName=F}function G(X,W){if(W in X){if(M){return M.call(X,W)}var F=X.__proto__;if(F){return !(W in F)||F[W]!==X[W]}return B[W]!==X[W]}return false}if(M&&!M.call(self,"Object")){var L=M;M=B.hasOwnProperty=function(F){return(this===self)?(F in this&&this[F]!==B[F]):L.call(this,F)}}})();APE.EventPublisher=function(B,A){this.src=B;this._callStack=[];this.type=A};APE.EventPublisher.prototype={add:function(B,A){this._callStack.push([B,A||this.src]);return this},addBefore:function(B,A){return APE.EventPublisher.add(this,"beforeFire",B,A||this.src)},addAfter:function(B,A){return APE.EventPublisher.add(this,"afterFire",B,A||this.src)},getEvent:function(A){return APE.EventPublisher.get(this,A)},remove:function(B,A){var E=this._callStack,C,D;if(!A){A=this.src}for(C=0;C<E.length;C++){D=E[C];if(D[0]===B&&D[1]===A){return E.splice(C,1)}}return null},removeBefore:function(B,A){return this.getEvent("beforeFire").remove(B,A||this.src)},removeAfter:function(B,A){return this.getEvent("afterFire").remove(B,A||this.src)},fire:function(A){return APE.EventPublisher.fire(this)(A)},toString:function(){return"APE.EventPublisher: {src="+this.src+", type="+this.type+", length="+this._callStack.length+"}"}};APE.EventPublisher.add=function(D,C,B,A){return APE.EventPublisher.get(D,C).add(B,A)};APE.EventPublisher.fire=function(B){return A;function A(H){var D=false,F,G=B._callStack,C;if(typeof B.beforeFire=="function"){try{if(B.beforeFire(H)==false){D=true}}catch(E){APE.deferError(E)}}for(F=0;F<G.length;F++){C=G[F];try{if(C[0].call(C[1],H)==false){D=true}}catch(E){APE.deferError(E)}}if(typeof B.afterFire=="function"){if(B.afterFire(H)==false){D=true}}return !D}};APE.EventPublisher.get=function(E,D){var C=this.Registry[D]||(this.Registry[D]=[]),A,B;for(A=0;A<C.length;A++){if(C[A].src===E){return C[A]}}B=new APE.EventPublisher(E,D);if(E[D]){B.add(E[D],E)}E[D]=this.fire(B);C[C.length]=B;return B};APE.EventPublisher.Registry={};APE.EventPublisher.cleanUp=function(){var C,E,D,B,A;for(C in this.Registry){E=this.Registry[C];for(B=0,A=E.length;B<A;B++){D=E[B];D.src[D.type]=null}}};if(window.CollectGarbage){APE.EventPublisher.get(window,"onunload").addAfter(APE.EventPublisher.cleanUp,APE.EventPublisher)}APE.namespace("APE.dom");(function(){var F=APE.dom,A="ownerDocument",E=document,G=E.documentElement,D=G&&A in G?A:"document",C="textContent",B=E.defaultView;F.OWNER_DOCUMENT=D;F.IS_COMPUTED_STYLE=(typeof B!="undefined"&&"getComputedStyle" in B);F.textContent=C in G?C:"innerText"})();(function(){APE.mixin(APE.dom,{getScrollOffsets:A,getViewportDimensions:C});var B="documentElement",E=document[B],D=E&&E.clientWidth===0;E=null;function A(H){H=H||window;var G,I=H.document,F=I[B];if("pageXOffset" in H){G=function(){return{left:H.pageXOffset,top:H.pageYOffset}}}else{if(D){F=I.body}G=function(){return{left:F.scrollLeft,top:F.scrollTop}}}I=null;this.getScrollOffsets=G;return G()}function C(J){J=J||window;var G=J.document,K=G,I="client",L,H;if(typeof K.clientWidth=="number"){}else{if(D||F(J)){G=K.body}else{if(K[B].clientHeight>0){G=K[B]}else{if(typeof innerHeight=="number"){G=J;I="inner"}}}}L=I+"Width";H=I+"Height";return(this.getViewportDimensions=function(){return{width:G[L],height:G[H]}})();function F(N){var O=N.document,P=O.createElement("div");P.style.height="2500px";O.body.insertBefore(P,O.body.firstChild);var M=O[B].clientHeight>2400;O.body.removeChild(P);return M}}})();(function(){var b=APE.dom;APE.mixin(b,{getOffsetCoords:c,isAboveElement:F,isBelowElement:W,isInsideElement:L});var i=this.document,a,h=i.documentElement,e=Math.round,Y=Math.max,D="getComputedStyle",C="defaultView",Q=h&&h.clientWidth===0,R="clientTop" in h,P=/^h/.test(h.tagName)?"table":"TABLE",M="currentStyle" in h,T,E,f,V,S,O,G,J,A,N,g,H=i[C]&&typeof i[C][D]!="undefined",I="getBoundingClientRect",d="relative",Z="borderTopWidth",B="borderLeftWidth",K=/^(?:r|a)/,U=/^(?:a|f)/;i=h=null;function c(k,AC,AI){var AO=k[b.OWNER_DOCUMENT],AM=AO.documentElement,z=AO.body;if(!AC){AC=AO}if(!AI){AI={x:0,y:0}}if(k===AC){AI.x=AI.y=0;return AI}if(I in k){var AK=Q?z:AM,v=k[I](),u=v.left+Y(AM.scrollLeft,z.scrollLeft),s=v.top+Y(AM.scrollTop,z.scrollTop),AH,AE=AK.clientTop,l=AK.clientLeft;if(R){u-=l;s-=AE}if(AC!==AO){v=c(AC,null);u-=v.x;s-=v.y;if(R){if(Q&&AC===z){u-=l;s-=AE}else{if(AC!==AO&&AC!==AM&&AC!==z){u-=AC.clientLeft;s-=AC.clientTop}}}}if(Q&&M&&AC!=AO&&AC!==z){AH=z.currentStyle;u+=parseFloat(AH.marginLeft)||0+parseFloat(AH.left)||0;s+=parseFloat(AH.marginTop)||0+parseFloat(AH.top)||0}AI.x=u;AI.y=s;return AI}else{if(H){if(!a){X()}var q=k.offsetLeft,AJ=k.offsetTop,AF=AO[C],p=AF[D](k,"");if(p.position=="fixed"){AI.x=q+AM.scrollLeft;AI.y=AJ+AM.scrollTop;return AI}var w=AF[D](z,""),AA=!K.test(w.position),o=k,r=k.parentNode,j=k.offsetParent;for(;r&&r!==AC;r=r.parentNode){if(r!==z&&r!==AM){q-=r.scrollLeft;AJ-=r.scrollTop}if(r===j){if(r===z&&AA){}else{if(!T&&!(r.tagName===P&&S)){var n=AF[D](r,"");q+=parseFloat(n[B])||0;AJ+=parseFloat(n[Z])||0}if(r!==z){q+=j.offsetLeft;AJ+=j.offsetTop;o=j;j=r.offsetParent}}}}var t=0,AG=0,AN,AB,AL=AC===AO||AC===AM,AD,m;if(o!=AO){m=AF[D](o,"").position;AN=U.test(m);AB=AN||K.test(m)}if((o===k&&k.offsetParent===z&&!E&&AC!==z&&!(AA&&V))||(E&&o===k&&!AB)||!AA&&AB&&G&&AL){AG+=parseFloat(w.marginTop)||0;t+=parseFloat(w.marginLeft)||0}if(AC===z){AD=AF[D](AM,"");if((!AA&&((A&&!AN)||(N&&AN)))||AA&&J){AG-=parseFloat(AD.paddingTop)||0;t-=parseFloat(AD.paddingLeft)||0}if(g){if(!AB||AB&&!AA){AG-=parseFloat(AD.marginTop)||0}t-=parseFloat(AD.marginLeft)||0}}if(AA){if(O||(!AN&&!T&&AL)){AG+=parseFloat(w[Z]);t+=parseFloat(w[B])}}else{if(V){if(AL){if(!f){AG+=parseFloat(w.top)||0;t+=parseFloat(w.left)||0;if(AN&&T){AG+=parseFloat(w[Z]);t+=parseFloat(w[B])}}if(AC===AO&&!AA&&!A){if(!AD){AD=AF[D](AM,"")}AG+=parseFloat(AD.paddingTop)||0;t+=parseFloat(AD.paddingLeft)||0}}else{if(f){AG-=parseFloat(w.top);t-=parseFloat(w.left)}}if(E&&(!AB||AC===z)){AG-=parseFloat(w.marginTop)||0;t-=parseFloat(w.marginLeft)||0}}}AI.x=e(q+t);AI.y=e(AJ+AG);return AI}}}function X(){a=true;var AA=document,n=AA.body;if(!n){return}var j="marginTop",AC="position",p="padding",y="static",t="border",o=n.style,AD=o.cssText,w="1px solid transparent",k="0",r="1px",u="offsetTop",q=AA.documentElement.style,AB=q.cssText,m=AA.createElement("div"),l=m.style,v=AA.createElement(P);o[p]=o[j]=o.top=k;q.position=y;o[t]=w;l.margin=k;l[AC]=y;m=n.insertBefore(m,n.firstChild);T=(m[u]===1);o[t]=k;v.innerHTML="<tbody><tr><td>x</td></tr></tbody>";v.style[t]="7px solid";v.cellSpacing=v.cellPadding=k;n.insertBefore(v,n.firstChild);S=v.getElementsByTagName("td")[0].offsetLeft===7;n.removeChild(v);o[j]=r;o[AC]=d;E=(m[u]===1);V=n[u]===0;o[j]=k;o.top=r;f=m[u]===1;o.top=k;o[j]=r;o[AC]=l[AC]=d;G=m[u]===0;l[AC]="absolute";o[AC]=y;if(m.offsetParent===n){o[t]=w;l.top="2px";O=m[u]===1;o[t]=k;l[AC]=d;q[p]=r;o[j]=k;J=m[u]===3;o[AC]=d;A=m[u]===3;l[AC]="absolute";N=m[u]===3;q[p]=k;q[j]=r;g=m[u]===3}n.removeChild(m);o.cssText=AD||"";q.cssText=AB||""}function L(k,j){var m=c(k).y,l=c(j).y;return m+k.offsetHeight<=l+j.offsetHeight&&m>=l}function F(k,j){return(c(k).y<=c(j).y)}function W(k,j){return(c(k).y+k.offsetHeight>=c(j).y+j.offsetHeight)}})();(function(){APE.mixin(APE.dom,{hasToken:E,removeClass:J,addClass:F,getElementsByClassName:K,findAncestorWithClass:H});var G="className";function E(M,L){return B(L,"").test(M)}function J(M,L){var N=M[G];if(!N){return}if(N===L){M[G]="";return}M[G]=C(N.replace(B(L,"g")," "))}function F(M,L){if(!M[G]){M[G]=L}if(!B(L).test(M[G])){M[G]+=" "+L}}var A={};function B(M,L){var N=M+"$"+L;return(A[N]||(A[N]=RegExp("(?:^|\\s)"+M+"(?:$|\\s)",L)))}function K(M,N,T){if(!T){return[]}N=N||"*";if(M.getElementsByClassName&&(N==="*")){return M.getElementsByClassName(T)}var O=B(T,""),Q=M.getElementsByTagName(N),R=Q.length,L=0,P,S=Array(R);for(P=0;P<R;P++){if(O.test(Q[P][G])){S[L++]=Q[P]}}S.length=L;return S}function H(O,L,M){if(O==null||O===M){return null}var P=B(L,""),N;for(N=O.parentNode;N!=M;){if(P.test(N[G])){return N}N=N.parentNode}return null}var D=/^\s+|\s+$/g,I=/\s\s+/g;function C(L){return L.replace(D,"").replace(I," ")}})();(function(){var D=document.documentElement,F="nodeType",E="tagName",H="parentNode",B="compareDocumentPosition",I=/^H/.test(D[E])?"toUpperCase":"toLowerCase",K=/^[A-Z]/;APE.mixin(APE.dom,{contains:L(),findAncestorWithAttribute:A,findAncestorWithTagName:M,findNextSiblingElement:C,findPreviousSiblingElement:G,getChildElements:J});function L(){if(B in D){return function(O,N){return(O[B](N)&16)!==0}}else{if("contains" in D){return function(O,N){return O!==N&&O.contains(N)}}}return function(O,N){if(O===N){return false}while(O!=N&&(N=N[H])!==null){}return O===N}}function A(P,S,Q){for(var R,O=P[H];O!==null;){R=O.attributes;if(!R){return null}var N=R[S];if(N&&N.specified){if(N.value===Q||(Q===undefined)){return O}}O=O[H]}return null}function M(P,N){N=N[I]();for(var O=P[H];O!==null;){if(O[E]===N){return O}O=O[H]}return null}function C(O){for(var N=O.nextSibling;N!==null;N=N.nextSibling){if(N[F]===1){return N}}return null}function G(N){for(var O=N.previousSibling;O!==null;O=O.previousSibling){if(O[F]===1){return O}}return null}function J(R){var Q=0,P=[],O,N,T=R.children||R.childNodes,S;for(O=T.length;Q<O;Q++){S=T[Q];if(S[F]!==1){continue}P[P.length]=S}return P}})();(function(){var A="addEventListener" in this,F=A?"target":"srcElement";APE.mixin(APE.dom.Event={},{eventTarget:F,getTarget:D,addCallback:E,removeCallback:G,preventDefault:B});function D(H){return(H||window.event)[F]}function C(I,H){return A?H:function(J){H.call(I,J)}}function E(K,J,H){if(A){K.addEventListener(J,H,false)}else{var I=C(K,H);K.attachEvent("on"+J,I)}return I||H}function G(J,I,H){if(A){J.removeEventListener(I,H,false)}else{J.detachEvent("on"+I,H)}return H}function B(H){H=H||window.event;if("preventDefault" in H){H.preventDefault()}else{if("returnValue" in H){H.returnValue=false}}}})();APE.namespace("APE.dom.Event");(function(){var C=APE.dom,A=C.Event;A.getCoords=B;function B(E){var D;if("pageX" in E){D=function(F){return{x:F.pageX,y:F.pageY}}}else{D=function(G){var F=C.getScrollOffsets();G=G||window.event;return{x:G.clientX+F.left,y:G.clientY+F.top}}}return(A.getCoords=D)(E)}})();(function(){var Q=APE.dom;APE.mixin(Q,{getStyle:D,setOpacity:S});var R="getComputedStyle",E=Q.IS_COMPUTED_STYLE,P="currentStyle",O="opacity",F="style",G="px",J="filter",I="alpha("+O+"=",M=/^(?:margin|(border)(Width|Color|Style)|padding)$/,N=/\Wopacity\s*=\s*([\d]+)/i,T="cssFloat",L=T in document.documentElement[F]?T:"styleFloat",C=["Top","Right","Bottom","Left"];function K(V){var X,W=V[J];if(!N.test(W)){return 1}X=N.exec(W);return X[1]/100}function S(Y,V){var X=Y[F],W;if(O in X){X[O]=V}else{if(J in X){X[J]=I+(V*100)+")";W=Y[P];if(W&&!W.hasLayout){X.zoom=1}}}}function D(W,V){var d="",a,Z,X,Y,b,c=W[Q.OWNER_DOCUMENT];if(/float/.test(V)){V=L}if(E){a=c.defaultView[R](W,"");if(!(V in a)){return""}d=a[V];if(d===""){d=U(a,V).join(" ")}}else{a=W[P];if(V===O){d=K(a)}else{d=a[V];if(d==="auto"){d=A(W,V)}else{if(!(V in a)){return""}}}Z=H.exec(d);if(Z){X=d.split(" ");X[0]=B(W,Z[0]);for(Y=1,b=X.length;Y<b;Y++){Z=H.exec(X[Y]);X[Y]=B(W,Z[0])}d=X.join(" ")}}return d}function A(Z,b){var Y=Z[F],X,V,W,a=Z[Q.OWNER_DOCUMENT];if("pixelWidth" in Y&&/width|height|top|left/.test(b)){V="pixel"+(b.charAt(0).toUpperCase())+b.substring(1);X=Y[V];if(X===0){if(b==="width"){W=parseFloat(D(Z,"borderRightWidth"))||0;paddingWidth=parseFloat(D(Z,"paddingLeft"))||0+parseFloat(D(Z,"paddingRight"))||0;return Z.offsetWidth-Z.clientLeft-W-paddingWidth+G}else{if(b==="height"){W=parseFloat(D(Z,"borderBottomWidth"))||0;paddingWidth=parseFloat(D(Z,"paddingTop"))||0+parseFloat(D(Z,"paddingBottom"))||0;return Z.offsetHeight-Z.clientTop-W+G}}}return Y[V]+G}if(b=="margin"&&Z[P].position!="absolute"&&a.compatMode!=="BackCompat"){X=parseFloat(D(Z.parentNode,"width"))-Z.offsetWidth;if(X==0){return"0px"}X="0px "+X;return X+" "+X}}function U(b,W){var X=M.exec(W),Z,f,a,d,e,c=true,V,Y=1;if(X&&X[0]){V=C;Z=X[1]||X[0];f=X[2]||""}else{return[""]}a=b[Z+V[0]+f];e=[a];while(Y<4){d=b[Z+V[Y]+f];c=c&&d==a;a=d;e[Y++]=d}if(c){return[a]}return e}var H=/(-?\d+|(?:-?\d*\.\d+))(?:em|ex|pt|pc|in|cm|mm\s*)/;function B(Z,a){if(Z.runtimeStyle){if(parseFloat(a)===0){return"0px"}var Y=Z[F],X=Y.left,W=Z.runtimeStyle,V=W.left;W.left=Z[P].left;Y.left=(a||0);a=Y.pixelLeft+G;Y.left=X;W.left=V;return a}}})();