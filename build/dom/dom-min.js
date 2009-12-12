APE.namespace("APE.dom");(function(){var w=APE.dom,B="ownerDocument",m=document,q=m.documentElement;B=q&&typeof q[B]!=="undefined"?B:"document";m=m.defaultView;w.OWNER_DOCUMENT=B;w.IS_COMPUTED_STYLE=typeof m!="undefined"&&"getComputedStyle"in m})();
(function(){function w(t){t=t||window;var p;p="pageXOffset"in t?function(j){j=j||window;return{left:j.pageXOffset,top:j.pageYOffset}}:function(j){j=j||window;j=j.document[q?"body":m];return{left:j.scrollLeft,top:j.scrollTop}};p=(this.getScrollOffsets=p)(t);t=null;return p}function B(t){function p(a){a=(a||window)[j][x];return{width:a[s],height:a[d]}}t=t||window;var j="document",x=j,F=t[j],z="client",s,d;if(typeof F.clientWidth=="number")j="window";else if(q){j=m;x="body"}else if(F[m].clientHeight>
0)x=m;s=z+"Width";d=z+"Height";r=(this.getViewportDimensions=p)(t);t=F=null;return r}APE.mixin(APE.dom,{getScrollOffsets:w,getViewportDimensions:B});var m="documentElement",q=document[m].clientWidth===0})();
(function(){function w(i,f,u){var y=i[p.OWNER_DOCUMENT],I=y.documentElement,C=y.body;f||(f=y);u||(u={x:0,y:0});u.x=u.y=0;if(i===f)return u;if(aa in i){var G=l?C:I,n=i[aa]();i=n.left+d(I.scrollLeft,C.scrollLeft);var J=n.top+d(I.scrollTop,C.scrollTop),D=G.clientTop;G=G.clientLeft;if(v){i-=G;J-=D}if(f!==y){n=w(f,null);i-=n.x;J-=n.y;if(v)if(l&&f===C){i-=G;J-=D}else if(f!==y&&f!==I&&f!==C){i-=f.clientLeft;J-=f.clientTop}}if(l&&R&&f!=y&&f!==C){f=C.currentStyle;i+=a(f.marginLeft)||0+a(f.left)||0;J+=a(f.marginTop)||
0+a(f.top)||0}u.x=i;u.y=J;return u}else if(ca){F||B();J=i.offsetLeft;G=i.offsetTop;n=y[g];var M=n[c](i,"")||i.style;if(M.position=="fixed"&&j){u.x=J+I.scrollLeft;u.y=G+I.scrollTop;return u}D=n[c](C,"");for(var K=!ba.test(D.position),H=i,o=i.parentNode,E=i.offsetParent;o&&o!==f;o=o.parentNode){if(o!==C&&o!==I&&j){J-=o.scrollLeft;G-=o.scrollTop}if(o===E)if(!(o===C&&K)){if(!V&&!(o.tagName===N&&b)){var A=n[c](o,"");J+=a(A[Z])||0;G+=a(A[$])||0}if(o!==C){J+=E.offsetLeft;G+=E.offsetTop;H=E;E=o.offsetParent}}}E=
o=0;var O,P;A=f===y||f===I;var Q;if(H!=y)if(M=n[c](H,"")){P=M.position;P=(O=da.test(P))||ba.test(P)}if(H===i&&i.offsetParent===C&&!T&&f!==C&&!(K&&h)||T&&H===i&&!P||!K&&P&&L&&A){E+=a(D.marginTop)||0;o+=a(D.marginLeft)||0}if(f===C){Q=n[c](I,"");if(!K&&(U&&!O||W&&O)||K&&S){E-=a(Q.paddingTop)||0;o-=a(Q.paddingLeft)||0}if(X){if(!P||P&&!K)E-=a(Q.marginTop)||0;o-=a(Q.marginLeft)||0}}if(K){if(k||!O&&!V&&A){E+=a(D[$]);o+=a(D[Z])}}else if(h){if(A){if(!e){E+=a(D.top)||0;o+=a(D.left)||0;if(O&&V){E+=a(D[$]);o+=
a(D[Z])}}if(f===y&&!K&&!U){Q||(Q=n[c](I,""));E+=a(Q.paddingTop)||0;o+=a(Q.paddingLeft)||0}}else if(e){E-=a(D.top);o-=a(D.left)}if(T&&(!P||f===C)){E-=a(D.marginTop)||0;o-=a(D.marginLeft)||0}}u.x=s(J+o);u.y=s(G+E);return u}}function B(){F=true;var i=document,f=i.body;if(f){var u="marginTop",y="position",I="padding",C="static",G="border",n=f.style,J=n.cssText,D="1px solid transparent",M="0",K="1px",H="offsetTop",o=i.documentElement.style,E=o.cssText,A=i.createElement("div"),O=A.style;i=i.createElement(N);
n[I]=n[u]=n.top=M;o.position=C;n[G]=D;O.margin=M;O[y]=C;A=f.insertBefore(A,f.firstChild);V=A[H]===1;n[G]=M;i.innerHTML="<tbody><tr><td>x</td></tr></tbody>";i.style[G]="7px solid";i.cellSpacing=i.cellPadding=M;f.insertBefore(i,f.firstChild);b=i.getElementsByTagName("td")[0].offsetLeft===7;f.removeChild(i);n[u]=K;n[y]=Y;T=A[H]===1;h=f[H]===0;n[u]=M;n.top=K;e=A[H]===1;n.top=M;n[u]=K;n[y]=O[y]=Y;L=A[H]===0;O[y]="absolute";n[y]=C;if(A.offsetParent===f){n[G]=D;O.top="2px";k=A[H]===1;n[G]=M;O[y]=Y;o[I]=
K;n[u]=M;S=A[H]===3;n[y]=Y;U=A[H]===3;O[y]="absolute";W=A[H]===3;o[I]=M;o[u]=K;X=A[H]===3}f.removeChild(A);n.cssText=J||"";o.cssText=E||""}}function m(i,f){var u=w(i).y,y=w(f).y;return u+i.offsetHeight<=y+f.offsetHeight&&u>=y}function q(i,f){return w(i).y<=w(f).y}function t(i,f){return w(i).y+i.offsetHeight>=w(f).y+f.offsetHeight}var p=APE.dom,j=typeof document.createElement("p").scrollLeft=="number";APE.mixin(p,{getOffsetCoords:w,isAboveElement:q,isBelowElement:t,isInsideElement:m,IS_SCROLL_SUPPORTED:j});
var x=this.document,F,z=x.documentElement,s=Math.round,d=Math.max,a=self.parseFloat,c="getComputedStyle",g="defaultView",l=z&&z.clientWidth===0,v="clientTop"in z,N=/^h/.test(z.tagName)?"table":"TABLE",R="currentStyle"in z,V,T,e,h,b,k,L,S,U,W,X,ca=x[g]&&typeof x[g][c]!="undefined",aa="getBoundingClientRect",Y="relative",$="borderTopWidth",Z="borderLeftWidth",ba=/^(?:r|a)/,da=/^(?:a|f)/;x=z=null})();
(function(){function w(d,a){return q(a,"").test(d)}function B(d,a){var c=d[x];if(c)d[x]=c===a?"":j(c.replace(q(a,"g")," "))}function m(d,a){d[x]||(d[x]=a);q(a).test(d[x])||(d[x]+=" "+a)}function q(d,a){var c=d+"$"+a;return F[c]||(F[c]=RegExp("(?:^|\\s)"+d+"(?:$|\\s)",a))}function t(d,a,c){if(!c)return[];a=a||"*";if(d.getElementsByClassName&&a==="*")return d.getElementsByClassName(c);c=q(c,"");d=d.getElementsByTagName(a);a=[];var g=a.length=d.length,l=0,v;for(v=0;v<g;v++)if(c.test(d[v][x]))a[l++]=
d[v];a.length=l;return a}function p(d,a,c){if(d==null||d===c)return null;a=q(a,"");for(d=d.parentNode;d!=c;){if(a.test(d[x]))return d;d=d.parentNode}return null}function j(d){return d.replace(z,"").replace(s," ")}APE.mixin(APE.dom,{hasToken:w,removeClass:B,addClass:m,getElementsByClassName:t,findAncestorWithClass:p});var x="className",F={},z=/^\s+|\s+$/g,s=/\s\s+/g})();
(function(){function w(){if(z in j)return function(a,c){return(a[z](c)&16)!==0};else if("contains"in j)return function(a,c){return a!==c&&a.contains(c)};return function(a,c){if(a===c)return false;for(;a!==c&&(c=c[s])!==null;);return a===c}}function B(a,c,g){var l;for(a=a[s];a!==null;){l=a.attributes;if(!l||!x)return null;if((l=l.getNamedItem(c))&&l.specified)if(l.value===g||g===undefined)return a;a=a[s]}return null}function m(a,c){c=c[d]();for(a=a[s];a!==null;){if(a.tagName===c)return a;a=a[s]}return null}
function q(a){for(a=a.nextSibling;a!==null;a=a.nextSibling)if(a[F]===1)return a;return null}function t(a){for(a=a.previousSibling;a!==null;a=a.previousSibling)if(a[F]===1)return a;return null}function p(a){var c,g=[],l=a.childNodes,v=l.length,N;g.length=v;for(a=c=0;a<v;a++){N=l[a];if(N[F]===1)g[c++]=N}g.length=c;return g}var j=document.documentElement,x="getNamedItem"in j.attributes,F="nodeType",z="compareDocumentPosition",s="parentNode",d=/^H/.test(j.tagName)?"toUpperCase":"toLowerCase";APE.mixin(APE.dom,
{contains:w(),findAncestorWithAttribute:B,findAncestorWithTagName:m,findNextSiblingElement:q,findPreviousSiblingElement:t,getChildElements:p});j=null})();
(function(){function w(g){return(g||window.event)[d]}function B(g,l){return function(v){l.call(g,v)}}function m(g,l,v,N){if(s)g.addEventListener(l,v,!!N);else{var R=B(g,v);g.attachEvent("on"+l,R)}return R||v}function q(g,l,v,N){s?g.removeEventListener(l,v,!!N):g.detachEvent("on"+l,v);return v}function t(g,l){return m(g,a,l,true)}function p(g,l){return m(g,c,l,true)}function j(g,l){q(g,a,l,true)}function x(g,l){q(g,c,l,true)}function F(g){g=g||window.event;if("preventDefault"in g)g.preventDefault();
else if("returnValue"in g)g.returnValue=false}function z(g){if(s)g.stopPropagation();else g.cancelBubble=true}var s="addEventListener"in this,d=s?"target":"srcElement",a=s?"focus":"focusin",c=s?"blur":"focusout";APE.mixin(APE.dom.Event={},{getTarget:w,addCallback:m,removeCallback:q,addDelegatedFocus:t,addDelegatedBlur:p,removeDelegatedFocus:j,removeDelegatedBlur:x,preventDefault:F,stopPropagation:z})})();APE.namespace("APE.dom.Event");
(function(){function w(q){var t;t="pageX"in q?function(p){return{x:p.pageX,y:p.pageY}}:function(p){var j=B.getScrollOffsets();p=p||window.event;return{x:p.clientX+j.left,y:p.clientY+j.top}};return(m.getCoords=t)(q)}var B=APE.dom,m=B.Event;m.getCoords=w})();
(function(){function w(e){e=e[c];if(!v.test(e))return 1;e=v.exec(e);return e[1]/100}function B(e,h){var b=e[d];if(s in b)b[s]=h;else if(c in b){b[c]=g+h*100+")";if((e=e[z])&&!e.hasLayout)b.zoom=1}}function m(e,h){var b="",k,L;b=e[j.OWNER_DOCUMENT];if(/float/.test(h))h=R;if(F){k=b.defaultView[x](e,"");if(!(h in k))return"";b=k[h];if(b==="")b=t(k,h).join(" ");if(h=="zIndex"&&b=="normal")return"0";if(N.test(b))b=q(e,h)}else{k=e[z];if(h===s)b=w(k);else{b=k[h];if(N.test(b))b=q(e,h);else if(!(h in k))return""}if(h=
T.exec(b)){b=b.split(" ");b[0]=p(e,h[0]);k=1;for(L=b.length;k<L;k++){h=T.exec(b[k]);b[k]=p(e,h[0])}b=b.join(" ")}}return b}function q(e,h){var b=e[d],k;if("pixelWidth"in b&&/width|height|top|left/.test(h)){k="pixel"+h.charAt(0).toUpperCase()+h.substring(1);k=b[k]}if(k)return k+a;if(h==="width"){b=e.clientLeft||0;h=parseFloat(m(e,"borderRightWidth"))||b;k=parseFloat(m(e,"paddingLeft"))||0+parseFloat(m(e,"paddingRight"))||0;return e.offsetWidth-b-h-k+a}else if(h==="height"){b=e.clientTop||0;h=parseFloat(m(e,
"borderBottomWidth"))||b;parseFloat(m(e,"paddingTop"))||parseFloat(m(e,"paddingBottom"));return e.offsetHeight-b-h+a}else if(h=="margin"&&e[z].position!="absolute"){k=parseFloat(m(e.parentNode,"width"))-e.offsetWidth;if(k===0)return"0px";k="0px "+k;return k+" "+k}return"0"}function t(e,h){var b=l.exec(h),k,L,S,U=true,W,X=1;if(b&&b[0]){W=V;h=b[1]||b[0];b=b[2]||""}else return[""];k=e[h+W[0]+b];for(S=[k];X<4;){L=e[h+W[X]+b];U=U&&L==k;k=L;S[X++]=L}if(U)return[k];return S}function p(e,h){if(e.runtimeStyle){if(parseFloat(h)===
0)return"0px";var b=e[d],k=b.left,L=e.runtimeStyle,S=L.left;L.left=e[z].left;b.left=h||0;h=b.pixelLeft+a;b.left=k;L.left=S;return h}}var j=APE.dom;j.getStyle=m;j.setOpacity=B;var x="getComputedStyle",F=j.IS_COMPUTED_STYLE,z="currentStyle",s="opacity",d="style",a="px",c="filter",g="alpha("+s+"=",l=/^(?:margin|(border)(Width|Color|Style)|padding)$/,v=/\Wopacity\s*=\s*([\d]+)/i,N=/^auto|\d%$/,R="cssFloat",V=["Top","Right","Bottom","Left"];R in document.documentElement[d]||(R="styleFloat");var T=/(-?\d+|(?:-?\d*\.\d+))(?:em|ex|pt|pc|in|cm|mm\s*)/})();
