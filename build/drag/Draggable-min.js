APE.namespace("APE.drag").defineFactory("Draggable",function(AS){var AC=self.APE,W=AC.dom,AK=W.getStyle,AM=AC.drag,AO=AM.DropTarget,l=W.Event,L=1000,AJ={},AN,AQ=Function.prototype,Ab=self.parseInt,AE,AI="function";AS.instanceDestructor=Q;function AW(An,Ai){var Al=document,Aj=Al.getElementById(An),Am,Ak;this.id=An;this.el=this.origEl=Aj;this.style=Aj.style;this.isRel=AK(Aj,"position").toLowerCase()=="relative";Am=(this.isRel?Aj.parentNode:W.getContainingBlock(Aj));if(Am===null){Am=Al.documentElement}this.container=Am;this.dropTargets=[];this.handle=Aj;this.onbeforeexitcontainer=AR;if(Ai){for(Ak in Ai){this[Ak]=Ai[Ak]}Aj.style.zIndex=Ab(AK(Aj,"zIndex"),10)||L++}}function AR(){return !this.keepInContainer}function Q(){var d,Aj,Ai;for(d in this.instances){Ai=this.instances[d];for(Aj in Ai){delete Ai[Aj]}delete this.instances[d]}AJ={}}var n=document,Ac=AC.EventPublisher,f=Ac.add,U=l.preventDefault,Aa="documentElement",O=n[Aa].style,z="px",I="left",AU="top",C=false,p="setCapture" in document.documentElement,u=0,s=0,e,AB=false,AX=false,Ad=false,R=25,B=-1,T="onmousedown",v="onmousemove",i="onmouseup",J,g,AZ=l.getCoords;if("ontouchstart" in n){J=true;T="ontouchstart";v="ontouchmove";i="ontouchend";f(n,"ontouchcancel",M)}g=Ac.get(n,T);if("pixelLeft" in O){z=0;I="pixelLeft";AU="pixelTop"}f(n,"onkeydown",M);f(n,i,V);X(n,O);g.add(Y).addAfter(r);n=O=null;function X(Ao,An){var Al="serSelect",Ap="MozU"+Al,Am="MozU"+Al,Ai="u"+Al,Ak=Ap in O?Ap:Am in O?Am:Ai in O?Ai:"",d="onselectstart";if(d in n){f(n,d,Aj)}else{g.addAfter(Aj)}function Aj(Ar){var Aq=!e;if(Ak){this[Aa].style[Ak]=Aq?"":"none"}else{(Ar||window.event||0).returnValue=Aq}}}function q(d,Ai){return Ai===d.handle||(d.useHandleTree&&W.contains(d.handle,Ai))}function AV(d,Ai){if(Ai){if(d.selectedClassName){W.addClass(d.el,d.selectedClassName)}if(d.dragMultiple&&!(d.id in AJ)){AJ[d.id]=d}}else{if(d.selectedClassName){W.removeClass(d.el,d.selectedClassName)}delete AJ[d.id]}d.isSelected=Ai}function AT(Ao){var Ai=Ao.container,Al=Ao.el,Ap=document,Ak=Ap.documentElement,An=W.getContainingBlock(Al)||Ak,Am,Aq,At=(An===Ai)?{x:0,y:0}:W.getOffsetCoords(An,Ai),Aj=W.getPixelCoords(Al),Au=W.getOffsetCoords(Al,Al.parentNode),As=Au.x-Aj.x+At.x,Ar=Au.y-Aj.y+At.y;if(Ao.keepInContainer){if(Ai===Ap.body){Am=Ab(AK(Ai,"width"),10);Aq=Ab(AK(Ai,"height"),10)}else{Am=Ai.clientWidth;Aq=Ai.clientHeight}Ao.minX=0-As;Ao.maxX=Am-Al.offsetWidth-As;Ao.minY=0-Ar;Ao.maxY=Aq-Al.offsetHeight-Ar}}function AD(){m(AV,[false],true);AX=false}function j(Ak){b(e);var Aj,Ai,d;if(AB!==false){for(Ai=0,d=AB.length;Ai<d;Ai++){Aj=AB[Ai];if(Aj.hasDropTargetOver){if(typeof Aj.ondragout==AI){Aj.ondragout(Ak,e)}if(Aj.dragOverClassName){W.removeClass(Aj.el,Aj.dragOverClassName)}Aj.hasDropTargetOver=false}}}m(b)}function Ae(d,Ai){if(d.activeDragClassName){W.removeClass(d.el,d.activeDragClassName)}Af(d);if(p){d.el.releaseCapture()}d.hasBeenDragged=false}function AA(d){if(e.dragMultiple){AJ[e.id]=e}else{AJ={}}C=false;Ac.remove(document,v,AL);e=null}function A(d,Ai){if(Ai){if(d.id in AJ){AV(d,false)}else{AV(d,true)}}else{if(!d.isSelected){AD();AV(d,true)}}}function K(d){var Ai=d.el,Aj=d.copyEl;if(!Aj){Aj=d.copyEl=document.getElementById(d.proxyId)}a(d,Aj,Ai)}function N(d){if(!d.copyEl){d.copyEl=d.el.cloneNode(true);d.copyEl.id+="Copy"}a(d,d.copyEl,d.el)}function a(Ai,Al,Ak){var d=Al.style;Ai.origEl=Ak;d.zIndex=Ab(Ak.style.zIndex,10)+100;Ai.el=Al;Ai.style=d;var Aj=AK(Ak,"display");d.display=Aj;if(Ai.dragCopy){Ak.parentNode.insertBefore(Al,Ak);if(Ai.isRel){Ag(d,Ak,Aj)}}else{Z(Ai,Al,Ak)}}function Z(d,Ak,Aj){var Ai=W.getOffsetCoords(Aj,Ak.parentNode);d.moveToX(Ai.x);d.moveToY(Ai.y)}function Ag(d,Aj,Ai){if(Ai=="inline"){d.marginRight=-Aj.offsetWidth+-(Ab(AK(Aj,"marginRight"),10)||0)+"px"}else{d.marginBottom=-Aj.offsetHeight+-(Ab(AK(Aj,"marginBottom"),10)||0)+"px"}}function x(d){var Ai=d.copyEl;if(!Ai){return}d.el=d.origEl;d.style=d.el.style;d.moveToX(d.x);d.moveToY(d.y);Ai.style.display="none";if(d.dragCopy&&!d.proxyId){d.el.parentNode.insertBefore(Ai,d.el)}}function F(Ai,d){if(!AX||Ad){return}m(AH,[Ai,d])}function AH(Aj,Ai,d){if(typeof Ai=="number"){Aj.moveToX(Aj.origX+Ai)}if(typeof d=="number"){Aj.moveToY(Aj.origY+d)}}function G(d,Ai){if(d.isBeingDragged){return}if(d.dragCopy&&!d.proxyId){N(d)}if(typeof d.ondragstart==AI){d.ondragstart(D(d,Ai))}if(p){d.el.setCapture()}if(d.activeDragClassName){W.addClass(d.el,d.activeDragClassName)}AT(d);d.isBeingDragged=true}function D(d,Ak){var Al=d.id,Aj={},Ai=1;Aj[Al]=d;if(AX){for(Al in AJ){Aj[Al]=AJ[Al];Ai++}}return{domEvent:Ak,draggableList:Aj,count:Ai}}function Y(Ak){if(AE){AE=false;return}var d=Ak||window.event;if(J&&e){return}Ak=H(Ak,"touches");var Aj=l.getTarget(d),Al=Ak.metaKey||Ak.ctrlKey,Ai=w(Aj);if(Ai){if(!Ai.isDragEnabled){if(!Al){AD()}return false}if(!Al&&Ai.hasHandleSet&&!q(Ai,Aj)){AD();Ai=null;return}else{if(!Al&&!Ai.isSelected){AD()}Ak.returnValue=false}}else{if(!Al){AD();if(e){AV(e,false);e=null}}return}if(Al&&e&&!Ai.dragMultiple){C=true;return false}if(!Ai.dragMultiple){if(!Al){AD()}else{C=true;return false}}A(Ai,Al);Ai.style.zIndex=++L;if(AY(Ai,Ak)==false){return}e=Ai;U(d);m(AY,[Ak]);return Aj.tagName!=="IMG"}function w(Ai){var d,Aj=AS.instances;if(!Aj){return}for(;!d&&Ai!==null;Ai=W.findAncestorWithAttribute(Ai,"id")){d=Aj[Ai.id]}return d}function r(){if(!e){return}var Ak=e.dropTargets,Aj,Ai,Al,d;if(!Ak){return AB=false}AB=[];for(Ai=Al=0,d=Ak.length;Ai<d;Ai++){Aj=Ak[Ai];Aj.initCoords();if(Aj.ondragover||Aj.ondragout||Aj.dragOverClassName){AB[Al++]=Aj}}if(Al===0){AB=false}}function AY(d,Ak){if(typeof d.onbeforedragstart==AI&&d.onbeforedragstart(D(d,Ak))==false){return false}var Aj=AZ(Ak),Ai;if(d.proxyId&&!d.dragCopy){K(d)}h(d);u=Aj.x;s=Aj.y;Ai=W.getPixelCoords(d.el);d.origX=d.grabX=Ai.x;d.origY=d.grabY=Ai.y;d.isBeingDragged=false;f(document,v,AL)}function h(d){var Ai=d.constraint;if(Ai==="y"){d.moveToX=AQ}else{if(Ai==="x"){d.moveToY=AQ}}}function Af(d){delete d.moveToX;delete d.moveToY}function AL(An){if(!e){return}var Ak=+new Date,Ar;if(Ak-B<R){return}B=Ak;Ar=An=An||event;if(J){An=An.touches&&An.touches[0];if(!An){return}U(Ar)}var Ap=AZ(An),Al=Ap.x,Aj=Ap.y,Aq=Al-u,Ao=Aj-s,d=e.origX+Aq,As=e.origY+Ao,Ai;if(e.isBeingDragged===false){Ad=!!e.proxyId;for(Ai in AJ){AX=true;break}delete AJ[e.id];G(e,An);if(e.proxyId&&e.dragCopy){K(e)}m(G,[An])}e.hasBeenDragged=(e.hasBeenDragged||!!(Aq||Ao));if(typeof e.onbeforedrag==AI&&e.onbeforedrag(An)==false){return}var Am=typeof e.ondrag===AI;if(!P(d,As,Aq,Ao)){e.isAtLeft=e.isAtRight=e.isAtTop=e.isAtBottom=false;e.moveToX(d);e.moveToY(As);F(Aq,Ao);if(Am){e.ondrag(An)}}if(AB!==false){o(e,An,Al,Aj)}return false}function P(d,At,Ap,An){if(e.container){var As=d<e.minX,Ar=d>e.maxX,Al=At<e.minY,Aq=At>e.maxY,Ai=e.constraint,Ao=Ai=="x",Am=Ai=="y",Ak=!Ao,Aj=!Am;if(As||Ar||Al||Aq&&e.onbeforeexitcontainer()!=true){if(!Am){Ak=AG(d,Ap,As,Ar)}if(!Ao){Aj=AF(At,An,Al,Aq)}if(Ak||Aj){if(e.ondrag){e.ondrag()}}else{e.ondragstop()}return true}}return false}function AG(Al,d,Ak,Ai){if(e.x===Al){return false}var Aj;if(Ak){if(!e.isAtLeft){e.moveToX(e.minX);F(e.minX-e.origX,null);e.isAtRight=false;e.isAtLeft=true}else{Aj=true}}else{if(Ai){if(!e.isAtRight){e.moveToX(e.maxX);F(e.maxX-e.origX,null);e.isAtRight=true;e.isAtLeft=false}else{Aj=true}}else{e.isAtLeft=e.isAtRight=false;e.moveToX(Al);F(d,null)}}return !Aj}function AF(Al,d,Aj,Ai,Am){if(e.y===Al){return false}var Ak;if(Aj){if(!e.isAtTop){e.moveToY(e.minY);F(null,e.minY-e.origY);e.isAtTop=true;e.isAtBottom=false}else{Ak=true}}else{if(Ai){if(!e.isAtBottom){if(e.maxY>0){e.moveToY(e.maxY)}F(null,e.maxY-e.origY);e.isAtTop=false;e.isAtBottom=true}else{Ak=true}}else{e.isAtTop=e.isAtBottom=false;e.moveToY(Al);F(null,d)}}return !Ak}function V(Ai){AE=false;Ac.remove(document,v,AL);if(!e){return}var d=e.hasBeenDragged,Aj=(e.isBeingDragged&&!d);Ai=H(Ai,"changedTouches");if(!e.hasBeenDragged&&!Aj){if(!C){x(e);AA(Ai)}return}if(!Ad){m(y)}m(x);x(e);Ah(Ai);m(Ae,[Ai]);AJ[e.id]=e;Ae(e,Ai);e.ondragend({domEvent:Ai,draggableList:AJ});if(e){AA(Ai)}}function y(Ai){var d=Ai.x,Aj=Ai.y;if(d<Ai.minX){Ai.moveToX(Ai.minX)}else{if(d>Ai.maxX){Ai.moveToX(Ai.maxX)}}if(Aj<Ai.minY){Ai.moveToY(Ai.minY)}else{if(Aj>Ai.maxY){Ai.moveToY(Ai.maxY)}}}function m(Ak,Ai,Aj){if(!AX&&!Aj){return}var Al,d;Ai=Ai||[];Ai.unshift(0);for(Al in AJ){d=Ai[0]=AJ[Al];Ak.apply(d,Ai)}}function M(d){if(!e){return}d=d||event;if(d.keyCode==27||d.type==="touchcancel"){e.release(d)}}function o(Ap,An,Aj,d){var Aq={x:Aj,y:d},Am=0,Al=AB.length,Ai,Ak,Ao={domEvent:An,dragObj:Ap};for(;Am<Al;Am++){Ai=AB[Am];Ak=Ai.containsCoords(Aq);if(!Ai.hasDropTargetOver&&Ak){Ai.hasDropTargetOver=true;if(typeof Ai.ondragover==AI){Ai.ondragover(Ao)}if(Ai.dragOverClassName){W.addClass(Ai.el,Ai.dragOverClassName)}}else{if(Ai.hasDropTargetOver&&!Ak){if(typeof Ai.ondragout==AI){Ai.ondragout(Ao)}if(Ai.dragOverClassName){W.removeClass(Ai.el,Ai.dragOverClassName)}Ai.hasDropTargetOver=false}}}}function Ah(Ak){var Ai=e.dropTargets,An,Al,d=Ai.length,Aj,Am;if(d){Al=AZ(Ak);for(Aj=0;Aj<d;Aj++){An=Ai[Aj];if(typeof An.ondrop===AI&&An.containsCoords(Al)){An.ondrop(E(Ak,e));m(AP,[An,Ak])}Am=An.dragOverClassName;if(Am){W.removeClass(An.el,Am)}}}}function E(Ai,d){return{domEvent:Ai,dragObj:d}}function AP(d,Aj,Ai){if(d.id!==Aj.id){Aj.ondrop(E(Ai,d))}}function H(Ai,d){return Ai&&Ai[d]&&Ai[d][0]||Ai||event}function S(Ai){var Aj=AC.anim,d=new Aj.Animation(0.2);d.transition=Aj.Transitions.accel;d.run=c;d.dObj=Ai;d.onplay=Ai.onglide;d.onend=t;d.start()}function c(Ak){var Ai=this.dObj,Aj=Ai.x-Ai.grabX,d=Ai.y-Ai.grabY;Ak=Math.pow(Ak,3);Ai.moveToX(Ai.x-(Aj*Ak));Ai.moveToY(Ai.y-(d*Ak))}function t(){k(this.dObj)}function k(d){if(typeof d.onglideend==AI){d.onglideend()}x(d)}function b(d){if(AC.anim&&d.useAnim){S(d)}else{d.moveToX(d.grabX);d.moveToY(d.grabY);if(typeof d.onglide==AI){d.onglide()}k(d,{})}}AW.prototype={dragCopy:false,useAnim:true,dragMultiple:false,selectedClassName:"",activeDragClassName:"",useHandleTree:true,isSelected:false,onbeforedrag:AN,onbeforedragstart:AQ,ondragstart:AN,ondrag:AN,ondragstop:AQ,ondragend:AQ,x:0,y:0,origX:0,origY:0,grabX:0,grabY:0,keepInContainer:false,isDragEnabled:true,hasHandleSet:false,setHandle:function(d,Ai){this.handle=d;this.hasHandleSet=true;this.useHandleTree=Ai!=false},dropTargets:false,addDropTarget:function(Ak){var Ai=AO.getByNode(Ak),d=Ai.el,Aj=this.dropTargets;if(this.el===d){return Ai}return Aj[Aj.length]=AO.getByNode(d)},grab:function(Ao,Aq,Ak){Ao=Ao||window.event;var Ap=l.getTarget(Ao),Aj;U(Ao);if(W.contains(this.el,Ap)){return}Aj=W.getPixelCoords(this.el);this.grabX=Aj.x;this.grabY=Aj.y;var Ar=AZ(Ao),An=this.handle,Ai=W.getOffsetCoords(W.getContainingBlock(this.el)),Am=Ar.x-Ai.x,d=Am-(0|An.offsetWidth/2),Al=Ar.y-Ai.y,At=(Al-(0|An.offsetHeight/2)),As=W.getOffsetCoords(An,this.el);if(this.keepInContainer){d=Math.max(d,0);d=Math.min(d,this.container.clientWidth-this.el.offsetWidth);At=Math.max(At,0);At=Math.min(At,this.container.clientHeight-this.el.offsetHeight)}this.moveToX(d-As.x+(Aq||0));this.moveToY(At-As.y+(Ak||0));AY(this,Ao);AE=true;e=this},release:function(d){d=d||{};m(Ae,[d]);if(typeof this.onrelease==AI){this.onrelease(d)}j(d);AA(d)},moveToX:function(d){this.style[I]=(this.x=d)+z},moveToY:function(d){this.style[AU]=(this.y=d)+z},removeDropTarget:function(Ak){Ak=document.getElementById(Ak.id);var Ai=this.dropTargets,Aj,d;for(Aj=0,d=Ai.length;Aj<d;Aj++){if(Ai[Aj].el===Ak){Ai.splice(Aj,1);return Ak}}return null},toString:function(){return"Draggable(id="+this.id+")"}};return AW});APE.drag.defineFactory("DropTarget",function createDropTarget(){var B=APE.dom.getOffsetCoords;function A(C){this.el=document.getElementById(C);this.id=C}A.prototype={dragOverClassName:"",initCoords:function(){var D=this.coords||(this.coords={}),C=this.el;B(C,document,D);D.w=C.clientWidth;D.h=C.clientHeight},containsCoords:function(D){var C=this.coords,F=C.x,E=C.y;return(D.x>=F&&D.x<=F+C.w)&&(D.y>=E&&D.y<=E+C.h)},ondragover:false,ondragout:0,ondrop:0};return A});