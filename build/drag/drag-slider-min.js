APE.namespace("APE.drag").defineFactory("Draggable",function(AT){var AD=self.APE,W=AD.dom,AL=W.getStyle,AN=AD.drag,m=W.Event,L=1000,AK={},AO,AR=Function.prototype,Ac=self.parseInt,AF,AJ="function",AP=AN.defineFactory("DropTarget",f);AT.instanceDestructor=Q;function AX(Ao,Aj){var Am=document,Ak=Am.getElementById(Ao),An,Al;this.id=Ao;this.el=this.origEl=Ak;this.style=Ak.style;this.isRel=AL(Ak,"position").toLowerCase()=="relative";An=(this.isRel?Ak.parentNode:W.getContainingBlock(Ak));if(An===null){An=Am.documentElement}this.container=An;this.dropTargets=[];this.handle=Ak;this.onbeforeexitcontainer=AS;if(Aj){for(Al in Aj){this[Al]=Aj[Al]}Ak.style.zIndex=Ac(AL(Ak,"zIndex"),10)||L++}}function AS(){return !this.keepInContainer}function Q(){var d,Ak,Aj;for(d in this.instances){Aj=this.instances[d];for(Ak in Aj){delete Aj[Ak]}delete this.instances[d]}AK={}}var o=document,Ad=AD.EventPublisher,g=Ad.add,U=m.preventDefault,Ab="documentElement",O=o[Ab].style,AA="px",I="left",AV="top",C=false,q="setCapture" in document.documentElement,v=0,t=0,e,AC=false,AY=false,Ae=false,R=25,B=-1,T="onmousedown",w="onmousemove",j="onmouseup",J,h,Aa=m.getCoords;if("ontouchstart" in o){J=true;T="ontouchstart";w="ontouchmove";j="ontouchend";g(o,"ontouchcancel",M)}h=Ad.get(o,T);if("pixelLeft" in O){AA=0;I="pixelLeft";AV="pixelTop"}g(o,"onkeydown",M);g(o,j,V);X(o,O);h.add(Y).addAfter(s);o=O=null;function X(Ap,Ao){var Am="serSelect",Aq="MozU"+Am,An="MozU"+Am,Aj="u"+Am,Al=Aq in O?Aq:An in O?An:Aj in O?Aj:"",d="onselectstart";if(d in o){g(o,d,Ak)}else{h.addAfter(Ak)}function Ak(As){var Ar=!e;if(Al){this[Ab].style[Al]=Ar?"":"none"}else{(As||window.event||0).returnValue=Ar}}}function r(d,Aj){return Aj===d.handle||(d.useHandleTree&&W.contains(d.handle,Aj))}function AW(d,Aj){if(Aj){if(d.selectedClassName){W.addClass(d.el,d.selectedClassName)}if(d.dragMultiple&&!(d.id in AK)){AK[d.id]=d}}else{if(d.selectedClassName){W.removeClass(d.el,d.selectedClassName)}delete AK[d.id]}d.isSelected=Aj}function AU(Ap){var Aj=Ap.container,Am=Ap.el,Aq=document,Al=Aq.documentElement,Ao=W.getContainingBlock(Am)||Al,An,Ar,Au=(Ao===Aj)?{x:0,y:0}:W.getOffsetCoords(Ao,Aj),Ak=W.getPixelCoords(Am),Av=W.getOffsetCoords(Am,Am.parentNode),At=Av.x-Ak.x+Au.x,As=Av.y-Ak.y+Au.y;if(Ap.keepInContainer){if(Aj===Aq.body){An=Ac(AL(Aj,"width"),10);Ar=Ac(AL(Aj,"height"),10)}else{An=Aj.clientWidth;Ar=Aj.clientHeight}Ap.minX=0-At;Ap.maxX=An-Am.offsetWidth-At;Ap.minY=0-As;Ap.maxY=Ar-Am.offsetHeight-As}}function AE(){n(AW,[false],true);AY=false}function k(Al){b(e);var Ak,Aj,d;if(AC!==false){for(Aj=0,d=AC.length;Aj<d;Aj++){Ak=AC[Aj];if(Ak.hasDropTargetOver){if(typeof Ak.ondragout==AJ){Ak.ondragout(Al,e)}if(Ak.dragOverClassName){W.removeClass(Ak.el,Ak.dragOverClassName)}Ak.hasDropTargetOver=false}}}n(b)}function Af(d,Aj){if(d.activeDragClassName){W.removeClass(d.el,d.activeDragClassName)}Ag(d);if(q){d.el.releaseCapture()}d.hasBeenDragged=false}function AB(d){if(e.dragMultiple){AK[e.id]=e}else{AK={}}C=false;Ad.remove(document,w,AM);e=null}function A(d,Aj){if(Aj){if(d.id in AK){AW(d,false)}else{AW(d,true)}}else{if(!d.isSelected){AE();AW(d,true)}}}function K(d){var Aj=d.el,Ak=d.copyEl;if(!Ak){Ak=d.copyEl=document.getElementById(d.proxyId)}a(d,Ak,Aj)}function N(d){if(!d.copyEl){d.copyEl=d.el.cloneNode(true);d.copyEl.id+="Copy"}a(d,d.copyEl,d.el)}function a(Aj,Am,Al){var d=Am.style;Aj.origEl=Al;d.zIndex=Ac(Al.style.zIndex,10)+100;Aj.el=Am;Aj.style=d;var Ak=AL(Al,"display");d.display=Ak;if(Aj.dragCopy){Al.parentNode.insertBefore(Am,Al);if(Aj.isRel){Ah(d,Al,Ak)}}else{Z(Aj,Am,Al)}}function Z(d,Al,Ak){var Aj=W.getOffsetCoords(Ak,Al.parentNode);d.moveToX(Aj.x);d.moveToY(Aj.y)}function Ah(d,Ak,Aj){if(Aj=="inline"){d.marginRight=-Ak.offsetWidth+-(Ac(AL(Ak,"marginRight"),10)||0)+"px"}else{d.marginBottom=-Ak.offsetHeight+-(Ac(AL(Ak,"marginBottom"),10)||0)+"px"}}function y(d){var Aj=d.copyEl;if(!Aj){return}d.el=d.origEl;d.style=d.el.style;d.moveToX(d.x);d.moveToY(d.y);Aj.style.display="none";if(d.dragCopy&&!d.proxyId){d.el.parentNode.insertBefore(Aj,d.el)}}function F(Aj,d){if(!AY||Ae){return}n(AI,[Aj,d])}function AI(Ak,Aj,d){if(typeof Aj=="number"){Ak.moveToX(Ak.origX+Aj)}if(typeof d=="number"){Ak.moveToY(Ak.origY+d)}}function G(d,Aj){if(d.isBeingDragged){return}if(d.dragCopy&&!d.proxyId){N(d)}if(typeof d.ondragstart==AJ){d.ondragstart(D(d,Aj))}if(q){d.el.setCapture()}if(d.activeDragClassName){W.addClass(d.el,d.activeDragClassName)}AU(d);d.isBeingDragged=true}function D(d,Al){var Am=d.id,Ak={},Aj=1;Ak[Am]=d;if(AY){for(Am in AK){Ak[Am]=AK[Am];Aj++}}return{domEvent:Al,draggableList:Ak,count:Aj}}function Y(Al){if(AF){AF=false;return}var d=Al||window.event;if(J&&e){return}Al=H(Al,"touches");var Ak=m.getTarget(d),Am=Al.metaKey||Al.ctrlKey,Aj=x(Ak);if(Aj){if(!Aj.isDragEnabled){if(!Am){AE()}return false}if(!Am&&Aj.hasHandleSet&&!r(Aj,Ak)){AE();Aj=null;return}else{if(!Am&&!Aj.isSelected){AE()}Al.returnValue=false}}else{if(!Am){AE();if(e){AW(e,false);e=null}}return}if(Am&&e&&!Aj.dragMultiple){C=true;return false}if(!Aj.dragMultiple){if(!Am){AE()}else{C=true;return false}}A(Aj,Am);Aj.style.zIndex=++L;if(AZ(Aj,Al)==false){return}e=Aj;U(d);n(AZ,[Al]);return Ak.tagName!=="IMG"}function x(Aj){var d,Ak=AT.instances;if(!Ak){return}for(;!d&&Aj!==null;Aj=W.findAncestorWithAttribute(Aj,"id")){d=Ak[Aj.id]}return d}function s(){if(!e){return}var Al=e.dropTargets,Ak,Aj,Am,d;if(!Al){return AC=false}AC=[];for(Aj=Am=0,d=Al.length;Aj<d;Aj++){Ak=Al[Aj];Ak.initCoords();if(Ak.ondragover||Ak.ondragout||Ak.dragOverClassName){AC[Am++]=Ak}}if(Am===0){AC=false}}function AZ(d,Al){if(typeof d.onbeforedragstart==AJ&&d.onbeforedragstart(D(d,Al))==false){return false}var Ak=Aa(Al),Aj;if(d.proxyId&&!d.dragCopy){K(d)}i(d);v=Ak.x;t=Ak.y;Aj=W.getPixelCoords(d.el);d.origX=d.grabX=Aj.x;d.origY=d.grabY=Aj.y;d.isBeingDragged=false;g(document,w,AM)}function i(d){var Aj=d.constraint;if(Aj==="y"){d.moveToX=AR}else{if(Aj==="x"){d.moveToY=AR}}}function Ag(d){delete d.moveToX;delete d.moveToY}function AM(Ao){if(!e){return}var Al=+new Date,As;if(Al-B<R){return}B=Al;As=Ao=Ao||event;if(J){Ao=Ao.touches&&Ao.touches[0];if(!Ao){return}U(As)}var Aq=Aa(Ao),Am=Aq.x,Ak=Aq.y,Ar=Am-v,Ap=Ak-t,d=e.origX+Ar,At=e.origY+Ap,Aj;if(e.isBeingDragged===false){Ae=!!e.proxyId;for(Aj in AK){AY=true;break}delete AK[e.id];G(e,Ao);if(e.proxyId&&e.dragCopy){K(e)}n(G,[Ao])}e.hasBeenDragged=(e.hasBeenDragged||!!(Ar||Ap));if(typeof e.onbeforedrag==AJ&&e.onbeforedrag(Ao)==false){return}var An=typeof e.ondrag===AJ;if(!P(d,At,Ar,Ap)){e.isAtLeft=e.isAtRight=e.isAtTop=e.isAtBottom=false;e.moveToX(d);e.moveToY(At);F(Ar,Ap);if(An){e.ondrag(Ao)}}if(AC!==false){p(e,Ao,Am,Ak)}return false}function P(d,Au,Aq,Ao){if(e.container){var At=d<e.minX,As=d>e.maxX,Am=Au<e.minY,Ar=Au>e.maxY,Aj=e.constraint,Ap=Aj=="x",An=Aj=="y",Al=!Ap,Ak=!An;if(At||As||Am||Ar&&e.onbeforeexitcontainer()!=true){if(!An){Al=AH(d,Aq,At,As)}if(!Ap){Ak=AG(Au,Ao,Am,Ar)}if(Al||Ak){if(e.ondrag){e.ondrag()}}else{e.ondragstop()}return true}}return false}function AH(Am,d,Al,Aj){if(e.x===Am){return false}var Ak;if(Al){if(!e.isAtLeft){e.moveToX(e.minX);F(e.minX-e.origX,null);e.isAtRight=false;e.isAtLeft=true}else{Ak=true}}else{if(Aj){if(!e.isAtRight){e.moveToX(e.maxX);F(e.maxX-e.origX,null);e.isAtRight=true;e.isAtLeft=false}else{Ak=true}}else{e.isAtLeft=e.isAtRight=false;e.moveToX(Am);F(d,null)}}return !Ak}function AG(Am,d,Ak,Aj,An){if(e.y===Am){return false}var Al;if(Ak){if(!e.isAtTop){e.moveToY(e.minY);F(null,e.minY-e.origY);e.isAtTop=true;e.isAtBottom=false}else{Al=true}}else{if(Aj){if(!e.isAtBottom){if(e.maxY>0){e.moveToY(e.maxY)}F(null,e.maxY-e.origY);e.isAtTop=false;e.isAtBottom=true}else{Al=true}}else{e.isAtTop=e.isAtBottom=false;e.moveToY(Am);F(null,d)}}return !Al}function V(Aj){AF=false;Ad.remove(document,w,AM);if(!e){return}var d=e.hasBeenDragged,Ak=(e.isBeingDragged&&!d);Aj=H(Aj,"changedTouches");if(!e.hasBeenDragged&&!Ak){if(!C){y(e);AB(Aj)}return}if(!Ae){n(z)}n(y);y(e);Ai(Aj);n(Af,[Aj]);AK[e.id]=e;Af(e,Aj);e.ondragend({domEvent:Aj,draggableList:AK});if(e){AB(Aj)}}function z(Aj){var d=Aj.x,Ak=Aj.y;if(d<Aj.minX){Aj.moveToX(Aj.minX)}else{if(d>Aj.maxX){Aj.moveToX(Aj.maxX)}}if(Ak<Aj.minY){Aj.moveToY(Aj.minY)}else{if(Ak>Aj.maxY){Aj.moveToY(Aj.maxY)}}}function n(Al,Aj,Ak){if(!AY&&!Ak){return}var Am,d;Aj=Aj||[];Aj.unshift(0);for(Am in AK){d=Aj[0]=AK[Am];Al.apply(d,Aj)}}function M(d){if(!e){return}d=d||event;if(d.keyCode==27||d.type==="touchcancel"){e.release(d)}}function p(Aq,Ao,Ak,d){var Ar={x:Ak,y:d},An=0,Am=AC.length,Aj,Al,Ap={domEvent:Ao,dragObj:Aq};for(;An<Am;An++){Aj=AC[An];Al=Aj.containsCoords(Ar);if(!Aj.hasDropTargetOver&&Al){Aj.hasDropTargetOver=true;if(typeof Aj.ondragover==AJ){Aj.ondragover(Ap)}if(Aj.dragOverClassName){W.addClass(Aj.el,Aj.dragOverClassName)}}else{if(Aj.hasDropTargetOver&&!Al){if(typeof Aj.ondragout==AJ){Aj.ondragout(Ap)}if(Aj.dragOverClassName){W.removeClass(Aj.el,Aj.dragOverClassName)}Aj.hasDropTargetOver=false}}}}function Ai(Al){var Aj=e.dropTargets,Ao,Am,d=Aj.length,Ak,An;if(d){Am=Aa(Al);for(Ak=0;Ak<d;Ak++){Ao=Aj[Ak];if(typeof Ao.ondrop===AJ&&Ao.containsCoords(Am)){Ao.ondrop(E(Al,e));n(AQ,[Ao,Al])}An=Ao.dragOverClassName;if(An){W.removeClass(Ao.el,An)}}}}function E(Aj,d){return{domEvent:Aj,dragObj:d}}function AQ(d,Ak,Aj){if(d.id!==Ak.id){Ak.ondrop(E(Aj,d))}}function H(Aj,d){return Aj&&Aj[d]&&Aj[d][0]||Aj||event}function S(Aj){var Ak=AD.anim,d=new Ak.Animation(0.2);d.transition=Ak.Transitions.accel;d.run=c;d.dObj=Aj;d.onplay=Aj.onglide;d.onend=u;d.start()}function c(Al){var Aj=this.dObj,Ak=Aj.x-Aj.grabX,d=Aj.y-Aj.grabY;Al=Math.pow(Al,3);Aj.moveToX(Aj.x-(Ak*Al));Aj.moveToY(Aj.y-(d*Al))}function u(){l(this.dObj)}function l(d){if(typeof d.onglideend==AJ){d.onglideend()}y(d)}function b(d){if(AD.anim&&d.useAnim){S(d)}else{d.moveToX(d.grabX);d.moveToY(d.grabY);if(typeof d.onglide==AJ){d.onglide()}l(d,{})}}AX.prototype={dragCopy:false,useAnim:true,dragMultiple:false,selectedClassName:"",activeDragClassName:"",useHandleTree:true,isSelected:false,onbeforedrag:AO,onbeforedragstart:AR,ondragstart:AO,ondrag:AO,ondragstop:AR,ondragend:AR,x:0,y:0,origX:0,origY:0,grabX:0,grabY:0,keepInContainer:false,isDragEnabled:true,hasHandleSet:false,setHandle:function(d,Aj){this.handle=d;this.hasHandleSet=true;this.useHandleTree=Aj!=false},dropTargets:false,addDropTarget:function(Al){var Aj=AP.getByNode(Al),d=Aj.el,Ak=this.dropTargets;if(this.el===d){return Aj}return Ak[Ak.length]=AP.getByNode(d)},grab:function(Ap,Ar,Al){Ap=Ap||window.event;var Aq=m.getTarget(Ap),Ak;U(Ap);if(W.contains(this.el,Aq)){return}Ak=W.getPixelCoords(this.el);this.grabX=Ak.x;this.grabY=Ak.y;var As=Aa(Ap),Ao=this.handle,Aj=W.getOffsetCoords(W.getContainingBlock(this.el)),An=As.x-Aj.x,d=An-(0|Ao.offsetWidth/2),Am=As.y-Aj.y,Au=(Am-(0|Ao.offsetHeight/2)),At=W.getOffsetCoords(Ao,this.el);if(this.keepInContainer){d=Math.max(d,0);d=Math.min(d,this.container.clientWidth-this.el.offsetWidth);Au=Math.max(Au,0);Au=Math.min(Au,this.container.clientHeight-this.el.offsetHeight)}this.moveToX(d-At.x+(Ar||0));this.moveToY(Au-At.y+(Al||0));AZ(this,Ap);AF=true;e=this},release:function(d){d=d||{};n(Af,[d]);if(typeof this.onrelease==AJ){this.onrelease(d)}k(d);AB(d)},moveToX:function(d){this.style[I]=(this.x=d)+AA},moveToY:function(d){this.style[AV]=(this.y=d)+AA},removeDropTarget:function(Al){Al=document.getElementById(Al.id);var Aj=this.dropTargets,Ak,d;for(Ak=0,d=Aj.length;Ak<d;Ak++){if(Aj[Ak].el===Al){Aj.splice(Ak,1);return Al}}return null},toString:function(){return"Draggable(id="+this.id+")"}};function f(){function d(Aj){this.el=document.getElementById(Aj);this.id=Aj}d.prototype={dragOverClassName:"",initCoords:function(){var Ak=this.coords||(this.coords={}),Aj=this.el;W.getOffsetCoords(Aj,document,Ak);Ak.w=Aj.clientWidth;Ak.h=Aj.clientHeight},containsCoords:function(Ak){var Aj=this.coords,Am=Aj.x,Al=Aj.y;return(Ak.x>=Am&&Ak.x<=Am+Aj.w)&&(Ak.y>=Al&&Ak.y<=Al+Aj.h)},ondragover:false,ondragout:AO,ondrop:AO};return d}return AX});APE.namespace("APE.drag").defineFactory("Slider",function(K){var M=self.APE,Q=M.drag,R=M.dom,I="x",D="y",A="minValue",N=Function.prototype,J="maxValue";function S(V,U){this.id=V;this.dir=U.dir;this.value=0;this.rationalValue=0;this.handle=Q.Draggable.getById(V,{constraint:this.dir});this.handle.keepInContainer=true;this[A]=U[A]||0;this[J]=U[J];this.tDist=0;this.init()}M.EventPublisher.add(document,"onkeydown",F);var T="ape-slider-track-active",P=null;S.prototype={init:function(){var X=M.EventPublisher.add,V=document.getElementById(this.id),W=this.handle,U=this.trackbar=document.getElementById(this.id).parentNode;X(W,"onglideend",O,this);X(W,"ondragend",O,this);X(W,"onglideend",O,this);X(W,"ondrag",H,this);if(!("focus" in W)){X(V,"onmousedown",B,this)}X(V,"onfocus",B,this);X(V,"onblur",L,this);X(W,"onglide",H,this);X(W,"ondragstop",H,this);if(this.dir===D){this.tDist=U.clientHeight-V.offsetHeight;W.moveToX=N}else{this.tDist=U.clientWidth-V.offsetWidth;W.moveToY=N}if(this[J]===undefined){this[J]=this.tDist}X(U,"onmousedown",E,U)},ticks:15,rationalValue:0,slideToX:function(U){this.handle.moveToX(U);if(typeof slider.onslide==="function"){slider.onslide()}},setValue:function(U){U=Math.max(this[A],U);U=Math.min(this[J],U);var V=this.handle,X=this[J]-this[A],W=(U-this[A])/X;if(!V||!V.id){return}if(this.dir===D){V.moveToY(this.tDist*(1-W))}else{V.moveToX(this.tDist*W)}this.rationalValue=W;this.value=U},slideToY:function(U){this.handle.moveToY(U);this.onslide()},setRationalValue:function(V,U){V=Math.max(0,V);V=Math.min(1,V);this.rationalValue=V;this.setValue(this[A]+(V*(this[J]-this[A])));if(U){H.call(this,{})}},toString:function(){return"Slider: "+this.handle.toString()}};function E(W){W=W||window.event;var V=R.Event.getTarget(W),U;U=K.instances[this.getElementsByTagName("*")[0].id];C(U.id);if(V!==this){return true}if(W.preventDefault){W.preventDefault()}R.addClass(this,T);U.handle.grab(W);H.call(U,W);return false}function C(U){var V=document.getElementById(U);if(P&&P.blur){P.blur()}if(V.focus){V.focus()}}function O(U){R.removeClass(this.trackbar,T);H.call(this,U);if(typeof this.onslideend==="function"){this.onslideend(U)}}function B(U){P=this;R.addClass(this.trackbar,T)}function L(U){if(P===this){P=null}R.removeClass(this.trackbar,T)}function H(X){this.value=0;var V=document.getElementById(this.id),W=0;if(this.dir===I){if(V.offsetLeft>0){W=V.offsetLeft/this.tDist}else{W=0}}else{if(V.offsetTop>0){var U=this.tDist-V.offsetTop;W=U/this.tDist}else{W=1}}this.rationalValue=W;this.value=W*(this[J]-this[A]);if(this.onslide){this.onslide(X||{})}}var G;function F(Y){Y=Y||self.event;if(Y.stopPropagation){Y.stopPropagation()}Y.cancelBubble=true;var W=+new Date,U=P;if(!U){return}if(W-G<5){return}G=W;var b=Y.keyCode,a,V=b===37,Z=b===39,c=b===38,X=b===40;if(!(V||Z||c||X)){return true}if(U.id in K.instances){a=U[J]/U.ticks;if(V||X){a=-a}U.setValue(U.value+a);if(U.onslide){U.onslide(Y)}return false}}return S});