APE.namespace("APE.drag");(function(){var M=self.APE,P=M.dom,D=P.getStyle,O=M.drag,T=P.Event,R=1000,S={},B,C=Function.prototype,K=self.parseInt,N,H="function",G=M.createFactory(A,F),E=M.createFactory(I,Q);O.Draggable=G;O.DropTarget=E;G.instanceDestructor=L;function A(a,U){var Y=document,V=Y.getElementById(a),X,Z,W;this.id=a;this.el=this.origEl=V;this.style=V.style;this.isRel=D(V,"position").toLowerCase()=="relative";Z=(this.isRel?V.parentNode:P.getContainingBlock(V));if(Z===null){Z=Y.documentElement}this.container=Z;this.dropTargets=[];this.handle=V;this.onbeforeexitcontainer=J;if(U){for(W in U){this[W]=U[W]}V.style.zIndex=K(D(V,"zIndex"),10)||R++}}function J(){return !this.keepInContainer}function L(){var U,W,V;for(U in this.instances){V=this.instances[U];for(W in V){delete V[W]}delete this.instances[U]}S={}}function F(){var AZ=document,Y=M.EventPublisher,Ab=Y.add,AP=T.preventDefault,AN="documentElement",k=AZ[AN].style,AH="serSelect",Ac="MozU"+AH,s="MozU"+AH,AM="u"+AH,AB=Ac in k?Ac:s in k?s:AM in k?AM:"",j="px",n="left",y="top",AX=false,e=0,a=0,AK,AC=false,V=false,AV=false,r=25,AD=-1,i="onmousedown",U="onmousemove",Aa="onmouseup",AF,AG;getEventCoords=T.getCoords;if("ontouchstart" in AZ){AF=true;i="ontouchstart";U="ontouchmove";Aa="ontouchend";Ab(AZ,"ontouchcancel",AU)}AG=Y.get(AZ,i);if("onselectstart" in AZ){Ab(AZ,"onselectstart",o)}else{AG.addAfter(o)}if("pixelLeft" in k){j=0;n="pixelLeft";y="pixelTop"}AG.add(p).addAfter(g);Ab(AZ,"onkeydown",AU);Ab(AZ,U,AA);Ab(self,U,function(d){d.preventDefault()});Ab(AZ,Aa,h);AZ=k=null;function o(Ae){var d=!AK;if(AB){this[AN].style[AB]=d?"":"none"}else{Ae=Ae||event;Ae.returnValue=d}}function AS(d,Ae){return Ae===d.handle||(d.useHandleTree&&P.contains(d.handle,Ae))}function AW(d,Ae){if(Ae){if(d.selectedClassName){P.addClass(d.el,d.selectedClassName)}if(d.dragMultiple&&!(d.id in S)){S[d.id]=d}}else{if(d.selectedClassName){P.removeClass(d.el,d.selectedClassName)}delete S[d.id]}d.isSelected=Ae}function w(Ak){var Ae=Ak.container,Ah=Ak.el,Al=document,Ag=Al.documentElement,Aj=P.getContainingBlock(Ah)||Ag,Ai,Am,Ap=(Aj===Ae)?{x:0,y:0}:P.getOffsetCoords(Aj,Ae),Af=P.getPixelCoords(Ah),Aq=P.getOffsetCoords(Ah,Ah.parentNode),Ao=Aq.x-Af.x+Ap.x,An=Aq.y-Af.y+Ap.y;if(Ak.keepInContainer){if(Ae===Al.body){Ai=K(D(Ae,"width"),10);Am=K(D(Ae,"height"),10)}else{Ai=Ae.clientWidth;Am=Ae.clientHeight}Ak.minX=0-Ao;Ak.maxX=Ai-Ah.offsetWidth-Ao;Ak.minY=0-An;Ak.maxY=Am-Ah.offsetHeight-An}}function AJ(){for(var d in S){AW(S[d],false)}V=false}function X(Ah,d){AE(d);var Ai=P.removeClass,Ag,Af,Ae,Aj;if(AC!==false){for(Af=0,Ae=AC.length;Af<Ae;Af++){Ag=AC[Af];if(Ag.hasDropTargetOver){if(typeof Ag.ondragout==H){Ag.ondragout(Ah,d)}if(Ag.dragOverClassName){Ai(Ag.el,Ag.dragOverClassName)}Ag.hasDropTargetOver=false}}}for(Aj in S){AE(S[Aj])}}function Z(d,Ae){if(d.activeDragClassName){P.removeClass(d.el,d.activeDragClassName)}if(d.dragCopy&&!d.proxyId){d.el.parentNode.insertBefore(d.copyEl,d.el)}AL(d)}function m(d,Ae){if(Ae){if(d.id in S){AW(d,false)}else{AW(d,true)}}else{if(!d.isSelected){AJ();AW(d,true)}}}function c(d){var Ae=d.el,Af=d.copyEl;if(!Af){Af=d.copyEl=document.getElementById(d.proxyId)}AR(d,Af,Ae)}function AO(d){if(!d.copyEl){d.copyEl=d.el.cloneNode(true);d.copyEl.id+="Copy"}AR(d,d.copyEl,d.el)}function AR(Ae,Ah,Ag){var d=Ah.style;Ae.origEl=Ag;d.zIndex=K(Ag.style.zIndex,10)+100;if(Ae.origClassName){P.addClass(Ag,Ae.origClassName)}Ae.el=Ah;Ae.style=d;var Af=D(Ag,"display");d.display=Af;if(Ae.dragCopy){Ag.parentNode.insertBefore(Ah,Ag);if(Ae.isRel){u(d,Ag,Af)}}else{AI(Ae,Ah,Ag)}}function AI(d,Ag,Af){var Ae=P.getOffsetCoords(Af,Ag.parentNode);d.moveToX(Ae.x);d.moveToY(Ae.y)}function u(d,Af,Ae){if(Ae=="inline"){d.marginRight=-Af.offsetWidth+-(K(D(Af,"marginRight"),10)||0)+"px"}else{d.marginBottom=-Af.offsetHeight+-(K(D(Af,"marginBottom"),10)||0)+"px"}}function Ad(d){d.el=d.origEl;d.style=d.origEl.style;d.moveToX(d.x);d.moveToY(d.y);d.copyEl.style.display="none";if(d.origClassName){P.removeClass(d.el,d.origClassName)}}function AT(Ae,d){if(!V||AV){return}var Af,Ag;for(Ag in S){Af=S[Ag];if(typeof Ae=="number"){Af.moveToX(Af.origX+Ae)}if(typeof d=="number"){Af.moveToY(Af.origY+d)}}}function l(d,Ae){if(d.isBeingDragged){return}if(d.dragCopy&&!d.proxyId){AO(d)}if(typeof d.ondragstart==H){d.ondragstart(b(d,Ae))}if(d.activeDragClassName){P.addClass(d.el,d.activeDragClassName)}w(d);d.isBeingDragged=true}function b(d,Ag){var Ah=d.id,Af={},Ae=1;Af[Ah]=d;if(V){for(Ah in S){Af[Ah]=S[Ah];Ae++}}return{domEvent:Ag,draggableList:Af,count:Ae}}function p(Ai){if(N){N=false;return}var d=Ai||event;if(AF&&AK){return}Ai=f(Ai,"touches");var Ah=T.getTarget(d),Ak,Ag=G.instances,Af,Ae=Ah,Aj=Ai.metaKey||Ai.ctrlKey;while(!Af&&Ae!==null){Af=Ag[Ae.id];Ae=P.findAncestorWithAttribute(Ae,"id")}if(Af){if(!Af.isDragEnabled){if(!Aj){AJ()}return false}if(!Aj&&Af.hasHandleSet&&!AS(Af,Ah)){AJ();Af=null;return}else{if(!Aj&&!Af.isSelected){AJ()}Ai.returnValue=false}}else{if(!Aj){AJ();if(AK){AW(AK,false);AK=null}}return}if(Aj&&AK&&!Af.dragMultiple){AX=true;return false}if(!Af.dragMultiple){if(!Aj){AJ()}else{AX=true;return false}}m(Af,Aj);Af.style.zIndex=++R;if(AY(Ai,Af)==false){return}AK=Af;AP(d);for(Ak in S){AY(Ai,S[Ak])}return Ah.tagName!=="IMG"}function g(){if(!AK){return}AC=[];var Ag=AK.dropTargets,Af,Ae=0,d=Ag.length;for(;Ae<d;Ae++){Af=Ag[Ae];Af.initCoords();if(typeof Af.ondragover==H||typeof Af.ondragout==H||Af.dragOverClassName){AC.push(Af)}}if(AC.length===0){AC=false}}function AY(Ag,d){if(typeof d.onbeforedragstart==H&&d.onbeforedragstart(b(d,Ag))==false){return false}var Af=getEventCoords(Ag),Ae;if(d.proxyId&&!d.dragCopy){c(d)}v(d);e=Af.x;a=Af.y;Ae=P.getPixelCoords(d.el);d.origX=d.grabX=Ae.x;d.origY=d.grabY=Ae.y;d.isBeingDragged=false}function v(d){var Ae=d.constraint;if(Ae=="y"){d.moveToX=C}else{if(Ae=="x"){d.moveToY=C}}}function AL(d){delete d.moveToX;delete d.moveToY}function AA(Aq){if(!AK){return}var Af=+new Date,Aj;if(Af-AD<r){return}AD=Af;Aj=Aq=Aq||event;if(AF){Aq=Aq.touches&&Aq.touches[0];if(!Aq){return}AP(Aj)}var Ai=getEventCoords(Aq),Ap=Ai.x,Am=Ai.y,Al=Ap-e,Ak=Am-a,Ah=false,As=AK.origX+Al,Ar=AK.origY+Ak,An;if(AK.isBeingDragged===false){AV=!!AK.proxyId;for(An in S){V=true;break}delete S[AK.id];l(AK,Aq);if(AK.proxyId&&AK.dragCopy){c(AK)}for(An in S){l(S[An],Aq)}}AK.hasBeenDragged=(AK.hasBeenDragged||!!(Al||Ak));var Ag=As<AK.minX,Ae=As>AK.maxX,Av=Ar<AK.minY,Ao=Ar>AK.maxY,d=AK.container!=null,Au=(typeof AK.ondrag==H),At=0;if(typeof AK.onbeforedrag==H&&AK.onbeforedrag(Aq)==false){return}d&=(Ag||Ae||Av||Ao);if(d&&AK.onbeforeexitcontainer()==false){if(Ag){if(!AK.isAtLeft){AK.moveToX(AK.minX);AT(AK.minX-AK.origX,null);if(Au){AK.ondrag(Aq)}AK.isAtRight=false;AK.isAtLeft=true}At+=1}else{if(Ae){if(!AK.isAtRight){AK.moveToX(AK.maxX);AT(AK.maxX-AK.origX,null);if(Au){AK.ondrag(Aq)}AK.isAtRight=true;AK.isAtLeft=false}At+=1}else{AK.isAtLeft=AK.isAtRight=false;AK.moveToX(As);AT(Al,null)}}if(Av){if(!AK.isAtTop){AK.moveToY(AK.minY);AT(null,AK.minY-AK.origY);if(Au){AK.ondrag(Aq)}AK.isAtTop=true;AK.isAtBottom=false}At+=1}else{if(Ao){if(!AK.isAtBottom){if(AK.maxY>0){AK.moveToY(AK.maxY)}AT(null,AK.maxY-AK.origY);if(Au){AK.ondrag(Aq)}AK.isAtTop=false;AK.isAtBottom=true}At+=1}else{AK.isAtTop=AK.isAtBottom=false;AK.moveToY(Ar);AT(null,Ak)}}Ah=At==2;if(Ah){AK.ondragstop(Aq)}else{if(Au){AK.ondrag(Aq)}}}else{AK.isAtLeft=AK.isAtRight=AK.isAtTop=AK.isAtBottom=false;AK.moveToX(As);AK.moveToY(Ar);AT(Al,Ak);if(Au){AK.ondrag(Aq)}}if(AC!==false){z(AK,Aq,Ap,Am)}return false}function h(Ag){N=false;if(!AK){return}var Ae=AK.hasBeenDragged,Ak=(AK.isBeingDragged&&!Ae),Af={},Aj,Ah,d,Ai;if(!AK.hasBeenDragged&&!Ak){if(!AX){AK=null}return}AX=false;S[AK.id]=AK;for(Aj in S){Ah=S[Aj];Ah=Af[Aj]=S[Aj];if(Ah.copyEl){Ad(Ah)}}Ag=f(Ag,"changedTouches");q(Ag);if(V&&!AV){for(Aj in S){Ah=S[Aj];d=Ah.x;Ai=Ah.y;if(d<Ah.minX){Ah.moveToX(Ah.minX)}else{if(d>Ah.maxX){Ah.moveToX(Ah.maxX)}}if(Ai<Ah.minY){Ah.moveToY(Ah.minY)}else{if(Ai>Ah.maxY){Ah.moveToY(Ah.maxY)}}}}if(Ae){AK.ondragend({domEvent:Ag,draggableList:Af});Z(AK,Ag);for(Aj in S){Z(S[Aj],Ag)}}AK.hasBeenDragged=false;S[AK.id]=AK;AK=null}function AU(d){d=d||event;if(d.keyCode==27||d.type==="touchcancel"){if(AK){AK.release(d)}}}function z(Al,Aj,Af,d){var Am={x:Af,y:d},Ai=0,Ah=AC.length,Ae,Ag,Ak={domEvent:Aj,dragObj:Al};for(;Ai<Ah;Ai++){Ae=AC[Ai];Ag=Ae.containsCoords(Am);if(!Ae.hasDropTargetOver&&Ag){Ae.hasDropTargetOver=true;if(typeof Ae.ondragover==H){Ae.ondragover(Ak)}if(Ae.dragOverClassName){P.addClass(Ae.el,Ae.dragOverClassName)}}else{if(Ae.hasDropTargetOver&&!Ag){if(typeof Ae.ondragout==H){Ae.ondragout(Ak)}if(Ae.dragOverClassName){P.removeClass(Ae.el,Ae.dragOverClassName)}Ae.hasDropTargetOver=false}}}}function q(Ag){var Ae=AK.dropTargets,Ak,Ah,d=Ae.length,Af,Aj,Ai;if(d>0){Ah=getEventCoords(Ag);for(Af=0;Af<d;Af++){Ak=Ae[Af];if(Ak.containsCoords(Ah)){if(typeof Ak.ondrop==H){Ak.ondrop({domEvent:Ag,dragObj:AK,dropTarget:Ak})}if(V){for(Aj in S){if(Aj===Ak.id){continue}if(typeof Ak.ondrop==H){Ai=S[Aj];Ak.ondrop({domEvent:Ag,dragObj:Ai,dropTarget:Ak})}}}if(Ak.dragOverClassName){P.removeClass(Ak.el,Ak.dragOverClassName)}break}}}}function f(Ae,d){return Ae&&Ae[d]&&Ae[d][0]||Ae||event}function t(Ae){var Af=M.anim;Ae.startX=Ae.x;Ae.startY=Ae.y;var d=new Af.Animation(0.2);d.transition=Af.Transitions.accel;d.run=x;d.dObj=Ae;d.onplay=Ae.onglide;d.onend=W;d.start()}function x(Ag){var Ae=this.dObj,Af=Ae.startX-Ae.grabX,d=Ae.startY-Ae.grabY;Ag=Math.pow(Ag,3);Ae.moveToX(Ae.startX-(Af*Ag));Ae.moveToY(Ae.startY-(d*Ag))}function W(){AQ(this.dObj)}function AQ(d){if(typeof d.onglideend==H){d.onglideend()}if(d.copyEl){d.el=d.origEl;d.style=d.origEl.style;d.copyEl.style.display="none"}Z(d,{})}function AE(d){if(M.anim&&d.useAnim){t(d)}else{d.moveToX(d.grabX);d.moveToY(d.grabY);if(typeof d.onglide==H){d.onglide()}AQ(d,{})}}return{dragCopy:false,useAnim:true,dragMultiple:false,selectedClassName:"",activeDragClassName:"",useHandleTree:true,isSelected:false,onbeforedrag:B,onbeforedragstart:C,ondragstart:B,ondrag:B,ondragstop:C,ondragend:C,x:0,y:0,origX:0,origY:0,grabX:0,grabY:0,keepInContainer:false,isDragEnabled:true,hasHandleSet:false,setHandle:function(d,Ae){this.handle=d;this.hasHandleSet=true;this.useHandleTree=Ae!=false},dropTargets:false,addDropTarget:function(Ag){var Ae=E.getByNode(Ag),d=Ae.el,Af=this.dropTargets;if(this.el===d){return Ae}return Af[Af.length]=E.getByNode(d)},grab:function(Ak,Am,Ag){Ak=Ak||event;var Al=T.getTarget(Ak),Af;AP(Ak);if(P.contains(this.el,Al)){return}Af=P.getPixelCoords(this.el);this.grabX=Af.x;this.grabY=Af.y;var An=getEventCoords(Ak),Aj=this.handle,Ae=P.getOffsetCoords(P.getContainingBlock(this.el)),Ai=An.x-Ae.x,d=Ai-(0|Aj.offsetWidth/2),Ah=An.y-Ae.y,Ap=(Ah-(0|Aj.offsetHeight/2)),Ao=P.getOffsetCoords(Aj,this.el);if(this.keepInContainer){d=Math.max(d,0);d=Math.min(d,this.container.clientWidth-this.el.offsetWidth);Ap=Math.max(Ap,0);Ap=Math.min(Ap,this.container.clientHeight-this.el.offsetHeight)}this.moveToX(d-Ao.x+(Am||0));this.moveToY(Ap-Ao.y+(Ag||0));AY(Ak,this);N=true;AK=this},release:function(d){X(d,this);if(typeof this.onrelease==H){this.onrelease(d)}if(this.dragMultiple){S[this.id]=this}if(this===AK){AK.hasBeenDragged=false;AK=null}},moveToX:function(d){this.style[n]=(this.x=d)+j},moveToY:function(d){this.style[y]=(this.y=d)+j},removeDropTarget:function(Ag){var Ag=document.getElementById(Ag.id),Ae=this.dropTargets,Af,d;for(Af=0,d=Ae.length;Af<d;Af++){if(Ae[Af].el===Ag){Ae.splice(Af,1);return Ag}}return null},toString:function(){return"Draggable(id="+this.id+")"}}}function I(U){this.el=document.getElementById(U);this.id=U}function Q(){return{dragOverClassName:"",initCoords:function(){this.coords=this.coords||{};P.getOffsetCoords(this.el,document,this.coords);this.coords.w=this.el.clientWidth;this.coords.h=this.el.clientHeight},containsCoords:function(V){var U=this.coords,X=U.x,W=U.y;return(V.x>=X&&V.x<=X+U.w)&&(V.y>=W&&V.y<=W+U.h)},ondragover:false,ondragout:B,ondrop:B}}})();