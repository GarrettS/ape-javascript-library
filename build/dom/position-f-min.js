APE.namespace("APE.dom");(function(){var B=APE.dom,N=typeof document.createElement("p").scrollLeft=="number";APE.createMixin(B,{getOffsetCoords:J,isAboveElement:U,isBelowElement:D,isInsideElement:P,IS_SCROLL_SUPPORTED:N});var I=this.document,c,O=I.documentElement,f=Math.round,W=Math.max,S=self.parseFloat,k="getComputedStyle",Z="defaultView",e=O&&O.clientWidth===0,Q="clientTop" in O,X=/^h/.test(O.tagName)?"table":"TABLE",j="currentStyle" in O,K,C,b,L,i,g,d,T,Y,F,A,H=I[Z]&&typeof I[Z][k]!="undefined",G="getBoundingClientRect",M="relative",R="borderTopWidth",a="borderLeftWidth",E=/^(?:r|a)/,V=/^(?:a|f)/;I=O=null;function J(m,AE,AK){var AQ=m[B.OWNER_DOCUMENT],AO=AQ.documentElement,AB=AQ.body;if(!AE){AE=AQ}if(!AK){AK={x:0,y:0}}AK.x=AK.y=0;if(m===AE){return AK}if(G in m){var AM=e?AB:AO,z=m[G](),w=z.left+W(AO.scrollLeft,AB.scrollLeft),u=z.top+W(AO.scrollTop,AB.scrollTop),AJ,AG=AM.clientTop,n=AM.clientLeft;if(Q){w-=n;u-=AG}if(AE!==AQ){z=J(AE,null);w-=z.x;u-=z.y;if(Q){if(e&&AE===AB){w-=n;u-=AG}else{if(AE!==AQ&&AE!==AO&&AE!==AB){w-=AE.clientLeft;u-=AE.clientTop}}}}if(e&&j&&AE!=AQ&&AE!==AB){AJ=AB.currentStyle;w+=S(AJ.marginLeft)||0+S(AJ.left)||0;u+=S(AJ.marginTop)||0+S(AJ.top)||0}AK.x=w;AK.y=u;return AK}else{if(H){if(!c){h()}var s=m.offsetLeft,AL=m.offsetTop,AH=AQ[Z],r=AH[k](m,"")||m.style;if(r.position=="fixed"&&N){AK.x=s+AO.scrollLeft;AK.y=AL+AO.scrollTop;return AK}var AA=AH[k](AB,""),AC=!E.test(AA.position),q=m,t=m.parentNode,l=m.offsetParent;for(;t&&t!==AE;t=t.parentNode){if(t!==AB&&t!==AO&&N){s-=t.scrollLeft;AL-=t.scrollTop}if(t===l){if(t===AB&&AC){}else{if(!K&&!(t.tagName===X&&i)){var p=AH[k](t,"");s+=S(p[a])||0;AL+=S(p[R])||0}if(t!==AB){s+=l.offsetLeft;AL+=l.offsetTop;q=l;l=t.offsetParent}}}}var v=0,AI=0,AP,AD,AN=AE===AQ||AE===AO,AF,o;if(q!=AQ){r=AH[k](q,"");if(r){o=r.position;AP=V.test(o);AD=AP||E.test(o)}}if((q===m&&m.offsetParent===AB&&!C&&AE!==AB&&!(AC&&L))||(C&&q===m&&!AD)||!AC&&AD&&d&&AN){AI+=S(AA.marginTop)||0;v+=S(AA.marginLeft)||0}if(AE===AB){AF=AH[k](AO,"");if((!AC&&((Y&&!AP)||(F&&AP)))||AC&&T){AI-=S(AF.paddingTop)||0;v-=S(AF.paddingLeft)||0}if(A){if(!AD||AD&&!AC){AI-=S(AF.marginTop)||0}v-=S(AF.marginLeft)||0}}if(AC){if(g||(!AP&&!K&&AN)){AI+=S(AA[R]);v+=S(AA[a])}}else{if(L){if(AN){if(!b){AI+=S(AA.top)||0;v+=S(AA.left)||0;if(AP&&K){AI+=S(AA[R]);v+=S(AA[a])}}if(AE===AQ&&!AC&&!Y){if(!AF){AF=AH[k](AO,"")}AI+=S(AF.paddingTop)||0;v+=S(AF.paddingLeft)||0}}else{if(b){AI-=S(AA.top);v-=S(AA.left)}}if(C&&(!AD||AE===AB)){AI-=S(AA.marginTop)||0;v-=S(AA.marginLeft)||0}}}AK.x=f(s+v);AK.y=f(AL+AI);return AK}}}function h(){c=true;var AC=document,p=AC.body;if(!p){return}var l="marginTop",AE="position",r="padding",AB="static",v="border",q=p.style,AF=q.cssText,AA="1px solid transparent",m="0",u="1px",w="offsetTop",t=AC.documentElement.style,AD=t.cssText,o=AC.createElement("div"),n=o.style,y=AC.createElement(X);q[r]=q[l]=q.top=m;t.position=AB;q[v]=AA;n.margin=m;n[AE]=AB;o=p.insertBefore(o,p.firstChild);K=(o[w]===1);q[v]=m;y.innerHTML="<tbody><tr><td>x</td></tr></tbody>";y.style[v]="7px solid";y.cellSpacing=y.cellPadding=m;p.insertBefore(y,p.firstChild);i=y.getElementsByTagName("td")[0].offsetLeft===7;p.removeChild(y);q[l]=u;q[AE]=M;C=(o[w]===1);L=p[w]===0;q[l]=m;q.top=u;b=o[w]===1;q.top=m;q[l]=u;q[AE]=n[AE]=M;d=o[w]===0;n[AE]="absolute";q[AE]=AB;if(o.offsetParent===p){q[v]=AA;n.top="2px";g=o[w]===1;q[v]=m;n[AE]=M;t[r]=u;q[l]=m;T=o[w]===3;q[AE]=M;Y=o[w]===3;n[AE]="absolute";F=o[w]===3;t[r]=m;t[l]=u;A=o[w]===3}p.removeChild(o);q.cssText=AF||"";t.cssText=AD||""}function P(m,l){var o=J(m).y,n=J(l).y;return o+m.offsetHeight<=n+l.offsetHeight&&o>=n}function U(m,l){return(J(m).y<=J(l).y)}function D(m,l){return(J(m).y+m.offsetHeight>=J(l).y+l.offsetHeight)}})();