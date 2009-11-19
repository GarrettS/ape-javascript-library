APE.namespace("APE.drag");
(function(){function V(e,h){var i=document,k=i.getElementById(e),o;this.id=e;this.el=this.origEl=k;this.style=k.style;e=(this.isRel=p(k,"position").toLowerCase()=="relative")?k.parentNode:j.getContainingBlock(k);if(e===null)e=i.documentElement;this.container=e;this.dropTargets=[];this.handle=k;this.onbeforeexitcontainer=W;if(h){for(o in h)this[o]=h[o];k.style.zIndex=B(p(k,"zIndex"),10)||C++}}function W(){return!this.keepInContainer}function I(){var e,h,i;for(e in this.instances){i=this.instances[e];
for(h in i)delete i[h];delete this.instances[e]}n={}}function P(){function e(){function a(l){var m=!c;if(g)this[ga].style[g]=m?"":"none";else(l||window.event||0).returnValue=m}var b="serSelect",d="MozU"+b,f="MozU"+b;b="u"+b;var g=d in L?d:f in L?f:b in L?b:"";d="onselectstart";d in v?M(v,d,a):X.addAfter(a)}function h(a,b){return b===a.handle||a.useHandleTree&&j.contains(a.handle,b)}function i(a,b){if(b){a.selectedClassName&&j.addClass(a.el,a.selectedClassName);if(a.dragMultiple&&!(a.id in n))n[a.id]=
a}else{a.selectedClassName&&j.removeClass(a.el,a.selectedClassName);delete n[a.id]}a.isSelected=b}function k(a){var b=a.container,d=a.el,f=document,g=f.documentElement;g=j.getContainingBlock(d)||g;var l=g===b?{x:0,y:0}:j.getOffsetCoords(g,b),m=j.getPixelCoords(d),z=j.getOffsetCoords(d,d.parentNode);g=z.x-m.x+l.x;l=z.y-m.y+l.y;if(a.keepInContainer){if(b===f.body){f=B(p(b,"width"),10);b=B(p(b,"height"),10)}else{f=b.clientWidth;b=b.clientHeight}a.minX=0-g;a.maxX=f-d.offsetWidth-g;a.minY=0-l;a.maxY=b-
d.offsetHeight-l}}function o(){w(i,[false],true);N=false}function Y(a){ha(c);var b,d,f;if(x!==false){d=0;for(f=x.length;d<f;d++){b=x[d];if(b.hasDropTargetOver){typeof b.ondragout==q&&b.ondragout(a,c);b.dragOverClassName&&j.removeClass(b.el,b.dragOverClassName);b.hasDropTargetOver=false}}}w(ha)}function Z(a){a.activeDragClassName&&j.removeClass(a.el,a.activeDragClassName);ya(a);a.hasBeenDragged=false}function $(){if(c.hasBeenDragged)if(c.dragMultiple)n[c.id]=c;else n={};Q=false;R.remove(document,S,
aa);c=null}function za(a,b){if(b)a.id in n?i(a,false):i(a,true);else if(!a.isSelected){o();i(a,true)}}function ia(a){var b=a.el,d=a.copyEl;if(!d)d=a.copyEl=document.getElementById(a.proxyId);ja(a,d,b)}function Aa(a){if(!a.copyEl){a.copyEl=a.el.cloneNode(true);a.copyEl.id+="Copy"}ja(a,a.copyEl,a.el)}function ja(a,b,d){var f=b.style;a.origEl=d;f.zIndex=B(d.style.zIndex,10)+100;a.origClassName&&j.addClass(d,a.origClassName);a.el=b;a.style=f;var g=p(d,"display");f.display=g;if(a.dragCopy){d.parentNode.insertBefore(b,
d);a.isRel&&Ba(f,d,g)}else Ca(a,b,d)}function Ca(a,b,d){b=j.getOffsetCoords(d,b.parentNode);a.moveToX(b.x);a.moveToY(b.y)}function Ba(a,b,d){if(d=="inline")a.marginRight=-b.offsetWidth+-(B(p(b,"marginRight"),10)||0)+"px";else a.marginBottom=-b.offsetHeight+-(B(p(b,"marginBottom"),10)||0)+"px"}function T(a){a.el=a.origEl;a.style=a.el.style;a.moveToX(a.x);a.moveToY(a.y);if(a.copyEl)a.copyEl.style.display="none";a.origClassName&&j.removeClass(a.el,a.origClassName);a.dragCopy&&!a.proxyId&&a.el.parentNode.insertBefore(a.copyEl,
a.el)}function J(a,b){!N||ba||w(Da,[a,b])}function Da(a,b,d){typeof b=="number"&&a.moveToX(a.origX+b);typeof d=="number"&&a.moveToY(a.origY+d)}function ka(a,b){if(!a.isBeingDragged){a.dragCopy&&!a.proxyId&&Aa(a);typeof a.ondragstart==q&&a.ondragstart(la(a,b));a.activeDragClassName&&j.addClass(a.el,a.activeDragClassName);k(a);a.isBeingDragged=true}}function la(a,b){var d=a.id,f={},g=1;f[d]=a;if(N)for(d in n){f[d]=n[d];g++}return{domEvent:b,draggableList:f,count:g}}function Ea(a){if(s)s=false;else{var b=
a||window.event;if(!(ca&&c)){a=ma(a,"touches");var d=r.getTarget(b),f=a.metaKey||a.ctrlKey,g=Fa(d);if(g){if(!g.isDragEnabled){f||o();return false}if(!f&&g.hasHandleSet&&!h(g,d))o();else{!f&&!g.isSelected&&o();a.returnValue=false;if(f&&c&&!g.dragMultiple){Q=true;return false}if(!g.dragMultiple)if(f){Q=true;return false}else o();za(g,f);g.style.zIndex=++C;if(da(g,a)!=false){c=g;ea(b);w(da,[a]);return d.tagName!=="IMG"}}}else if(!f){o();if(c){i(c,false);c=null}}}}}function Fa(a){for(var b,d=D.instances;!b&&
a!==null;a=j.findAncestorWithAttribute(a,"id"))b=d[a.id];return b}function Ga(){if(c){var a=c.dropTargets,b,d,f,g;if(!a)return x=false;x=[];d=f=0;for(g=a.length;d<g;d++){b=a[d];b.initCoords();if(b.ondragover||b.ondragout||b.dragOverClassName)x[f++]=b}if(f===0)x=false}}function da(a,b){if(typeof a.onbeforedragstart==q&&a.onbeforedragstart(la(a,b))==false)return false;b=U(b);a.proxyId&&!a.dragCopy&&ia(a);Ha(a);na=b.x;oa=b.y;b=j.getPixelCoords(a.el);a.origX=a.grabX=b.x;a.origY=a.grabY=b.y;a.isBeingDragged=
false;M(document,S,aa)}function Ha(a){var b=a.constraint;if(b==="y")a.moveToX=E;else if(b==="x")a.moveToY=E}function ya(a){delete a.moveToX;delete a.moveToY}function aa(a){if(c){var b=+new Date;if(!(b-pa<Ia)){pa=b;b=a=a||event;if(ca){a=a.touches&&a.touches[0];if(!a)return;ea(b)}var d=U(a);b=d.x;d=d.y;var f=b-na,g=d-oa,l=c.origX+f,m=c.origY+g,z;if(c.isBeingDragged===false){ba=!!c.proxyId;for(z in n){N=true;break}delete n[c.id];ka(c,a);c.proxyId&&c.dragCopy&&ia(c);w(ka,[a])}c.hasBeenDragged=c.hasBeenDragged||
!!(f||g);z=l<c.minX;var F=l>c.maxX,A=m<c.minY,G=m>c.maxY,qa=typeof c.ondrag===q;if(!(typeof c.onbeforedrag==q&&c.onbeforedrag(a)==false)){if(c.container!=null&&z||F||A||G&&c.onbeforeexitcontainer()!=true)Ja(z,F,A,G,l,m,f,g,qa,a);else{c.isAtLeft=c.isAtRight=c.isAtTop=c.isAtBottom=false;c.moveToX(l);c.moveToY(m);J(f,g);qa&&c.ondrag(a)}x!==false&&Ka(c,a,b,d);return false}}}}function La(a){s=false;R.remove(document,S,aa);if(c){var b=c.hasBeenDragged;b=c.isBeingDragged&&!b;a=ma(a,"changedTouches");if(!c.hasBeenDragged&&
!b){if(!Q){T(c);$(a)}}else{ba||w(Ma);w(T);T(c);Na(a);w(Z,[a]);n[c.id]=c;Z(c,a);c.ondragend({domEvent:a,draggableList:n});c&&$(a)}}}function Ja(a,b,d,f,g,l,m,z,F,A){var G=0;if(a){if(!c.isAtLeft){c.moveToX(c.minX);J(c.minX-c.origX,null);F&&c.ondrag(A);c.isAtRight=false;c.isAtLeft=true}G+=1}else if(b){if(!c.isAtRight){c.moveToX(c.maxX);J(c.maxX-c.origX,null);F&&c.ondrag(A);c.isAtRight=true;c.isAtLeft=false}G+=1}else{c.isAtLeft=c.isAtRight=false;c.moveToX(g);J(m,null)}if(d){if(!c.isAtTop){c.moveToY(c.minY);
J(null,c.minY-c.origY);F&&c.ondrag(A);c.isAtTop=true;c.isAtBottom=false}G+=1}else if(f){if(!c.isAtBottom){c.maxY>0&&c.moveToY(c.maxY);J(null,c.maxY-c.origY);F&&c.ondrag(A);c.isAtTop=false;c.isAtBottom=true}G+=1}else{c.isAtTop=c.isAtBottom=false;c.moveToY(l);J(null,z)}if(G>=1)c.ondragstop(A);else F&&c.ondrag(A)}function Ma(a){var b=a.x,d=a.y;if(b<a.minX)a.moveToX(a.minX);else b>a.maxX&&a.moveToX(a.maxX);if(d<a.minY)a.moveToY(a.minY);else d>a.maxY&&a.moveToY(a.maxY)}function w(a,b,d){if(N||d){var f;
b=b||[];b.unshift(0);for(f in n){d=b[0]=n[f];a.apply(d,b)}}}function ra(a){if(c){a=a||event;if(a.keyCode==27||a.type==="touchcancel")c.release(a)}}function Ka(a,b,d,f){d={x:d,y:f};f=0;for(var g=x.length,l={domEvent:b,dragObj:a};f<g;f++){a=x[f];b=a.containsCoords(d);if(!a.hasDropTargetOver&&b){a.hasDropTargetOver=true;typeof a.ondragover==q&&a.ondragover(l);a.dragOverClassName&&j.addClass(a.el,a.dragOverClassName)}else if(a.hasDropTargetOver&&!b){typeof a.ondragout==q&&a.ondragout(l);a.dragOverClassName&&
j.removeClass(a.el,a.dragOverClassName);a.hasDropTargetOver=false}}}function Na(a){var b=c.dropTargets,d,f,g=b.length,l,m;if(g){f=U(a);for(l=0;l<g;l++){d=b[l];if(typeof d.ondrop===q&&d.containsCoords(f)){d.ondrop(sa(a,c));w(Oa,[d,a])}(m=d.dragOverClassName)&&j.removeClass(d.el,m)}}}function sa(a,b){return{domEvent:a,dragObj:b}}function Oa(a,b,d){a.id!==b.id&&b.ondrop(sa(d,a))}function ma(a,b){return a&&a[b]&&a[b][0]||a||event}function Pa(a){var b=y.anim,d=new b.Animation(0.2);d.transition=b.Transitions.accel;
d.run=Qa;d.dObj=a;d.onplay=a.onglide;d.onend=Ra;d.start()}function Qa(a){var b=this.dObj,d=b.x-b.grabX,f=b.y-b.grabY;a=Math.pow(a,3);b.moveToX(b.x-d*a);b.moveToY(b.y-f*a)}function Ra(){ta(this.dObj)}function ta(a){typeof a.onglideend==q&&a.onglideend();T(a)}function ha(a){if(y.anim&&a.useAnim)Pa(a);else{a.moveToX(a.grabX);a.moveToY(a.grabY);typeof a.onglide==q&&a.onglide();ta(a,{})}}var v=document,R=y.EventPublisher,M=R.add,ea=r.preventDefault,ga="documentElement",L=v[ga].style,fa="px",ua="left",
va="top",Q=false,na=0,oa=0,c,x=false,N=false,ba=false,Ia=25,pa=-1,wa="onmousedown",S="onmousemove",xa="onmouseup",ca,X,U=r.getCoords;if("ontouchstart"in v){ca=true;wa="ontouchstart";S="ontouchmove";xa="ontouchend";M(v,"ontouchcancel",ra)}X=R.get(v,wa);if("pixelLeft"in L){fa=0;ua="pixelLeft";va="pixelTop"}M(v,"onkeydown",ra);M(v,xa,La);e(v,L);X.add(Ea).addAfter(Ga);v=L=null;return{dragCopy:false,useAnim:true,dragMultiple:false,selectedClassName:"",activeDragClassName:"",useHandleTree:true,isSelected:false,
onbeforedrag:t,onbeforedragstart:E,ondragstart:t,ondrag:t,ondragstop:E,ondragend:E,x:0,y:0,origX:0,origY:0,grabX:0,grabY:0,keepInContainer:false,isDragEnabled:true,hasHandleSet:false,setHandle:function(a,b){this.handle=a;this.hasHandleSet=true;this.useHandleTree=b!=false},dropTargets:false,addDropTarget:function(a){a=H.getByNode(a);var b=a.el,d=this.dropTargets;if(this.el===b)return a;return d[d.length]=H.getByNode(b)},grab:function(a,b,d){a=a||window.event;var f=r.getTarget(a);ea(a);if(!j.contains(this.el,
f)){f=j.getPixelCoords(this.el);this.grabX=f.x;this.grabY=f.y;var g=U(a);f=this.handle;var l=j.getOffsetCoords(j.getContainingBlock(this.el)),m=g.x-l.x;m=m-(0|f.offsetWidth/2);g=g.y-l.y;g=g-(0|f.offsetHeight/2);f=j.getOffsetCoords(f,this.el);if(this.keepInContainer){m=Math.max(m,0);m=Math.min(m,this.container.clientWidth-this.el.offsetWidth);g=Math.max(g,0);g=Math.min(g,this.container.clientHeight-this.el.offsetHeight)}this.moveToX(m-f.x+(b||0));this.moveToY(g-f.y+(d||0));da(this,a);s=true;c=this}},
release:function(a){a=a||{};w(Z,[a]);typeof this.onrelease==q&&this.onrelease(a);Y(a);$(a)},moveToX:function(a){this.style[ua]=(this.x=a)+fa},moveToY:function(a){this.style[va]=(this.y=a)+fa},removeDropTarget:function(a){a=document.getElementById(a.id);var b=this.dropTargets,d,f;d=0;for(f=b.length;d<f;d++)if(b[d].el===a){b.splice(d,1);return a}return null},toString:function(){return"Draggable(id="+this.id+")"}}}function K(e){this.el=document.getElementById(e);this.id=e}function O(){return{dragOverClassName:"",
initCoords:function(){var e=this.coords||(this.coords={}),h=this.el;j.getOffsetCoords(h,document,e);e.w=h.clientWidth;e.h=h.clientHeight},containsCoords:function(e){var h=this.coords,i=h.x,k=h.y;return e.x>=i&&e.x<=i+h.w&&e.y>=k&&e.y<=k+h.h},ondragover:false,ondragout:t,ondrop:t}}var y=self.APE,j=y.dom,p=j.getStyle,u=y.drag,r=j.Event,C=1E3,n={},t,E=Function.prototype,B=self.parseInt,s,q="function",D=y.createFactory(V,P),H=y.createFactory(K,O);u.Draggable=D;u.DropTarget=H;D.instanceDestructor=I})();
(function(){function V(r,C,n,t){this.id=r;this.dir=C;this.rationalValue=this.value=0;r=P.Draggable.getById(r,C);r.keepInContainer=true;this.handle=r;this[p]=n||0;this[u]=t;this.tDist=0;this.init()}function W(){var r;function C(){}function n(e){var h=K.Event.getTarget(e);if(h!==this)return true;h=O.instances[this.getElementsByTagName("*")[0].id];e=e||self.event;e.preventDefault&&e.preventDefault();K.addClass(this,D);h.handle.grab(e);s.call(h,e);return false}function t(e){K.removeClass(this.trackbar,
D);s.call(this,e);typeof this.onslideend==="function"&&this.onslideend(e)}function E(){H=this;K.addClass(this.trackbar,D)}function B(){if(H===this)H=null;K.removeClass(this.trackbar,D)}function s(e){this.value=0;var h=document.getElementById(this.id),i=0;if(this.dir===y)i=h.offsetLeft>0?h.offsetLeft/this.tDist:0;else if(h.offsetTop>0){h=this.tDist-h.offsetTop;i=h/this.tDist}else i=1;this.rationalValue=i;this.value=i*(this[u]-this[p]);if(this.onslide)this.onslide(e||{})}function q(e){e=e||self.event;
e.stopPropagation&&e.stopPropagation();e.cancelBubble=true;var h=+new Date,i=H;if(i)if(!(h-r<5)){r=h;var k=e.keyCode,o;h=k===37;o=k===39;var Y=k===38;k=k===40;if(!(h||o||Y||k))return true;if(i.id in O.instances){o=i[u]/i.ticks;if(h||k)o=-o;i.setValue(i.value+o);i.onslide&&i.onslide(e);return false}}}I.EventPublisher.add(document,"onkeydown",q);var D="ape-slider-track-active",H=null;return{init:function(){var e=I.EventPublisher,h=document.getElementById(this.id),i=this.handle,k=this.trackbar=document.getElementById(this.id).parentNode;
e.add(i,"onglideend",t,this);e.add(i,"ondragend",t,this);e.add(i,"onglideend",t,this);e.add(i,"ondrag",s,this);"focus"in i||e.add(h,"onmousedown",E,this);e.add(h,"onfocus",E,this);e.add(h,"onblur",B,this);e.add(i,"onglide",s,this);e.add(i,"ondragstop",s,this);if(this.dir===j){this.tDist=k.clientHeight-h.offsetHeight;i.moveToX=C}else{this.tDist=k.clientWidth-h.offsetWidth;i.moveToY=C}if(this[u]===undefined)this[u]=this.tDist;e.add(k,"onmousedown",n,k)},ticks:15,rationalValue:0,slideToX:function(e){this.handle.moveToX(e);
typeof slider.onslide==="function"&&slider.onslide()},setValue:function(e){e=Math.max(this[p],e);e=Math.min(this[u],e);var h=this.handle,i=this[u]-this[p];i=(e-this[p])/i;if(h&&h.id){this.dir===j?h.moveToY(this.tDist*(1-i)):h.moveToX(this.tDist*i);this.rationalValue=i;this.value=e}},slideToY:function(e){this.handle.moveToY(e);this.onslide()},setRationalValue:function(e,h){e=Math.max(0,e);this.rationalValue=e=Math.min(1,e);this.setValue(this[p]+e*(this[u]-this[p]));h&&s.call(this,{})},toString:function(){return"Slider: "+
this.handle.toString()}}}var I=self.APE,P=I.drag,K=I.dom,O=P.Slider=I.createFactory(V,W),y=1,j=2,p="minValue",u="maxValue";O.direction={HORZ:y,VERT:j}})();
