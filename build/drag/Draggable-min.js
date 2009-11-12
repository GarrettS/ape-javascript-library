APE.namespace("APE.drag");(function(){var M=self.APE,P=M.dom,D=P.getStyle,O=M.drag,T=P.Event,R=1000,S={},B,C=Function.prototype,K=self.parseInt,N,H="function",G=M.createFactory(A,F),E=M.createFactory(I,Q);O.Draggable=G;O.DropTarget=E;G.instanceDestructor=L;function A(Z,U){var X=document,V=X.getElementById(Z),Y,W;this.id=Z;this.el=this.origEl=V;this.style=V.style;this.isRel=D(V,"position").toLowerCase()=="relative";Y=(this.isRel?V.parentNode:P.getContainingBlock(V));if(Y===null){Y=X.documentElement}this.container=Y;this.dropTargets=[];this.handle=V;this.onbeforeexitcontainer=J;if(U){for(W in U){this[W]=U[W]}V.style.zIndex=K(D(V,"zIndex"),10)||R++}}function J(){return !this.keepInContainer}function L(){var U,W,V;for(U in this.instances){V=this.instances[U];for(W in V){delete V[W]}delete this.instances[U]}S={}}function F(){var Ad=document,Y=M.EventPublisher,Af=Y.add,AP=T.preventDefault,AM="documentElement",k=Ad[AM].style,j="px",m="left",y="top",Ab=false,c=0,a=0,AK,AC=false,V=false,AZ=false,r=25,AD=-1,i="onmousedown",U="onmousemove",Ae="onmouseup",AG,AH,AU=T.getCoords;if("ontouchstart" in Ad){AG=true;i="ontouchstart";U="ontouchmove";Ae="ontouchend";Af(Ad,"ontouchcancel",AY)}AH=Y.get(Ad,i);if("pixelLeft" in k){j=0;m="pixelLeft";y="pixelTop"}Af(Ad,"onkeydown",AY);Af(Ad,U,AA);Af(self,U,function(d){d.preventDefault()});Af(Ad,Ae,h);AX(Ad,k);AH.add(o).addAfter(g);Ad=k=null;function AX(An,Am){var Ak="serSelect",Ao="MozU"+Ak,Al="MozU"+Ak,Ah="u"+Ak,Aj=Ao in k?Ao:Al in k?Al:Ah in k?Ah:"",d="onselectstart";if(d in Ad){Af(Ad,d,Ai)}else{AH.addAfter(Ai)}function Ai(Aq){var Ap=!AK;if(Aj){this[AM].style[Aj]=Ap?"":"none"}else{(Aq||window.event||0).returnValue=Ap}}}function AS(d,Ah){return Ah===d.handle||(d.useHandleTree&&P.contains(d.handle,Ah))}function Aa(d,Ah){if(Ah){if(d.selectedClassName){P.addClass(d.el,d.selectedClassName)}if(d.dragMultiple&&!(d.id in S)){S[d.id]=d}}else{if(d.selectedClassName){P.removeClass(d.el,d.selectedClassName)}delete S[d.id]}d.isSelected=Ah}function w(An){var Ah=An.container,Ak=An.el,Ao=document,Aj=Ao.documentElement,Am=P.getContainingBlock(Ak)||Aj,Al,Ap,As=(Am===Ah)?{x:0,y:0}:P.getOffsetCoords(Am,Ah),Ai=P.getPixelCoords(Ak),At=P.getOffsetCoords(Ak,Ak.parentNode),Ar=At.x-Ai.x+As.x,Aq=At.y-Ai.y+As.y;if(An.keepInContainer){if(Ah===Ao.body){Al=K(D(Ah,"width"),10);Ap=K(D(Ah,"height"),10)}else{Al=Ah.clientWidth;Ap=Ah.clientHeight}An.minX=0-Ar;An.maxX=Al-Ak.offsetWidth-Ar;An.minY=0-Aq;An.maxY=Ap-Ak.offsetHeight-Aq}}function AJ(){s(Aa,[false],true);V=false}function X(Aj){AE(AK);var Ai,Ah,d;if(AC!==false){for(Ah=0,d=AC.length;Ah<d;Ah++){Ai=AC[Ah];if(Ai.hasDropTargetOver){if(typeof Ai.ondragout==H){Ai.ondragout(Aj,AK)}if(Ai.dragOverClassName){P.removeClass(Ai.el,Ai.dragOverClassName)}Ai.hasDropTargetOver=false}}}s(AE)}function Z(d,Ah){if(d.activeDragClassName){P.removeClass(d.el,d.activeDragClassName)}AL(d);d.hasBeenDragged=false}function AV(d){if(AK.hasBeenDragged){if(AK.dragMultiple){S[AK.id]=AK}else{S={}}}Ab=false;AK=null}function n(d,Ah){if(Ah){if(d.id in S){Aa(d,false)}else{Aa(d,true)}}else{if(!d.isSelected){AJ();Aa(d,true)}}}function e(d){var Ah=d.el,Ai=d.copyEl;if(!Ai){Ai=d.copyEl=document.getElementById(d.proxyId)}AR(d,Ai,Ah)}function AO(d){if(!d.copyEl){d.copyEl=d.el.cloneNode(true);d.copyEl.id+="Copy"}AR(d,d.copyEl,d.el)}function AR(Ah,Ak,Aj){var d=Ak.style;Ah.origEl=Aj;d.zIndex=K(Aj.style.zIndex,10)+100;if(Ah.origClassName){P.addClass(Aj,Ah.origClassName)}Ah.el=Ak;Ah.style=d;var Ai=D(Aj,"display");d.display=Ai;if(Ah.dragCopy){Aj.parentNode.insertBefore(Ak,Aj);if(Ah.isRel){u(d,Aj,Ai)}}else{AI(Ah,Ak,Aj)}}function AI(d,Aj,Ai){var Ah=P.getOffsetCoords(Ai,Aj.parentNode);d.moveToX(Ah.x);d.moveToY(Ah.y)}function u(d,Ai,Ah){if(Ah=="inline"){d.marginRight=-Ai.offsetWidth+-(K(D(Ai,"marginRight"),10)||0)+"px"}else{d.marginBottom=-Ai.offsetHeight+-(K(D(Ai,"marginBottom"),10)||0)+"px"}}function Ag(d){d.el=d.origEl;d.style=d.el.style;d.moveToX(d.x);d.moveToY(d.y);if(d.copyEl){d.copyEl.style.display="none"}if(d.origClassName){P.removeClass(d.el,d.origClassName)}if(d.dragCopy&&!d.proxyId){d.el.parentNode.insertBefore(d.copyEl,d.el)}}function AT(Ah,d){if(!V||AZ){return}s(AW,[Ah,d])}function AW(Ai,Ah,d){if(typeof Ah=="number"){Ai.moveToX(Ai.origX+Ah)}if(typeof d=="number"){Ai.moveToY(Ai.origY+d)}}function l(d,Ah){if(d.isBeingDragged){return}if(d.dragCopy&&!d.proxyId){AO(d)}if(typeof d.ondragstart==H){d.ondragstart(b(d,Ah))}if(d.activeDragClassName){P.addClass(d.el,d.activeDragClassName)}w(d);d.isBeingDragged=true}function b(d,Aj){var Ak=d.id,Ai={},Ah=1;Ai[Ak]=d;if(V){for(Ak in S){Ai[Ak]=S[Ak];Ah++}}return{domEvent:Aj,draggableList:Ai,count:Ah}}function o(Al){if(N){N=false;return}var d=Al||window.event;if(AG&&AK){return}Al=f(Al,"touches");var Ak=T.getTarget(d),Aj=G.instances,Ai,Ah=Ak,Am=Al.metaKey||Al.ctrlKey;while(!Ai&&Ah!==null){Ai=Aj[Ah.id];Ah=P.findAncestorWithAttribute(Ah,"id")}if(Ai){if(!Ai.isDragEnabled){if(!Am){AJ()}return false}if(!Am&&Ai.hasHandleSet&&!AS(Ai,Ak)){AJ();Ai=null;return}else{if(!Am&&!Ai.isSelected){AJ()}Al.returnValue=false}}else{if(!Am){AJ();if(AK){Aa(AK,false);AK=null}}return}if(Am&&AK&&!Ai.dragMultiple){Ab=true;return false}if(!Ai.dragMultiple){if(!Am){AJ()}else{Ab=true;return false}}n(Ai,Am);Ai.style.zIndex=++R;if(Ac(Ai,Al)==false){return}AK=Ai;AP(d);s(Ac,[Al]);return Ak.tagName!=="IMG"}function g(){if(!AK){return}AC=[];var Aj=AK.dropTargets,Ai,Ah=0,d=Aj.length;for(;Ah<d;Ah++){Ai=Aj[Ah];Ai.initCoords();if(typeof Ai.ondragover==H||typeof Ai.ondragout==H||Ai.dragOverClassName){AC.push(Ai)}}if(AC.length===0){AC=false}}function Ac(d,Aj){if(typeof d.onbeforedragstart==H&&d.onbeforedragstart(b(d,Aj))==false){return false}var Ai=AU(Aj),Ah;if(d.proxyId&&!d.dragCopy){e(d)}v(d);c=Ai.x;a=Ai.y;Ah=P.getPixelCoords(d.el);d.origX=d.grabX=Ah.x;d.origY=d.grabY=Ah.y;d.isBeingDragged=false}function v(d){var Ah=d.constraint;if(Ah=="y"){d.moveToX=C}else{if(Ah=="x"){d.moveToY=C}}}function AL(d){delete d.moveToX;delete d.moveToY}function AA(An){if(!AK){return}var Aj=+new Date,Au;if(Aj-AD<r){return}AD=Aj;Au=An=An||event;if(AG){An=An.touches&&An.touches[0];if(!An){return}AP(Au)}var Aq=AU(An),Ak=Aq.x,Ai=Aq.y,Ar=Ak-c,Ao=Ai-a,d=AK.origX+Ar,Av=AK.origY+Ao,Ah;if(AK.isBeingDragged===false){AZ=!!AK.proxyId;for(Ah in S){V=true;break}delete S[AK.id];l(AK,An);if(AK.proxyId&&AK.dragCopy){e(AK)}s(l,[An])}AK.hasBeenDragged=(AK.hasBeenDragged||!!(Ar||Ao));var At=d<AK.minX,As=d>AK.maxX,Am=Av<AK.minY,Ap=Av>AK.maxY,Al=(typeof AK.ondrag===H);if(typeof AK.onbeforedrag==H&&AK.onbeforedrag(An)==false){return}if(AK.container!=null&&At||As||Am||Ap&&AK.onbeforeexitcontainer()!=true){AN(At,As,Am,Ap,d,Av,Ar,Ao,Al,An)}else{AK.isAtLeft=AK.isAtRight=AK.isAtTop=AK.isAtBottom=false;AK.moveToX(d);AK.moveToY(Av);AT(Ar,Ao);if(Al){AK.ondrag(An)}}if(AC!==false){z(AK,An,Ak,Ai)}return false}function h(Ah){N=false;if(!AK){return}var d=AK.hasBeenDragged,Ai=(AK.isBeingDragged&&!d);if(!AK.hasBeenDragged&&!Ai){if(!Ab){AK=null}return}Ah=f(Ah,"changedTouches");if(!AZ){s(q)}s(Ag);Ag(AK);p(Ah);s(Z,[Ah]);S[AK.id]=AK;Z(AK,Ah);AK.ondragend({domEvent:Ah,draggableList:S});if(AK){AV(Ah)}}function AN(Ap,Ao,Aj,Am,d,Aq,An,Ak,Ah,Ai){var Al=0;if(Ap){if(!AK.isAtLeft){AK.moveToX(AK.minX);AT(AK.minX-AK.origX,null);if(Ah){AK.ondrag(Ai)}AK.isAtRight=false;AK.isAtLeft=true}Al+=1}else{if(Ao){if(!AK.isAtRight){AK.moveToX(AK.maxX);AT(AK.maxX-AK.origX,null);if(Ah){AK.ondrag(Ai)}AK.isAtRight=true;AK.isAtLeft=false}Al+=1}else{AK.isAtLeft=AK.isAtRight=false;AK.moveToX(d);AT(An,null)}}if(Aj){if(!AK.isAtTop){AK.moveToY(AK.minY);AT(null,AK.minY-AK.origY);if(Ah){AK.ondrag(Ai)}AK.isAtTop=true;AK.isAtBottom=false}Al+=1}else{if(Am){if(!AK.isAtBottom){if(AK.maxY>0){AK.moveToY(AK.maxY)}AT(null,AK.maxY-AK.origY);if(Ah){AK.ondrag(Ai)}AK.isAtTop=false;AK.isAtBottom=true}Al+=1}else{AK.isAtTop=AK.isAtBottom=false;AK.moveToY(Aq);AT(null,Ak)}}if(Al>=1){AK.ondragstop(Ai)}else{if(Ah){AK.ondrag(Ai)}}}function q(Ah){var d=Ah.x,Ai=Ah.y;if(d<Ah.minX){Ah.moveToX(Ah.minX)}else{if(d>Ah.maxX){Ah.moveToX(Ah.maxX)}}if(Ai<Ah.minY){Ah.moveToY(Ah.minY)}else{if(Ai>Ah.maxY){Ah.moveToY(Ah.maxY)}}}function s(Aj,Ah,Ai){if(!V&&!Ai){return}var Ak,d;Ah=Ah||[];Ah.unshift(0);for(Ak in S){d=Ah[0]=S[Ak];Aj.apply(d,Ah)}}function AY(d){if(!AK){return}d=d||event;if(d.keyCode==27||d.type==="touchcancel"){AK.release(d)}}function z(Ao,Am,Ai,d){var Ap={x:Ai,y:d},Al=0,Ak=AC.length,Ah,Aj,An={domEvent:Am,dragObj:Ao};for(;Al<Ak;Al++){Ah=AC[Al];Aj=Ah.containsCoords(Ap);if(!Ah.hasDropTargetOver&&Aj){Ah.hasDropTargetOver=true;if(typeof Ah.ondragover==H){Ah.ondragover(An)}if(Ah.dragOverClassName){P.addClass(Ah.el,Ah.dragOverClassName)}}else{if(Ah.hasDropTargetOver&&!Aj){if(typeof Ah.ondragout==H){Ah.ondragout(An)}if(Ah.dragOverClassName){P.removeClass(Ah.el,Ah.dragOverClassName)}Ah.hasDropTargetOver=false}}}}function p(Aj){var Ah=AK.dropTargets,Am,Ak,d=Ah.length,Ai,Al;if(d){Ak=AU(Aj);for(Ai=0;Ai<d;Ai++){Am=Ah[Ai];if(typeof Am.ondrop===H&&Am.containsCoords(Ak)){Am.ondrop(AF(Aj,AK));s(AB,[Am,Aj])}Al=Am.dragOverClassName;if(Al){P.removeClass(Am.el,Al)}}}}function AF(Ah,d){return{domEvent:Ah,dragObj:d}}function AB(d,Ai,Ah){if(d.id!==Ai.id){Ai.ondrop(AF(Ah,d))}}function f(Ah,d){return Ah&&Ah[d]&&Ah[d][0]||Ah||event}function t(Ah){var Ai=M.anim,d=new Ai.Animation(0.2);d.transition=Ai.Transitions.accel;d.run=x;d.dObj=Ah;d.onplay=Ah.onglide;d.onend=W;d.start()}function x(Aj){var Ah=this.dObj,Ai=Ah.x-Ah.grabX,d=Ah.y-Ah.grabY;Aj=Math.pow(Aj,3);Ah.moveToX(Ah.x-(Ai*Aj));Ah.moveToY(Ah.y-(d*Aj))}function W(){AQ(this.dObj)}function AQ(d){if(typeof d.onglideend==H){d.onglideend()}Ag(d)}function AE(d){if(M.anim&&d.useAnim){t(d)}else{d.moveToX(d.grabX);d.moveToY(d.grabY);if(typeof d.onglide==H){d.onglide()}AQ(d,{})}}return{dragCopy:false,useAnim:true,dragMultiple:false,selectedClassName:"",activeDragClassName:"",useHandleTree:true,isSelected:false,onbeforedrag:B,onbeforedragstart:C,ondragstart:B,ondrag:B,ondragstop:C,ondragend:C,x:0,y:0,origX:0,origY:0,grabX:0,grabY:0,keepInContainer:false,isDragEnabled:true,hasHandleSet:false,setHandle:function(d,Ah){this.handle=d;this.hasHandleSet=true;this.useHandleTree=Ah!=false},dropTargets:false,addDropTarget:function(Aj){var Ah=E.getByNode(Aj),d=Ah.el,Ai=this.dropTargets;if(this.el===d){return Ah}return Ai[Ai.length]=E.getByNode(d)},grab:function(An,Ap,Aj){An=An||window.event;var Ao=T.getTarget(An),Ai;AP(An);if(P.contains(this.el,Ao)){return}Ai=P.getPixelCoords(this.el);this.grabX=Ai.x;this.grabY=Ai.y;var Aq=AU(An),Am=this.handle,Ah=P.getOffsetCoords(P.getContainingBlock(this.el)),Al=Aq.x-Ah.x,d=Al-(0|Am.offsetWidth/2),Ak=Aq.y-Ah.y,As=(Ak-(0|Am.offsetHeight/2)),Ar=P.getOffsetCoords(Am,this.el);if(this.keepInContainer){d=Math.max(d,0);d=Math.min(d,this.container.clientWidth-this.el.offsetWidth);As=Math.max(As,0);As=Math.min(As,this.container.clientHeight-this.el.offsetHeight)}this.moveToX(d-Ar.x+(Ap||0));this.moveToY(As-Ar.y+(Aj||0));Ac(this,An);N=true;AK=this},release:function(d){d=d||{};s(Z,[d]);if(typeof this.onrelease==H){this.onrelease(d)}X(d);AV(d)},moveToX:function(d){this.style[m]=(this.x=d)+j},moveToY:function(d){this.style[y]=(this.y=d)+j},removeDropTarget:function(Aj){var Aj=document.getElementById(Aj.id),Ah=this.dropTargets,Ai,d;for(Ai=0,d=Ah.length;Ai<d;Ai++){if(Ah[Ai].el===Aj){Ah.splice(Ai,1);return Aj}}return null},toString:function(){return"Draggable(id="+this.id+")"}}}function I(U){this.el=document.getElementById(U);this.id=U}function Q(){return{dragOverClassName:"",initCoords:function(){var V=this.coords||(this.coords={}),U=this.el;P.getOffsetCoords(U,document,V);V.w=U.clientWidth;V.h=U.clientHeight},containsCoords:function(V){var U=this.coords,X=U.x,W=U.y;return(V.x>=X&&V.x<=X+U.w)&&(V.y>=W&&V.y<=W+U.h)},ondragover:false,ondragout:B,ondrop:B}}})();