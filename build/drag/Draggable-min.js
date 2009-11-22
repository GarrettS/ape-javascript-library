APE.namespace("APE.drag");
(function(){function ra(i,k){var l=document,n=l.getElementById(i),p;this.id=i;this.el=this.origEl=n;this.style=n.style;i=(this.isRel=x(n,"position").toLowerCase()=="relative")?n.parentNode:g.getContainingBlock(n);if(i===null)i=l.documentElement;this.container=i;this.dropTargets=[];this.handle=n;this.onbeforeexitcontainer=sa;if(k){for(p in k)this[p]=k[p];n.style.zIndex=A(x(n,"zIndex"),10)||Y++}}function sa(){return!this.keepInContainer}function ta(){var i,k,l;for(i in this.instances){l=this.instances[i];
for(k in l)delete l[k];delete this.instances[i]}m={}}function ua(){function i(){function a(h){var j=!c;if(f)this[Z].style[f]=j?"":"none";else(h||window.event||0).returnValue=j}var b="serSelect",d="MozU"+b,e="MozU"+b;b="u"+b;var f=d in B?d:e in B?e:b in B?b:"";d="onselectstart";d in q?C(q,d,a):N.addAfter(a)}function k(a,b){return b===a.handle||a.useHandleTree&&g.contains(a.handle,b)}function l(a,b){if(b){a.selectedClassName&&g.addClass(a.el,a.selectedClassName);if(a.dragMultiple&&!(a.id in m))m[a.id]=
a}else{a.selectedClassName&&g.removeClass(a.el,a.selectedClassName);delete m[a.id]}a.isSelected=b}function n(a){var b=a.container,d=a.el,e=document,f=e.documentElement;f=g.getContainingBlock(d)||f;var h=f===b?{x:0,y:0}:g.getOffsetCoords(f,b),j=g.getPixelCoords(d),t=g.getOffsetCoords(d,d.parentNode);f=t.x-j.x+h.x;h=t.y-j.y+h.y;if(a.keepInContainer){if(b===e.body){e=A(x(b,"width"),10);b=A(x(b,"height"),10)}else{e=b.clientWidth;b=b.clientHeight}a.minX=0-f;a.maxX=e-d.offsetWidth-f;a.minY=0-h;a.maxY=b-
d.offsetHeight-h}}function p(){r(l,[false],true);D=false}function va(a){$(c);var b,d,e;if(s!==false){d=0;for(e=s.length;d<e;d++){b=s[d];if(b.hasDropTargetOver){typeof b.ondragout==o&&b.ondragout(a,c);b.dragOverClassName&&g.removeClass(b.el,b.dragOverClassName);b.hasDropTargetOver=false}}}r($)}function O(a){a.activeDragClassName&&g.removeClass(a.el,a.activeDragClassName);wa(a);a.hasBeenDragged=false}function P(){if(c.hasBeenDragged)if(c.dragMultiple)m[c.id]=c;else m={};G=false;H.remove(document,I,
Q);c=null}function xa(a,b){if(b)a.id in m?l(a,false):l(a,true);else if(!a.isSelected){p();l(a,true)}}function aa(a){var b=a.el,d=a.copyEl;if(!d)d=a.copyEl=document.getElementById(a.proxyId);ba(a,d,b)}function ya(a){if(!a.copyEl){a.copyEl=a.el.cloneNode(true);a.copyEl.id+="Copy"}ba(a,a.copyEl,a.el)}function ba(a,b,d){var e=b.style;a.origEl=d;e.zIndex=A(d.style.zIndex,10)+100;a.el=b;a.style=e;var f=x(d,"display");e.display=f;if(a.dragCopy){d.parentNode.insertBefore(b,d);a.isRel&&za(e,d,f)}else Aa(a,
b,d)}function Aa(a,b,d){b=g.getOffsetCoords(d,b.parentNode);a.moveToX(b.x);a.moveToY(b.y)}function za(a,b,d){if(d=="inline")a.marginRight=-b.offsetWidth+-(A(x(b,"marginRight"),10)||0)+"px";else a.marginBottom=-b.offsetHeight+-(A(x(b,"marginBottom"),10)||0)+"px"}function J(a){var b=a.copyEl;if(b){a.el=a.origEl;a.style=a.el.style;a.moveToX(a.x);a.moveToY(a.y);b.style.display="none";a.dragCopy&&!a.proxyId&&a.el.parentNode.insertBefore(b,a.el)}}function y(a,b){!D||R||r(Ba,[a,b])}function Ba(a,b,d){typeof b==
"number"&&a.moveToX(a.origX+b);typeof d=="number"&&a.moveToY(a.origY+d)}function ca(a,b){if(!a.isBeingDragged){a.dragCopy&&!a.proxyId&&ya(a);typeof a.ondragstart==o&&a.ondragstart(da(a,b));a.activeDragClassName&&g.addClass(a.el,a.activeDragClassName);n(a);a.isBeingDragged=true}}function da(a,b){var d=a.id,e={},f=1;e[d]=a;if(D)for(d in m){e[d]=m[d];f++}return{domEvent:b,draggableList:e,count:f}}function Ca(a){if(K)K=false;else{var b=a||window.event;if(!(S&&c)){a=ea(a,"touches");var d=L.getTarget(b),
e=a.metaKey||a.ctrlKey,f=Da(d);if(f){if(!f.isDragEnabled){e||p();return false}if(!e&&f.hasHandleSet&&!k(f,d))p();else{!e&&!f.isSelected&&p();a.returnValue=false;if(e&&c&&!f.dragMultiple){G=true;return false}if(!f.dragMultiple)if(e){G=true;return false}else p();xa(f,e);f.style.zIndex=++Y;if(T(f,a)!=false){c=f;U(b);r(T,[a]);return d.tagName!=="IMG"}}}else if(!e){p();if(c){l(c,false);c=null}}}}}function Da(a){for(var b,d=V.instances;!b&&a!==null;a=g.findAncestorWithAttribute(a,"id"))b=d[a.id];return b}
function Ea(){if(c){var a=c.dropTargets,b,d,e,f;if(!a)return s=false;s=[];d=e=0;for(f=a.length;d<f;d++){b=a[d];b.initCoords();if(b.ondragover||b.ondragout||b.dragOverClassName)s[e++]=b}if(e===0)s=false}}function T(a,b){if(typeof a.onbeforedragstart==o&&a.onbeforedragstart(da(a,b))==false)return false;b=M(b);a.proxyId&&!a.dragCopy&&aa(a);Fa(a);fa=b.x;ga=b.y;b=g.getPixelCoords(a.el);a.origX=a.grabX=b.x;a.origY=a.grabY=b.y;a.isBeingDragged=false;C(document,I,Q)}function Fa(a){var b=a.constraint;if(b===
"y")a.moveToX=E;else if(b==="x")a.moveToY=E}function wa(a){delete a.moveToX;delete a.moveToY}function Q(a){if(c){var b=+new Date;if(!(b-ha<Ga)){ha=b;b=a=a||event;if(S){a=a.touches&&a.touches[0];if(!a)return;U(b)}var d=M(a);b=d.x;d=d.y;var e=b-fa,f=d-ga,h=c.origX+e,j=c.origY+f,t;if(c.isBeingDragged===false){R=!!c.proxyId;for(t in m){D=true;break}delete m[c.id];ca(c,a);c.proxyId&&c.dragCopy&&aa(c);r(ca,[a])}c.hasBeenDragged=c.hasBeenDragged||!!(e||f);t=h<c.minX;var v=h>c.maxX,u=j<c.minY,w=j>c.maxY,
ia=typeof c.ondrag===o;if(!(typeof c.onbeforedrag==o&&c.onbeforedrag(a)==false)){if(c.container!=null&&t||v||u||w&&c.onbeforeexitcontainer()!=true)Ha(t,v,u,w,h,j,e,f,ia,a);else{c.isAtLeft=c.isAtRight=c.isAtTop=c.isAtBottom=false;c.moveToX(h);c.moveToY(j);y(e,f);ia&&c.ondrag(a)}s!==false&&Ia(c,a,b,d);return false}}}}function Ja(a){K=false;H.remove(document,I,Q);if(c){var b=c.hasBeenDragged;b=c.isBeingDragged&&!b;a=ea(a,"changedTouches");if(!c.hasBeenDragged&&!b){if(!G){J(c);P(a)}}else{R||r(Ka);r(J);
J(c);La(a);r(O,[a]);m[c.id]=c;O(c,a);c.ondragend({domEvent:a,draggableList:m});c&&P(a)}}}function Ha(a,b,d,e,f,h,j,t,v,u){var w=0;if(a){if(!c.isAtLeft){c.moveToX(c.minX);y(c.minX-c.origX,null);v&&c.ondrag(u);c.isAtRight=false;c.isAtLeft=true}w+=1}else if(b){if(!c.isAtRight){c.moveToX(c.maxX);y(c.maxX-c.origX,null);v&&c.ondrag(u);c.isAtRight=true;c.isAtLeft=false}w+=1}else{c.isAtLeft=c.isAtRight=false;c.moveToX(f);y(j,null)}if(d){if(!c.isAtTop){c.moveToY(c.minY);y(null,c.minY-c.origY);v&&c.ondrag(u);
c.isAtTop=true;c.isAtBottom=false}w+=1}else if(e){if(!c.isAtBottom){c.maxY>0&&c.moveToY(c.maxY);y(null,c.maxY-c.origY);v&&c.ondrag(u);c.isAtTop=false;c.isAtBottom=true}w+=1}else{c.isAtTop=c.isAtBottom=false;c.moveToY(h);y(null,t)}if(w>=1)c.ondragstop(u);else v&&c.ondrag(u)}function Ka(a){var b=a.x,d=a.y;if(b<a.minX)a.moveToX(a.minX);else b>a.maxX&&a.moveToX(a.maxX);if(d<a.minY)a.moveToY(a.minY);else d>a.maxY&&a.moveToY(a.maxY)}function r(a,b,d){if(D||d){var e;b=b||[];b.unshift(0);for(e in m){d=b[0]=
m[e];a.apply(d,b)}}}function ja(a){if(c){a=a||event;if(a.keyCode==27||a.type==="touchcancel")c.release(a)}}function Ia(a,b,d,e){d={x:d,y:e};e=0;for(var f=s.length,h={domEvent:b,dragObj:a};e<f;e++){a=s[e];b=a.containsCoords(d);if(!a.hasDropTargetOver&&b){a.hasDropTargetOver=true;typeof a.ondragover==o&&a.ondragover(h);a.dragOverClassName&&g.addClass(a.el,a.dragOverClassName)}else if(a.hasDropTargetOver&&!b){typeof a.ondragout==o&&a.ondragout(h);a.dragOverClassName&&g.removeClass(a.el,a.dragOverClassName);
a.hasDropTargetOver=false}}}function La(a){var b=c.dropTargets,d,e,f=b.length,h,j;if(f){e=M(a);for(h=0;h<f;h++){d=b[h];if(typeof d.ondrop===o&&d.containsCoords(e)){d.ondrop(ka(a,c));r(Ma,[d,a])}(j=d.dragOverClassName)&&g.removeClass(d.el,j)}}}function ka(a,b){return{domEvent:a,dragObj:b}}function Ma(a,b,d){a.id!==b.id&&b.ondrop(ka(d,a))}function ea(a,b){return a&&a[b]&&a[b][0]||a||event}function Na(a){var b=z.anim,d=new b.Animation(0.2);d.transition=b.Transitions.accel;d.run=Oa;d.dObj=a;d.onplay=
a.onglide;d.onend=Pa;d.start()}function Oa(a){var b=this.dObj,d=b.x-b.grabX,e=b.y-b.grabY;a=Math.pow(a,3);b.moveToX(b.x-d*a);b.moveToY(b.y-e*a)}function Pa(){la(this.dObj)}function la(a){typeof a.onglideend==o&&a.onglideend();J(a)}function $(a){if(z.anim&&a.useAnim)Na(a);else{a.moveToX(a.grabX);a.moveToY(a.grabY);typeof a.onglide==o&&a.onglide();la(a,{})}}var q=document,H=z.EventPublisher,C=H.add,U=L.preventDefault,Z="documentElement",B=q[Z].style,W="px",ma="left",na="top",G=false,fa=0,ga=0,c,s=false,
D=false,R=false,Ga=25,ha=-1,oa="onmousedown",I="onmousemove",pa="onmouseup",S,N,M=L.getCoords;if("ontouchstart"in q){S=true;oa="ontouchstart";I="ontouchmove";pa="ontouchend";C(q,"ontouchcancel",ja)}N=H.get(q,oa);if("pixelLeft"in B){W=0;ma="pixelLeft";na="pixelTop"}C(q,"onkeydown",ja);C(q,pa,Ja);i(q,B);N.add(Ca).addAfter(Ea);q=B=null;return{dragCopy:false,useAnim:true,dragMultiple:false,selectedClassName:"",activeDragClassName:"",useHandleTree:true,isSelected:false,onbeforedrag:F,onbeforedragstart:E,
ondragstart:F,ondrag:F,ondragstop:E,ondragend:E,x:0,y:0,origX:0,origY:0,grabX:0,grabY:0,keepInContainer:false,isDragEnabled:true,hasHandleSet:false,setHandle:function(a,b){this.handle=a;this.hasHandleSet=true;this.useHandleTree=b!=false},dropTargets:false,addDropTarget:function(a){a=X.getByNode(a);var b=a.el,d=this.dropTargets;if(this.el===b)return a;return d[d.length]=X.getByNode(b)},grab:function(a,b,d){a=a||window.event;var e=L.getTarget(a);U(a);if(!g.contains(this.el,e)){e=g.getPixelCoords(this.el);
this.grabX=e.x;this.grabY=e.y;var f=M(a);e=this.handle;var h=g.getOffsetCoords(g.getContainingBlock(this.el)),j=f.x-h.x;j=j-(0|e.offsetWidth/2);f=f.y-h.y;f=f-(0|e.offsetHeight/2);e=g.getOffsetCoords(e,this.el);if(this.keepInContainer){j=Math.max(j,0);j=Math.min(j,this.container.clientWidth-this.el.offsetWidth);f=Math.max(f,0);f=Math.min(f,this.container.clientHeight-this.el.offsetHeight)}this.moveToX(j-e.x+(b||0));this.moveToY(f-e.y+(d||0));T(this,a);K=true;c=this}},release:function(a){a=a||{};r(O,
[a]);typeof this.onrelease==o&&this.onrelease(a);va(a);P(a)},moveToX:function(a){this.style[ma]=(this.x=a)+W},moveToY:function(a){this.style[na]=(this.y=a)+W},removeDropTarget:function(a){a=document.getElementById(a.id);var b=this.dropTargets,d,e;d=0;for(e=b.length;d<e;d++)if(b[d].el===a){b.splice(d,1);return a}return null},toString:function(){return"Draggable(id="+this.id+")"}}}function Qa(i){this.el=document.getElementById(i);this.id=i}function Ra(){return{dragOverClassName:"",initCoords:function(){var i=
this.coords||(this.coords={}),k=this.el;g.getOffsetCoords(k,document,i);i.w=k.clientWidth;i.h=k.clientHeight},containsCoords:function(i){var k=this.coords,l=k.x,n=k.y;return i.x>=l&&i.x<=l+k.w&&i.y>=n&&i.y<=n+k.h},ondragover:false,ondragout:F,ondrop:F}}var z=self.APE,g=z.dom,x=g.getStyle,qa=z.drag,L=g.Event,Y=1E3,m={},F,E=Function.prototype,A=self.parseInt,K,o="function",V=z.createFactory(ra,ua),X=z.createFactory(Qa,Ra);qa.Draggable=V;qa.DropTarget=X;V.instanceDestructor=ta})();
