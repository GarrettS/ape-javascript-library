(function(){if(typeof APE!=="undefined"){throw Error("APE is already defined.")}self.APE={namespace:J,mixin:M,extend:R,createFactory:Q,getById:P,deferError:C,toString:function(){return"[APE JavaScript Library]"}};function I(){}var A=0,T="instances",N="prototype",B=Object[N],L=B.hasOwnProperty,U=["toString","valueOf"];function J(Y){var Z=Y.split("."),W=self,X=0,F=Z.length,V;for(;X<F;X++){V=Z[X];if(!E(W,V)){W[V]=new O((W.qualifiedName||"APE")+"."+V)}W=W[V]}return W}function M(X,W){var Y,V=0,F;for(Y in W){if(E(W,Y)){X[Y]=W[Y]}}for(;V<U.length;V++){F=U[V];if(E(W,F)){X[F]=W[F]}}return X}function R(F,X,V){var W;I[N]=X[N];F[N]=W=new I;if(typeof V=="object"){APE.mixin(W,V)}W.constructor=F;return F}function C(F){window.setTimeout(function(){throw F},1)}function Q(F,W){return{getById:V,getByNode:V};function V(X){var Y=(typeof X==="string")?X:G(X);if(!(T in this)){if(typeof W==="function"){F[N]=W()}}return D.call(this,Y,F,arguments)}}function D(W,V,F){if(!E(this,T)){this[T]={}}return this[T][W]||(this[T][W]=H(V,F))}function P(F){return D.call(this,F,this,arguments)}function G(F){var W=F.id,V;if(!W){V=S(this)||"APE";W=F.id=V+"_"+(A++)}return W}function S(F){if(typeof F.name==="string"){return F.name}var V=Function[N].toString.call(F).match(/\s([a-z]+)\(/i);return V&&V[1]||""}function H(X,V){var W,F=I[N]=X[N];F.constructor=X;W=new I;X.apply(W,V);return W}O[N].toString=function(){return"["+this.qualifiedName+"]"};function O(F){this.qualifiedName=F}function E(W,V){var F;if(V in W){if(L){return L.call(W,V)}F=W.__proto__;if(F){return !(V in F)||F[V]!==W[V]}return B[V]!==W[V]}else{return false}}if(L&&!L.call(self,"Object")){var K=L;L=B.hasOwnProperty=function(F){return(this===self)?(F in this&&this[F]!==B[F]):K.call(this,F)}}})();APE.EventPublisher=function(B,A){this.src=B;this._callStack=[];this.type=A};APE.EventPublisher.prototype={add:function(B,A){this._callStack.push([B,A||this.src]);return this},addBefore:function(B,A){return APE.EventPublisher.add(this,"beforeFire",B,A||this.src)},addAfter:function(B,A){return APE.EventPublisher.add(this,"afterFire",B,A||this.src)},getEvent:function(A){return APE.EventPublisher.get(this,A)},remove:function(C,B){var F=this._callStack,D=0,A,E;if(!B){B=this.src}for(A=F.length;D<A;D++){E=F[D];if(E[0]===C&&E[1]===B){return F.splice(D,1)}}return null},removeBefore:function(B,A){return this.getEvent("beforeFire").remove(B,A)},removeAfter:function(B,A){return this.getEvent("afterFire").remove(B,A)},fire:function(A){return APE.EventPublisher.fire(this)(A)},toString:function(){return"APE.EventPublisher: {src="+this.src+", type="+this.type+", length="+this._callStack.length+"}"}};APE.EventPublisher.add=function(D,C,B,A){return APE.EventPublisher.get(D,C).add(B,A)};APE.EventPublisher.fire=function(B){return A;function A(I){var E=false,G=0,C,H=B._callStack,D;if(typeof B.beforeFire=="function"){try{if(B.beforeFire(I)==false){E=true}}catch(F){APE.deferError(F)}}for(C=H.length;G<C;G++){D=H[G];try{if(D[0].call(D[1],I)==false){E=true}}catch(F){APE.deferError(F)}}if(typeof B.afterFire=="function"){if(B.afterFire(I)==false){E=true}}return !E}};APE.EventPublisher.get=function(F,E){var D=this.Registry.hasOwnProperty(E)&&this.Registry[E]||(this.Registry[E]=[]),B=0,A=D.length,C;for(;B<A;B++){if(D[B].src===F){return D[B]}}C=new APE.EventPublisher(F,E);if(F[E]){C.add(F[E],F)}F[E]=this.fire(C);D[D.length]=C;return C};APE.EventPublisher.Registry={};APE.EventPublisher.cleanUp=function(){var C,E,D,B,A;for(C in this.Registry){E=this.Registry[C];for(B=0,A=E.length;B<A;B++){D=E[B];D.src[D.type]=null}}};if(window.CollectGarbage){APE.EventPublisher.get(window,"onunload").addAfter(APE.EventPublisher.cleanUp,APE.EventPublisher)}APE.namespace("APE.dom");(function(){var F=APE.dom,A="ownerDocument",E=document,G=E.documentElement,D=G&&A in G?A:"document",C="textContent",B=E.defaultView;F.OWNER_DOCUMENT=D;F.IS_COMPUTED_STYLE=(typeof B!="undefined"&&"getComputedStyle" in B);F.textContent=C in G?C:"innerText"})();(function(){APE.mixin(APE.dom,{getScrollOffsets:A,getViewportDimensions:C});var B="documentElement",E=document[B],D=E&&E.clientWidth===0;E=null;function A(H){H=H||window;var G,I=H.document,F=I[B];if("pageXOffset" in H){G=function(){return{left:H.pageXOffset,top:H.pageYOffset}}}else{if(D){F=I.body}G=function(){return{left:F.scrollLeft,top:F.scrollTop}}}I=null;this.getScrollOffsets=G;return G()}function C(J){J=J||window;var G=J.document,K=G,I="client",L,H;if(typeof K.clientWidth=="number"){}else{if(D||F(J)){G=K.body}else{if(K[B].clientHeight>0){G=K[B]}else{if(typeof innerHeight=="number"){G=J;I="inner"}}}}L=I+"Width";H=I+"Height";return(this.getViewportDimensions=function(){return{width:G[L],height:G[H]}})();function F(N){var O=N.document,P=O.createElement("div");P.style.height="2500px";O.body.insertBefore(P,O.body.firstChild);var M=O[B].clientHeight>2400;O.body.removeChild(P);return M}}})();(function(){var b=APE.dom;APE.mixin(b,{getOffsetCoords:c,isAboveElement:F,isBelowElement:W,isInsideElement:L});var i=this.document,a,h=i.documentElement,e=Math.round,Y=Math.max,D="getComputedStyle",C="defaultView",Q=h&&h.clientWidth===0,R="clientTop" in h,P=/^h/.test(h.tagName)?"table":"TABLE",M="currentStyle" in h,T,E,f,V,S,O,G,J,A,N,g,H=i[C]&&typeof i[C][D]!="undefined",I="getBoundingClientRect",d="relative",Z="borderTopWidth",B="borderLeftWidth",K=/^(?:r|a)/,U=/^(?:a|f)/;i=h=null;function c(k,AC,AI){var AO=k[b.OWNER_DOCUMENT],AM=AO.documentElement,z=AO.body;if(!AC){AC=AO}if(!AI){AI={x:0,y:0}}if(k===AC){AI.x=AI.y=0;return AI}if(I in k){var AK=Q?z:AM,v=k[I](),u=v.left+Y(AM.scrollLeft,z.scrollLeft),s=v.top+Y(AM.scrollTop,z.scrollTop),AH,AE=AK.clientTop,l=AK.clientLeft;if(R){u-=l;s-=AE}if(AC!==AO){v=c(AC,null);u-=v.x;s-=v.y;if(R){if(Q&&AC===z){u-=l;s-=AE}else{if(AC!==AO&&AC!==AM&&AC!==z){u-=AC.clientLeft;s-=AC.clientTop}}}}if(Q&&M&&AC!=AO&&AC!==z){AH=z.currentStyle;u+=parseFloat(AH.marginLeft)||0+parseFloat(AH.left)||0;s+=parseFloat(AH.marginTop)||0+parseFloat(AH.top)||0}AI.x=u;AI.y=s;return AI}else{if(H){if(!a){X()}var q=k.offsetLeft,AJ=k.offsetTop,AF=AO[C],p=AF[D](k,"");if(p.position=="fixed"){AI.x=q+AM.scrollLeft;AI.y=AJ+AM.scrollTop;return AI}var w=AF[D](z,""),AA=!K.test(w.position),o=k,r=k.parentNode,j=k.offsetParent;for(;r&&r!==AC;r=r.parentNode){if(r!==z&&r!==AM){q-=r.scrollLeft;AJ-=r.scrollTop}if(r===j){if(r===z&&AA){}else{if(!T&&!(r.tagName===P&&S)){var n=AF[D](r,"");q+=parseFloat(n[B])||0;AJ+=parseFloat(n[Z])||0}if(r!==z){q+=j.offsetLeft;AJ+=j.offsetTop;o=j;j=r.offsetParent}}}}var t=0,AG=0,AN,AB,AL=AC===AO||AC===AM,AD,m;if(o!=AO){m=AF[D](o,"").position;AN=U.test(m);AB=AN||K.test(m)}if((o===k&&k.offsetParent===z&&!E&&AC!==z&&!(AA&&V))||(E&&o===k&&!AB)||!AA&&AB&&G&&AL){AG+=parseFloat(w.marginTop)||0;t+=parseFloat(w.marginLeft)||0}if(AC===z){AD=AF[D](AM,"");if((!AA&&((A&&!AN)||(N&&AN)))||AA&&J){AG-=parseFloat(AD.paddingTop)||0;t-=parseFloat(AD.paddingLeft)||0}if(g){if(!AB||AB&&!AA){AG-=parseFloat(AD.marginTop)||0}t-=parseFloat(AD.marginLeft)||0}}if(AA){if(O||(!AN&&!T&&AL)){AG+=parseFloat(w[Z]);t+=parseFloat(w[B])}}else{if(V){if(AL){if(!f){AG+=parseFloat(w.top)||0;t+=parseFloat(w.left)||0;if(AN&&T){AG+=parseFloat(w[Z]);t+=parseFloat(w[B])}}if(AC===AO&&!AA&&!A){if(!AD){AD=AF[D](AM,"")}AG+=parseFloat(AD.paddingTop)||0;t+=parseFloat(AD.paddingLeft)||0}}else{if(f){AG-=parseFloat(w.top);t-=parseFloat(w.left)}}if(E&&(!AB||AC===z)){AG-=parseFloat(w.marginTop)||0;t-=parseFloat(w.marginLeft)||0}}}AI.x=e(q+t);AI.y=e(AJ+AG);return AI}}}function X(){a=true;var AA=document,n=AA.body;if(!n){return}var j="marginTop",AC="position",p="padding",y="static",t="border",o=n.style,AD=o.cssText,w="1px solid transparent",k="0",r="1px",u="offsetTop",q=AA.documentElement.style,AB=q.cssText,m=AA.createElement("div"),l=m.style,v=AA.createElement(P);o[p]=o[j]=o.top=k;q.position=y;o[t]=w;l.margin=k;l[AC]=y;m=n.insertBefore(m,n.firstChild);T=(m[u]===1);o[t]=k;v.innerHTML="<tbody><tr><td>x</td></tr></tbody>";v.style[t]="7px solid";v.cellSpacing=v.cellPadding=k;n.insertBefore(v,n.firstChild);S=v.getElementsByTagName("td")[0].offsetLeft===7;n.removeChild(v);o[j]=r;o[AC]=d;E=(m[u]===1);V=n[u]===0;o[j]=k;o.top=r;f=m[u]===1;o.top=k;o[j]=r;o[AC]=l[AC]=d;G=m[u]===0;l[AC]="absolute";o[AC]=y;if(m.offsetParent===n){o[t]=w;l.top="2px";O=m[u]===1;o[t]=k;l[AC]=d;q[p]=r;o[j]=k;J=m[u]===3;o[AC]=d;A=m[u]===3;l[AC]="absolute";N=m[u]===3;q[p]=k;q[j]=r;g=m[u]===3}n.removeChild(m);o.cssText=AD||"";q.cssText=AB||""}function L(k,j){var m=c(k).y,l=c(j).y;return m+k.offsetHeight<=l+j.offsetHeight&&m>=l}function F(k,j){return(c(k).y<=c(j).y)}function W(k,j){return(c(k).y+k.offsetHeight>=c(j).y+j.offsetHeight)}})();(function(){APE.mixin(APE.dom,{hasToken:E,removeClass:J,addClass:F,getElementsByClassName:K,findAncestorWithClass:H});var G="className";function E(M,L){return B(L,"").test(M)}function J(M,L){var N=M[G];if(!N){return}if(N===L){M[G]="";return}M[G]=C(N.replace(B(L,"g")," "))}function F(M,L){if(!M[G]){M[G]=L}if(!B(L).test(M[G])){M[G]+=" "+L}}var A={};function B(M,L){var N=M+"$"+L;return(A[N]||(A[N]=RegExp("(?:^|\\s)"+M+"(?:$|\\s)",L)))}function K(M,N,T){if(!T){return[]}N=N||"*";if(M.getElementsByClassName&&(N==="*")){return M.getElementsByClassName(T)}var O=B(T,""),Q=M.getElementsByTagName(N),R=Q.length,L=0,P,S=Array(R);for(P=0;P<R;P++){if(O.test(Q[P][G])){S[L++]=Q[P]}}S.length=L;return S}function H(O,L,M){if(O==null||O===M){return null}var P=B(L,""),N;for(N=O.parentNode;N!=M;){if(P.test(N[G])){return N}N=N.parentNode}return null}var D=/^\s+|\s+$/g,I=/\s\s+/g;function C(L){return L.replace(D,"").replace(I," ")}})();(function(){var D=document.documentElement,F="nodeType",E="tagName",H="parentNode",B="compareDocumentPosition",I=/^H/.test(D[E])?"toUpperCase":"toLowerCase",K=/^[A-Z]/;APE.mixin(APE.dom,{contains:L(),findAncestorWithAttribute:A,findAncestorWithTagName:M,findNextSiblingElement:C,findPreviousSiblingElement:G,getChildElements:J});function L(){if(B in D){return function(O,N){return(O[B](N)&16)!==0}}else{if("contains" in D){return function(O,N){return O!==N&&O.contains(N)}}}return function(O,N){if(O===N){return false}while(O!=N&&(N=N[H])!==null){}return O===N}}function A(P,S,Q){for(var R,O=P[H];O!==null;){R=O.attributes;if(!R){return null}var N=R[S];if(N&&N.specified){if(N.value===Q||(Q===undefined)){return O}}O=O[H]}return null}function M(P,N){N=N[I]();for(var O=P[H];O!==null;){if(O[E]===N){return O}O=O[H]}return null}function C(O){for(var N=O.nextSibling;N!==null;N=N.nextSibling){if(N[F]===1){return N}}return null}function G(N){for(var O=N.previousSibling;O!==null;O=O.previousSibling){if(O[F]===1){return O}}return null}function J(R){var Q=0,P=[],O,N,T=R.children||R.childNodes,S;for(O=T.length;Q<O;Q++){S=T[Q];if(S[F]!==1){continue}P[P.length]=S}return P}})();(function(){var A="addEventListener" in this,F=A?"target":"srcElement";APE.mixin(APE.dom.Event={},{eventTarget:F,getTarget:D,addCallback:E,removeCallback:G,preventDefault:B});function D(H){return(H||window.event)[F]}function C(I,H){return A?H:function(J){H.call(I,J)}}function E(K,J,H){if(A){K.addEventListener(J,H,false)}else{var I=C(K,H);K.attachEvent("on"+J,I)}return I||H}function G(J,I,H){if(A){J.removeEventListener(I,H,false)}else{J.detachEvent("on"+I,H)}return H}function B(H){H=H||window.event;if("preventDefault" in H){H.preventDefault()}else{if("returnValue" in H){H.returnValue=false}}}})();APE.namespace("APE.dom.Event");(function(){var C=APE.dom,A=C.Event;A.getCoords=B;function B(E){var D;if("pageX" in E){D=function(F){return{x:F.pageX,y:F.pageY}}}else{D=function(G){var F=C.getScrollOffsets();G=G||window.event;return{x:G.clientX+F.left,y:G.clientY+F.top}}}return(A.getCoords=D)(E)}})();(function(){var Y=APE.dom;APE.mixin(Y,{getStyle:F,setOpacity:a});var Z="getComputedStyle",G=Y.IS_COMPUTED_STYLE,X="currentStyle",W="opacity",H="style",I="px",L="filter",K="alpha("+W+"=",T=/^(?:margin|(border)(Width|Color|Style)|padding)$/,E=/^[a-zA-Z]*[bB]orderRadius$/,U=/opacity\s*=\s*([\d]+)/i;function M(c){var e,d=c[L];if(!U.test(d)){return 1}e=U.exec(d);return e[1]/100}function a(f,c){var e=f[H],d;if(W in e){e[W]=c}else{if(L in e){e[L]=K+(c*100)+")";d=f[X];if(d&&!d.hasLayout){e.zoom=1}}}}function F(d,c){var l="",h,g,e,f,j,k=d[Y.OWNER_DOCUMENT];if(/float/.test(c)){c=P}if(G){h=k.defaultView[Z](d,"");if(E.test(c)){c=S}if(!(c in h)){return""}l=h[c];if(l===""){l=(b(h,c)).join(" ")}}else{h=d[X];if(c===W){l=M(h)}else{l=h[c];if(l==="auto"){l=A(d,c)}else{if(!(c in h)){return""}}}g=J.exec(l);if(g){e=l.split(" ");e[0]=B(d,g);for(f=1,j=e.length;f<j;f++){g=J.exec(e[f]);e[f]=B(d,g)}l=e.join(" ")}}return l}var N=document.documentElement[H],P="cssFloat" in N?"cssFloat":"styleFloat",V="orderRadius",O="b"+V,Q="MozB"+V,D="WebkitB"+V,S=O in N?O:Q in N?Q:D,C=["Top","Right","Bottom","Left"],R=["Topright","Bottomright","Bottomleft","Topleft"];N=O=Q=D=V=null;function A(g,i){var f=g[H],e,d,h=g[Y.OWNER_DOCUMENT];if("pixelWidth" in f&&/width|height|top|left/.test(i)){var c="pixel"+(i.charAt(0).toUpperCase())+i.substring(1);e=f[c];if(e===0){if(i==="width"){d=parseFloat(F(g,"borderRightWidth"))||0;paddingWidth=parseFloat(F(g,"paddingLeft"))||0+parseFloat(F(g,"paddingRight"))||0;return g.offsetWidth-g.clientLeft-d-paddingWidth+I}else{if(i==="height"){d=parseFloat(F(g,"borderBottomWidth"))||0;paddingWidth=parseFloat(F(g,"paddingTop"))||0+parseFloat(F(g,"paddingBottom"))||0;return g.offsetHeight-g.clientTop-d+I}}}return f[c]+I}if(i=="margin"&&g[X].position!="absolute"&&h.compatMode!=="BackCompat"){e=parseFloat(F(g.parentNode,"width"))-g.offsetWidth;if(e==0){return"0px"}e="0px "+e;return e+" "+e}}function b(j,d){var e=T.exec(d),g,n,h,l,m,k=true,c,f=1;if(e&&e[0]){c=C;g=e[1]||e[0];n=e[2]||""}else{if(E.test(d)){c=R;g=E.exec(d)[0];n=""}else{return[""]}}h=j[g+c[0]+n];m=[h];while(f<4){l=j[g+c[f]+n];k=k&&l==h;h=l;m[f++]=l}if(k){return[h]}return m}var J=/(-?\d+|(?:-?\d*\.\d+))(?:em|ex|pt|pc|in|cm|mm\s*)/;function B(g,h){if(g.runtimeStyle){var i=h[0];if(parseFloat(i)===0){return"0px"}var f=g[H],e=f.left,d=g.runtimeStyle,c=d.left;d.left=g[X].left;f.left=(i||0);i=f.pixelLeft+I;f.left=e;d.left=c;return i}}})();(function(){var D=document,A=D.body,F,C="getElementById",E=document[C];if(!A){return setTimeout(arguments.callee,50)}try{F=D.createElement("<A NAME=0>");A.insertBefore(F,A.firstChild);if(D[C]("0")){A.removeChild(F);D[C]=B}}catch(A){}function B(J){var I=Function.prototype.call.call(E,this,J),H,G;if(I.id==J){return I}H=this.getElementsByName(J);for(G=0;G<H.length;G++){if(H[G].id===J){return H[G]}}return null}})();