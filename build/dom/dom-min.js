APE.namespace("APE.dom");(function(){var C=APE.dom,D=document.documentElement,B="textContent",A=document.defaultView;C.IS_COMPUTED_STYLE=(typeof A!="undefined"&&"getComputedStyle" in A);C.textContent=B in D?B:"innerText"})();(function(){APE.mixin(APE.dom,{getScrollOffsets:A,getViewportDimensions:C});var B="documentElement",E=document[B],D=E&&E.clientWidth===0;E=null;function A(H){H=H||window;var G,I=H.document,F=I[B];if("pageXOffset" in H){G=function(){return{left:H.pageXOffset,top:H.pageYOffset}}}else{if(D){F=I.body}G=function(){return{left:F.scrollLeft,top:F.scrollTop}}}I=null;this.getScrollOffsets=G;return G()}function C(J){J=J||window;var G=J.document,K=G,I="client",L,H;if(typeof K.clientWidth=="number"){}else{if(D||F(J)){G=K.body}else{if(K[B].clientHeight>0){G=K[B]}else{if(typeof innerHeight=="number"){G=J;I="inner"}}}}L=I+"Width";H=I+"Height";return(this.getViewportDimensions=function(){return{width:G[L],height:G[H]}})();function F(N){var O=N.document,P=O.createElement("div");P.style.height="2500px";O.body.insertBefore(P,O.body.firstChild);var M=O[B].clientHeight>2400;O.body.removeChild(P);return M}}})();(function(){APE.mixin(APE.dom,{getOffsetCoords:Z,isAboveElement:D,isBelowElement:U,isInsideElement:J});var f=this.document,Y,e=f.documentElement,b=Math.round,W=Math.max,O=e&&e.clientWidth===0,P="clientTop" in e,N=/^h/.test(e.tagName)?"table":"TABLE",K="currentStyle" in e,R,C,c,T,Q,M,E,H,A,L,d,F=f.defaultView&&typeof f.defaultView.getComputedStyle!="undefined",G="getBoundingClientRect",a="relative",X="borderTopWidth",B="borderLeftWidth",I=/^(?:r|a)/,S=/^(?:a|f)/;function Z(h,z,AF){var AL=h.ownerDocument,AJ=AL.documentElement,u=AL.body;if(!z){z=AL}if(!AF){AF={x:0,y:0}}if(h===z){AF.x=AF.y=0;return AF}if(G in h){var AH=O?u:AJ,s=h[G](),r=s.left+W(AJ.scrollLeft,u.scrollLeft),p=s.top+W(AJ.scrollTop,u.scrollTop),AE,AB=AH.clientTop,i=AH.clientLeft;if(P){r-=i;p-=AB}if(z!==AL){s=Z(z,null);r-=s.x;p-=s.y;if(O&&z===u&&P){r-=i;p-=AB}}if(O&&K&&z!=AL&&z!==u){AE=u.currentStyle;r+=parseFloat(AE.marginLeft)||0+parseFloat(AE.left)||0;p+=parseFloat(AE.marginTop)||0+parseFloat(AE.top)||0}AF.x=r;AF.y=p;return AF}else{if(F){if(!Y){V()}var n=h.offsetLeft,AG=h.offsetTop,AC=AL.defaultView,m=AC.getComputedStyle(h,"");if(m.position=="fixed"){AF.x=n+AJ.scrollLeft;AF.y=AG+AJ.scrollTop;return AF}var t=AC.getComputedStyle(u,""),v=!I.test(t.position),l=h,o=h.parentNode,g=h.offsetParent;for(;o&&o!==z;o=o.parentNode){if(o!==u&&o!==AJ){n-=o.scrollLeft;AG-=o.scrollTop}if(o===g){if(o===u&&v){}else{if(!R&&!(o.tagName===N&&Q)){var k=AC.getComputedStyle(o,"");n+=parseFloat(k[B])||0;AG+=parseFloat(k[X])||0}if(o!==u){n+=g.offsetLeft;AG+=g.offsetTop;l=g;g=o.offsetParent}}}}var q=0,AD=0,AK,w,AI=z===AL||z===AJ,AA,j;if(l!=AL){j=AC.getComputedStyle(l,"").position;AK=S.test(j);w=AK||I.test(j)}if((l===h&&h.offsetParent===u&&!C&&z!==u&&!(v&&T))||(C&&l===h&&!w)||!v&&w&&E&&AI){AD+=parseFloat(t.marginTop)||0;q+=parseFloat(t.marginLeft)||0}if(z===u){AA=AC.getComputedStyle(AJ,"");if((!v&&((A&&!AK)||(L&&AK)))||v&&H){AD-=parseFloat(AA.paddingTop)||0;q-=parseFloat(AA.paddingLeft)||0}if(d){if(!w||w&&!v){AD-=parseFloat(AA.marginTop)||0}q-=parseFloat(AA.marginLeft)||0}}if(v){if(M||(!AK&&!R&&AI)){AD+=parseFloat(t[X]);q+=parseFloat(t[B])}}else{if(T){if(AI){if(!c){AD+=parseFloat(t.top)||0;q+=parseFloat(t.left)||0;if(AK&&R){AD+=parseFloat(t[X]);q+=parseFloat(t[B])}}if(z===AL&&!v&&!A){if(!AA){AA=AC.getComputedStyle(AJ,"")}AD+=parseFloat(AA.paddingTop)||0;q+=parseFloat(AA.paddingLeft)||0}}else{if(c){AD-=parseFloat(t.top);q-=parseFloat(t.left)}}if(C&&(!w||z===u)){AD-=parseFloat(t.marginTop)||0;q-=parseFloat(t.marginLeft)||0}}}AF.x=b(n+q);AF.y=b(AG+AD);return AF}}}function V(){Y=true;var p=f.body;if(!p){return}var g="marginTop",o="position",u="padding",m="static",l="border",y=p.style,j=y.cssText,t="1px solid transparent",q="0",n="1px",h="offsetTop",i=e.style,w=i.cssText,r=f.createElement("div"),k=r.style,v=f.createElement(N);y[u]=y[g]=y.top=q;i.position=m;y[l]=t;k.margin=q;k[o]=m;r=p.insertBefore(r,p.firstChild);R=(r[h]===1);y[l]=q;v.innerHTML="<tbody><tr><td>x</td></tr></tbody>";v.style[l]="7px solid";v.cellSpacing=v.cellPadding=q;p.insertBefore(v,p.firstChild);Q=v.getElementsByTagName("td")[0].offsetLeft===7;p.removeChild(v);y[g]=n;y[o]=a;C=(r[h]===1);T=p[h]===0;y[g]=q;y.top=n;c=r[h]===1;y.top=q;y[g]=n;y[o]=k[o]=a;E=r[h]===0;k[o]="absolute";y[o]=m;if(r.offsetParent===p){y[l]=t;k.top="2px";M=r[h]===1;y[l]=q;k[o]=a;i[u]=n;y[g]=q;H=r[h]===3;y[o]=a;A=r[h]===3;k[o]="absolute";L=r[h]===3;i[u]=q;i[g]=n;d=r[h]===3}p.removeChild(r);y.cssText=j||"";i.cssText=w||""}function J(h,g){var j=Z(h).y,i=Z(g).y;return j+h.offsetHeight<=i+g.offsetHeight&&j>=i}function D(h,g){return(Z(h).y<=Z(g).y)}function U(h,g){return(Z(h).y+h.offsetHeight>=Z(g).y+g.offsetHeight)}J=D=U=null})();(function(){APE.mixin(APE.dom,{hasToken:E,removeClass:J,addClass:F,getElementsByClassName:K,findAncestorWithClass:H});var G="className";function E(M,L){return B(L,"").test(M)}function J(M,L){var N=M[G];if(!N){return}if(N===L){M[G]="";return}M[G]=C(N.replace(B(L,"g")," "))}function F(M,L){if(!M[G]){M[G]=L}if(!B(L).test(M[G])){M[G]+=" "+L}}var A={};function B(M,L){var N=M+"$"+L;return(A[N]||(A[N]=RegExp("(?:^|\\s)"+M+"(?:$|\\s)",L)))}function K(M,N,T){if(!T){return[]}N=N||"*";if(M.getElementsByClassName&&(N==="*")){return M.getElementsByClassName(T)}var O=B(T,""),Q=M.getElementsByTagName(N),R=Q.length,L=0,P,S=Array(R);for(P=0;P<R;P++){if(O.test(Q[P][G])){S[L++]=Q[P]}}S.length=L;return S}function H(O,L,M){if(O==null||O===M){return null}var P=B(L,""),N;for(N=O.parentNode;N!=M;){if(P.test(N[G])){return N}N=N.parentNode}return null}var D=/^\s+|\s+$/g,I=/\s\s+/g;function C(L){return L.replace(D,"").replace(I," ")}})();(function(){var D=document.documentElement,F="nodeType",E="tagName",H="parentNode",B="compareDocumentPosition",I=/^H/.test(D[E])?"toUpperCase":"toLowerCase",K=/^[A-Z]/;APE.mixin(APE.dom,{contains:L(),findAncestorWithAttribute:A,findAncestorWithTagName:M,findNextSiblingElement:C,findPreviousSiblingElement:G,getChildElements:J});function L(){if(B in D){return function(O,N){return(O[B](N)&16)!==0}}else{if("contains" in D){return function(O,N){return O!==N&&O.contains(N)}}}return function(O,N){if(O===N){return false}while(O!=N&&(N=N[H])!==null){}return O===N}}function A(P,S,Q){for(var R,O=P[H];O!==null;){R=O.attributes;if(!R){return null}var N=R[S];if(N&&N.specified){if(N.value===Q||(Q===undefined)){return O}}O=O[H]}return null}function M(P,N){N=N[I]();for(var O=P[H];O!==null;){if(O[E]===N){return O}O=O[H]}return null}function C(O){for(var N=O.nextSibling;N!==null;N=N.nextSibling){if(N[F]===1){return N}}return null}function G(N){for(var O=N.previousSibling;O!==null;O=O.previousSibling){if(O[F]===1){return O}}return null}function J(R){var Q=0,P=[],O,N,T=R.children||R.childNodes,S;for(O=T.length;Q<O;Q++){S=T[Q];if(S[F]!==1){continue}P[P.length]=S}return P}})();(function(){var A="addEventListener" in this,F=A?"target":"srcElement";APE.mixin(APE.dom.Event={},{eventTarget:F,getTarget:D,addCallback:E,removeCallback:G,preventDefault:B});function D(H){return(H||window.event)[F]}function C(I,H){return A?H:function(J){H.call(I,J)}}function E(K,J,H){if(A){K.addEventListener(J,H,false)}else{var I=C(K,H);K.attachEvent("on"+J,I)}return I||H}function G(J,I,H){if(A){J.removeEventListener(I,H,false)}else{J.detachEvent("on"+I,H)}return H}function B(H){H=H||window.event;if("preventDefault" in H){H.preventDefault()}else{if("returnValue" in H){H.returnValue=false}}}})();APE.namespace("APE.dom.Event");(function(){var C=APE.dom,A=C.Event;A.getCoords=B;function B(E){var D;if("pageX" in E){D=function(F){return{x:F.pageX,y:F.pageY}}}else{D=function(G){var F=C.getScrollOffsets();G=G||window.event;return{x:G.clientX+F.left,y:G.clientY+F.top}}}return(A.getCoords=D)(E)}})();(function(){var U=/^(?:margin|(border)(Width|Color|Style)|padding)$/,F=/^[a-zA-Z]*[bB]orderRadius$/,X=APE.dom;APE.mixin(X,{getStyle:G,setOpacity:a,getFilterOpacity:L,multiLengthPropExp:U,borderRadiusExp:F,tryGetShorthandValues:b,getCurrentStyleValueFromAuto:A,convertNonPixelToPixel:B});var Z="getComputedStyle",H=X.IS_COMPUTED_STYLE,N="currentStyle",D="opacity",Y="style";function L(e){var d,f=e.filters;if(!f){return""}try{d=f(K[0])}catch(g){try{d=f(K[1]);K.reverse()}catch(c){}}return d&&d[D]/100||1}var K=["alpha","DXImageTransform.Microsoft.Alpha"],J="alpha("+D+"=";function a(g,d){var f=g[Y],e,c="hasLayout";if(D in f){f[D]=d}else{if("filter" in f){e=g[N];f.filter=J+(d*100)+")";if(e&&(c in e)&&!e[c]){Y.zoom=1}}}}function G(d,c){var m="",j,g,e,f,k,l=d.ownerDocument,h=l.defaultView;if(/float/.test(c)){c=Q}if(H){j=h[Z](d,"");if(F.test(c)){c=T}if(!(c in j)){return""}m=j[c];if(m===""){m=(b(j,c)).join(" ")}}else{j=d[N];if(c===D){m=L(d)}else{m=j[c];if(m=="auto"){m=A(d,c)}else{if(!(c in j)){return""}}}g=I.exec(m);if(g){e=m.split(" ");e[0]=B(d,g);for(f=1,k=e.length;f<k;f++){g=I.exec(e[f]);e[f]=B(d,g)}m=e.join(" ")}}return m}var M=document.documentElement[Y],Q="cssFloat" in M?"cssFloat":"styleFloat",W="orderRadius",P="b"+W,R="MozB"+W,E="WebkitB"+W,T=P in M?P:R in M?R:E,C=["Top","Right","Bottom","Left"],S=["Topright","Bottomright","Bottomleft","Topleft"];M=W=null;function A(g,i){var f=g[Y],e,d,h=g.ownerDocument;if("pixelWidth" in f&&V.test(i)){var c="pixel"+(i.charAt(0).toUpperCase())+i.substring(1);e=f[c];if(e===0){if(i=="width"){d=parseFloat(G(g,"borderRightWidth"))||0;paddingWidth=parseFloat(G(g,"paddingLeft"))||0+parseFloat(G(g,"paddingRight"))||0;return g.offsetWidth-g.clientLeft-d-paddingWidth+O}else{if(i=="height"){d=parseFloat(G(g,"borderBottomWidth"))||0;paddingWidth=parseFloat(G(g,"paddingTop"))||0+parseFloat(G(g,"paddingBottom"))||0;return g.offsetHeight-g.clientTop-d+O}}}return f[c]+O}if(i=="margin"&&g[N].position!="absolute"&&h.compatMode!=="BackCompat"){e=parseFloat(G(g.parentNode,"width"))-g.offsetWidth;if(e==0){return"0px"}e="0px "+e;return e+" "+e}}function b(j,d){var e=U.exec(d),g,n,h,l,m,k=true,c,f=1;if(e&&e[0]){c=C;g=e[1]||e[0];n=e[2]||""}else{if(F.test(d)){c=S;g=F.exec(d)[0];n=""}else{return[""]}}h=j[g+c[0]+n];m=[h];while(f<4){l=j[g+c[f]+n];k=k&&l==h;h=l;m[f++]=l}if(k){return[h]}return m}var I=/(-?\d+|(?:-?\d*\.\d+))(?:em|ex|pt|pc|in|cm|mm\s*)/,V=/width|height|top|left/,O="px";function B(g,h){if(g.runtimeStyle){var i=h[0];if(parseFloat(i)===0){return"0px"}var f=g[Y],e=f.left,d=g.runtimeStyle,c=d.left;d.left=g[N].left;f.left=(i||0);i=f.pixelLeft+O;f.left=e;d.left=c;return i}}})();(function(){var D=document,A=D.body,F,C="getElementById",E=document[C];if(!A){return setTimeout(arguments.callee,50)}try{F=D.createElement("<A NAME=0>");A.insertBefore(F,A.firstChild);if(D[C]("0")){A.removeChild(F);D[C]=B}}catch(A){}function B(J){var I=Function.prototype.call.call(E,this,J),H,G;if(I.id==J){return I}H=this.getElementsByName(J);for(G=0;G<H.length;G++){if(H[G].id===J){return H[G]}}return null}})();