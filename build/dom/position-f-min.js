APE.namespace("APE.dom");(function(){APE.mixin(APE.dom,{getOffsetCoords:b,isAboveElement:F,isBelowElement:W,isInsideElement:L});var h=this.document,a,g=h.documentElement,d=Math.round,Y=Math.max,D="getComputedStyle",C="defaultView",Q=g&&g.clientWidth===0,R="clientTop" in g,P=/^h/.test(g.tagName)?"table":"TABLE",M="currentStyle" in g,T,E,e,V,S,O,G,J,A,N,f,H=h[C]&&typeof h[C][D]!="undefined",I="getBoundingClientRect",c="relative",Z="borderTopWidth",B="borderLeftWidth",K=/^(?:r|a)/,U=/^(?:a|f)/;h=g=null;function b(j,AB,AH){var AN=j.ownerDocument,AL=AN.documentElement,w=AN.body;if(!AB){AB=AN}if(!AH){AH={x:0,y:0}}if(j===AB){AH.x=AH.y=0;return AH}if(I in j){var AJ=Q?w:AL,u=j[I](),t=u.left+Y(AL.scrollLeft,w.scrollLeft),r=u.top+Y(AL.scrollTop,w.scrollTop),AG,AD=AJ.clientTop,k=AJ.clientLeft;if(R){t-=k;r-=AD}if(AB!==AN){u=b(AB,null);t-=u.x;r-=u.y;if(R){if(Q&&AB===w){t-=k;r-=AD}else{if(AB!==AN&&AB!==AL&&AB!==w){t-=AB.clientLeft;r-=AB.clientTop}}}}if(Q&&M&&AB!=AN&&AB!==w){AG=w.currentStyle;t+=parseFloat(AG.marginLeft)||0+parseFloat(AG.left)||0;r+=parseFloat(AG.marginTop)||0+parseFloat(AG.top)||0}AH.x=t;AH.y=r;return AH}else{if(H){if(!a){X()}var p=j.offsetLeft,AI=j.offsetTop,AE=AN[C],o=AE[D](j,"");if(o.position=="fixed"){AH.x=p+AL.scrollLeft;AH.y=AI+AL.scrollTop;return AH}var v=AE[D](w,""),z=!K.test(v.position),n=j,q=j.parentNode,i=j.offsetParent;for(;q&&q!==AB;q=q.parentNode){if(q!==w&&q!==AL){p-=q.scrollLeft;AI-=q.scrollTop}if(q===i){if(q===w&&z){}else{if(!T&&!(q.tagName===P&&S)){var m=AE[D](q,"");p+=parseFloat(m[B])||0;AI+=parseFloat(m[Z])||0}if(q!==w){p+=i.offsetLeft;AI+=i.offsetTop;n=i;i=q.offsetParent}}}}var s=0,AF=0,AM,AA,AK=AB===AN||AB===AL,AC,l;if(n!=AN){l=AE[D](n,"").position;AM=U.test(l);AA=AM||K.test(l)}if((n===j&&j.offsetParent===w&&!E&&AB!==w&&!(z&&V))||(E&&n===j&&!AA)||!z&&AA&&G&&AK){AF+=parseFloat(v.marginTop)||0;s+=parseFloat(v.marginLeft)||0}if(AB===w){AC=AE[D](AL,"");if((!z&&((A&&!AM)||(N&&AM)))||z&&J){AF-=parseFloat(AC.paddingTop)||0;s-=parseFloat(AC.paddingLeft)||0}if(f){if(!AA||AA&&!z){AF-=parseFloat(AC.marginTop)||0}s-=parseFloat(AC.marginLeft)||0}}if(z){if(O||(!AM&&!T&&AK)){AF+=parseFloat(v[Z]);s+=parseFloat(v[B])}}else{if(V){if(AK){if(!e){AF+=parseFloat(v.top)||0;s+=parseFloat(v.left)||0;if(AM&&T){AF+=parseFloat(v[Z]);s+=parseFloat(v[B])}}if(AB===AN&&!z&&!A){if(!AC){AC=AE[D](AL,"")}AF+=parseFloat(AC.paddingTop)||0;s+=parseFloat(AC.paddingLeft)||0}}else{if(e){AF-=parseFloat(v.top);s-=parseFloat(v.left)}}if(E&&(!AA||AB===w)){AF-=parseFloat(v.marginTop)||0;s-=parseFloat(v.marginLeft)||0}}}AH.x=d(p+s);AH.y=d(AI+AF);return AH}}}function X(){a=true;var r=h.body;if(!r){return}var i="marginTop",q="position",w="padding",o="static",n="border",AB=r.style,l=AB.cssText,v="1px solid transparent",t="0",p="1px",j="offsetTop",k=g.style,AA=k.cssText,u=h.createElement("div"),m=u.style,y=h.createElement(P);AB[w]=AB[i]=AB.top=t;k.position=o;AB[n]=v;m.margin=t;m[q]=o;u=r.insertBefore(u,r.firstChild);T=(u[j]===1);AB[n]=t;y.innerHTML="<tbody><tr><td>x</td></tr></tbody>";y.style[n]="7px solid";y.cellSpacing=y.cellPadding=t;r.insertBefore(y,r.firstChild);S=y.getElementsByTagName("td")[0].offsetLeft===7;r.removeChild(y);AB[i]=p;AB[q]=c;E=(u[j]===1);V=r[j]===0;AB[i]=t;AB.top=p;e=u[j]===1;AB.top=t;AB[i]=p;AB[q]=m[q]=c;G=u[j]===0;m[q]="absolute";AB[q]=o;if(u.offsetParent===r){AB[n]=v;m.top="2px";O=u[j]===1;AB[n]=t;m[q]=c;k[w]=p;AB[i]=t;J=u[j]===3;AB[q]=c;A=u[j]===3;m[q]="absolute";N=u[j]===3;k[w]=t;k[i]=p;f=u[j]===3}r.removeChild(u);AB.cssText=l||"";k.cssText=AA||""}function L(j,i){var l=b(j).y,k=b(i).y;return l+j.offsetHeight<=k+i.offsetHeight&&l>=k}function F(j,i){return(b(j).y<=b(i).y)}function W(j,i){return(b(j).y+j.offsetHeight>=b(i).y+i.offsetHeight)}})();