APE.namespace("APE.drag");(function(){var M=self.APE,P=M.dom,D=P.getStyle,O=M.drag,T=P.Event,R=1000,S={},B,C=Function.prototype,K=self.parseInt,N,H="function",G=M.createFactory(A,F),E=M.createFactory(I,Q);O.Draggable=G;O.DropTarget=E;G.instanceDestructor=L;function A(Z,U){var X=document,V=X.getElementById(Z),Y,W;this.id=Z;this.el=this.origEl=V;this.style=V.style;this.isRel=D(V,"position").toLowerCase()=="relative";Y=(this.isRel?V.parentNode:P.getContainingBlock(V));if(Y===null){Y=X.documentElement}this.container=Y;this.dropTargets=[];this.handle=V;this.onbeforeexitcontainer=J;if(U){for(W in U){this[W]=U[W]}V.style.zIndex=K(D(V,"zIndex"),10)||R++}}function J(){return !this.keepInContainer}function L(){var U,W,V;for(U in this.instances){V=this.instances[U];for(W in V){delete V[W]}delete this.instances[U]}S={}}function F(){var Ac=document,Y=M.EventPublisher,Ae=Y.add,AO=T.preventDefault,AM="documentElement",k=Ac[AM].style,j="px",m="left",y="top",Aa=false,c=0,a=0,AK,AC=false,V=false,AY=false,r=25,AD=-1,i="onmousedown",U="onmousemove",Ad="onmouseup",AG,AH,AT=T.getCoords;if("ontouchstart" in Ac){AG=true;i="ontouchstart";U="ontouchmove";Ad="ontouchend";Ae(Ac,"ontouchcancel",AX)}AH=Y.get(Ac,i);if("pixelLeft" in k){j=0;m="pixelLeft";y="pixelTop"}Ae(Ac,"onkeydown",AX);Ae(Ac,U,AA);Ae(self,U,function(d){d.preventDefault()});Ae(Ac,Ad,h);AW(Ac,k);AH.add(o).addAfter(g);Ac=k=null;function AW(Am,Al){var Aj="serSelect",An="MozU"+Aj,Ak="MozU"+Aj,Ag="u"+Aj,Ai=An in k?An:Ak in k?Ak:Ag in k?Ag:"",d="onselectstart";if(d in Ac){Ae(Ac,d,Ah)}else{AH.addAfter(Ah)}function Ah(Ap){var Ao=!AK;if(Ai){this[AM].style[Ai]=Ao?"":"none"}else{(Ap||window.event||0).returnValue=Ao}}}function AR(d,Ag){return Ag===d.handle||(d.useHandleTree&&P.contains(d.handle,Ag))}function AZ(d,Ag){if(Ag){if(d.selectedClassName){P.addClass(d.el,d.selectedClassName)}if(d.dragMultiple&&!(d.id in S)){S[d.id]=d}}else{if(d.selectedClassName){P.removeClass(d.el,d.selectedClassName)}delete S[d.id]}d.isSelected=Ag}function w(Am){var Ag=Am.container,Aj=Am.el,An=document,Ai=An.documentElement,Al=P.getContainingBlock(Aj)||Ai,Ak,Ao,Ar=(Al===Ag)?{x:0,y:0}:P.getOffsetCoords(Al,Ag),Ah=P.getPixelCoords(Aj),As=P.getOffsetCoords(Aj,Aj.parentNode),Aq=As.x-Ah.x+Ar.x,Ap=As.y-Ah.y+Ar.y;if(Am.keepInContainer){if(Ag===An.body){Ak=K(D(Ag,"width"),10);Ao=K(D(Ag,"height"),10)}else{Ak=Ag.clientWidth;Ao=Ag.clientHeight}Am.minX=0-Aq;Am.maxX=Ak-Aj.offsetWidth-Aq;Am.minY=0-Ap;Am.maxY=Ao-Aj.offsetHeight-Ap}}function AJ(){s(AZ,[false],true);V=false}function X(Ai){AE(AK);var Ah,Ag,d;if(AC!==false){for(Ag=0,d=AC.length;Ag<d;Ag++){Ah=AC[Ag];if(Ah.hasDropTargetOver){if(typeof Ah.ondragout==H){Ah.ondragout(Ai,AK)}if(Ah.dragOverClassName){P.removeClass(Ah.el,Ah.dragOverClassName)}Ah.hasDropTargetOver=false}}}s(AE)}function Z(d,Ag){if(d.activeDragClassName){P.removeClass(d.el,d.activeDragClassName)}AL(d);d.hasBeenDragged=false}function AU(d){if(AK.hasBeenDragged){if(AK.dragMultiple){S[AK.id]=AK}else{S={}}}Aa=false;AK=null}function n(d,Ag){if(Ag){if(d.id in S){AZ(d,false)}else{AZ(d,true)}}else{if(!d.isSelected){AJ();AZ(d,true)}}}function e(d){var Ag=d.el,Ah=d.copyEl;if(!Ah){Ah=d.copyEl=document.getElementById(d.proxyId)}AQ(d,Ah,Ag)}function AN(d){if(!d.copyEl){d.copyEl=d.el.cloneNode(true);d.copyEl.id+="Copy"}AQ(d,d.copyEl,d.el)}function AQ(Ag,Aj,Ai){var d=Aj.style;Ag.origEl=Ai;d.zIndex=K(Ai.style.zIndex,10)+100;if(Ag.origClassName){P.addClass(Ai,Ag.origClassName)}Ag.el=Aj;Ag.style=d;var Ah=D(Ai,"display");d.display=Ah;if(Ag.dragCopy){Ai.parentNode.insertBefore(Aj,Ai);if(Ag.isRel){u(d,Ai,Ah)}}else{AI(Ag,Aj,Ai)}}function AI(d,Ai,Ah){var Ag=P.getOffsetCoords(Ah,Ai.parentNode);d.moveToX(Ag.x);d.moveToY(Ag.y)}function u(d,Ah,Ag){if(Ag=="inline"){d.marginRight=-Ah.offsetWidth+-(K(D(Ah,"marginRight"),10)||0)+"px"}else{d.marginBottom=-Ah.offsetHeight+-(K(D(Ah,"marginBottom"),10)||0)+"px"}}function Af(d){d.el=d.origEl;d.style=d.el.style;d.moveToX(d.x);d.moveToY(d.y);if(d.copyEl){d.copyEl.style.display="none"}if(d.origClassName){P.removeClass(d.el,d.origClassName)}if(d.dragCopy&&!d.proxyId){d.el.parentNode.insertBefore(d.copyEl,d.el)}}function AS(Ag,d){if(!V||AY){return}s(AV,[Ag,d])}function AV(Ah,Ag,d){if(typeof Ag=="number"){Ah.moveToX(Ah.origX+Ag)}if(typeof d=="number"){Ah.moveToY(Ah.origY+d)}}function l(d,Ag){if(d.isBeingDragged){return}if(d.dragCopy&&!d.proxyId){AN(d)}if(typeof d.ondragstart==H){d.ondragstart(b(d,Ag))}if(d.activeDragClassName){P.addClass(d.el,d.activeDragClassName)}w(d);d.isBeingDragged=true}function b(d,Ai){var Aj=d.id,Ah={},Ag=1;Ah[Aj]=d;if(V){for(Aj in S){Ah[Aj]=S[Aj];Ag++}}return{domEvent:Ai,draggableList:Ah,count:Ag}}function o(Ak){if(N){N=false;return}var d=Ak||window.event;if(AG&&AK){return}Ak=f(Ak,"touches");var Aj=T.getTarget(d),Ai=G.instances,Ah,Ag=Aj,Al=Ak.metaKey||Ak.ctrlKey;while(!Ah&&Ag!==null){Ah=Ai[Ag.id];Ag=P.findAncestorWithAttribute(Ag,"id")}if(Ah){if(!Ah.isDragEnabled){if(!Al){AJ()}return false}if(!Al&&Ah.hasHandleSet&&!AR(Ah,Aj)){AJ();Ah=null;return}else{if(!Al&&!Ah.isSelected){AJ()}Ak.returnValue=false}}else{if(!Al){AJ();if(AK){AZ(AK,false);AK=null}}return}if(Al&&AK&&!Ah.dragMultiple){Aa=true;return false}if(!Ah.dragMultiple){if(!Al){AJ()}else{Aa=true;return false}}n(Ah,Al);Ah.style.zIndex=++R;if(Ab(Ah,Ak)==false){return}AK=Ah;AO(d);s(Ab,[Ak]);return Aj.tagName!=="IMG"}function g(){if(!AK){return}AC=[];var Ai=AK.dropTargets,Ah,Ag=0,d=Ai.length;for(;Ag<d;Ag++){Ah=Ai[Ag];Ah.initCoords();if(typeof Ah.ondragover==H||typeof Ah.ondragout==H||Ah.dragOverClassName){AC.push(Ah)}}if(AC.length===0){AC=false}}function Ab(d,Ai){if(typeof d.onbeforedragstart==H&&d.onbeforedragstart(b(d,Ai))==false){return false}var Ah=AT(Ai),Ag;if(d.proxyId&&!d.dragCopy){e(d)}v(d);c=Ah.x;a=Ah.y;Ag=P.getPixelCoords(d.el);d.origX=d.grabX=Ag.x;d.origY=d.grabY=Ag.y;d.isBeingDragged=false}function v(d){var Ag=d.constraint;if(Ag=="y"){d.moveToX=C}else{if(Ag=="x"){d.moveToY=C}}}function AL(d){delete d.moveToX;delete d.moveToY}function AA(As){if(!AK){return}var Ah=+new Date,Al;if(Ah-AD<r){return}AD=Ah;Al=As=As||event;if(AG){As=As.touches&&As.touches[0];if(!As){return}AO(Al)}var Ak=AT(As),Ar=Ak.x,Ao=Ak.y,An=Ar-c,Am=Ao-a,Aj=false,Au=AK.origX+An,At=AK.origY+Am,Ap;if(AK.isBeingDragged===false){AY=!!AK.proxyId;for(Ap in S){V=true;break}delete S[AK.id];l(AK,As);if(AK.proxyId&&AK.dragCopy){e(AK)}s(l,[As])}AK.hasBeenDragged=(AK.hasBeenDragged||!!(An||Am));var Ai=Au<AK.minX,Ag=Au>AK.maxX,Ax=At<AK.minY,Aq=At>AK.maxY,d=AK.container!=null,Aw=(typeof AK.ondrag==H),Av=0;if(typeof AK.onbeforedrag==H&&AK.onbeforedrag(As)==false){return}d&=(Ai||Ag||Ax||Aq);if(d&&AK.onbeforeexitcontainer()==false){if(Ai){if(!AK.isAtLeft){AK.moveToX(AK.minX);AS(AK.minX-AK.origX,null);if(Aw){AK.ondrag(As)}AK.isAtRight=false;AK.isAtLeft=true}Av+=1}else{if(Ag){if(!AK.isAtRight){AK.moveToX(AK.maxX);AS(AK.maxX-AK.origX,null);if(Aw){AK.ondrag(As)}AK.isAtRight=true;AK.isAtLeft=false}Av+=1}else{AK.isAtLeft=AK.isAtRight=false;AK.moveToX(Au);AS(An,null)}}if(Ax){if(!AK.isAtTop){AK.moveToY(AK.minY);AS(null,AK.minY-AK.origY);if(Aw){AK.ondrag(As)}AK.isAtTop=true;AK.isAtBottom=false}Av+=1}else{if(Aq){if(!AK.isAtBottom){if(AK.maxY>0){AK.moveToY(AK.maxY)}AS(null,AK.maxY-AK.origY);if(Aw){AK.ondrag(As)}AK.isAtTop=false;AK.isAtBottom=true}Av+=1}else{AK.isAtTop=AK.isAtBottom=false;AK.moveToY(At);AS(null,Am)}}Aj=Av==2;if(Aj){AK.ondragstop(As)}else{if(Aw){AK.ondrag(As)}}}else{AK.isAtLeft=AK.isAtRight=AK.isAtTop=AK.isAtBottom=false;AK.moveToX(Au);AK.moveToY(At);AS(An,Am);if(Aw){AK.ondrag(As)}}if(AC!==false){z(AK,As,Ar,Ao)}return false}function h(Ag){N=false;if(!AK){return}var d=AK.hasBeenDragged,Ah=(AK.isBeingDragged&&!d);if(!AK.hasBeenDragged&&!Ah){if(!Aa){AK=null}return}Ag=f(Ag,"changedTouches");if(!AY){s(q)}s(Af);Af(AK);p(Ag);s(Z,[Ag]);S[AK.id]=AK;Z(AK,Ag);AK.ondragend({domEvent:Ag,draggableList:S});if(AK){AU(Ag)}}function q(Ag){var Ah=Ag,d=Ah.x,Ai=Ah.y;if(d<Ah.minX){Ah.moveToX(Ah.minX)}else{if(d>Ah.maxX){Ah.moveToX(Ah.maxX)}}if(Ai<Ah.minY){Ah.moveToY(Ah.minY)}else{if(Ai>Ah.maxY){Ah.moveToY(Ah.maxY)}}}function s(Ai,Ag,Ah){if(!V&&!Ah){return}var Aj,d;Ag=Ag||[];Ag.unshift(0);for(Aj in S){d=Ag[0]=S[Aj];Ai.apply(d,Ag)}}function AX(d){if(!AK){return}d=d||event;if(d.keyCode==27||d.type==="touchcancel"){AK.release(d)}}function z(An,Al,Ah,d){var Ao={x:Ah,y:d},Ak=0,Aj=AC.length,Ag,Ai,Am={domEvent:Al,dragObj:An};for(;Ak<Aj;Ak++){Ag=AC[Ak];Ai=Ag.containsCoords(Ao);if(!Ag.hasDropTargetOver&&Ai){Ag.hasDropTargetOver=true;if(typeof Ag.ondragover==H){Ag.ondragover(Am)}if(Ag.dragOverClassName){P.addClass(Ag.el,Ag.dragOverClassName)}}else{if(Ag.hasDropTargetOver&&!Ai){if(typeof Ag.ondragout==H){Ag.ondragout(Am)}if(Ag.dragOverClassName){P.removeClass(Ag.el,Ag.dragOverClassName)}Ag.hasDropTargetOver=false}}}}function p(Ai){var Ag=AK.dropTargets,Al,Aj,d=Ag.length,Ah,Ak;if(d){Aj=AT(Ai);for(Ah=0;Ah<d;Ah++){Al=Ag[Ah];if(typeof Al.ondrop===H&&Al.containsCoords(Aj)){Al.ondrop(AF(Ai,AK));s(AB,[Al,Ai])}Ak=Al.dragOverClassName;if(Ak){P.removeClass(Al.el,Ak)}}}}function AF(Ag,d){return{domEvent:Ag,dragObj:d}}function AB(d,Ah,Ag){if(d.id!==Ah.id){Ah.ondrop(AF(Ag,d))}}function f(Ag,d){return Ag&&Ag[d]&&Ag[d][0]||Ag||event}function t(Ag){var Ah=M.anim,d=new Ah.Animation(0.2);d.transition=Ah.Transitions.accel;d.run=x;d.dObj=Ag;d.onplay=Ag.onglide;d.onend=W;d.start()}function x(Ai){var Ag=this.dObj,Ah=Ag.x-Ag.grabX,d=Ag.y-Ag.grabY;Ai=Math.pow(Ai,3);Ag.moveToX(Ag.x-(Ah*Ai));Ag.moveToY(Ag.y-(d*Ai))}function W(){AP(this.dObj)}function AP(d){if(typeof d.onglideend==H){d.onglideend()}Af(d)}function AE(d){if(M.anim&&d.useAnim){t(d)}else{d.moveToX(d.grabX);d.moveToY(d.grabY);if(typeof d.onglide==H){d.onglide()}AP(d,{})}}return{dragCopy:false,useAnim:true,dragMultiple:false,selectedClassName:"",activeDragClassName:"",useHandleTree:true,isSelected:false,onbeforedrag:B,onbeforedragstart:C,ondragstart:B,ondrag:B,ondragstop:C,ondragend:C,x:0,y:0,origX:0,origY:0,grabX:0,grabY:0,keepInContainer:false,isDragEnabled:true,hasHandleSet:false,setHandle:function(d,Ag){this.handle=d;this.hasHandleSet=true;this.useHandleTree=Ag!=false},dropTargets:false,addDropTarget:function(Ai){var Ag=E.getByNode(Ai),d=Ag.el,Ah=this.dropTargets;if(this.el===d){return Ag}return Ah[Ah.length]=E.getByNode(d)},grab:function(Am,Ao,Ai){Am=Am||window.event;var An=T.getTarget(Am),Ah;AO(Am);if(P.contains(this.el,An)){return}Ah=P.getPixelCoords(this.el);this.grabX=Ah.x;this.grabY=Ah.y;var Ap=AT(Am),Al=this.handle,Ag=P.getOffsetCoords(P.getContainingBlock(this.el)),Ak=Ap.x-Ag.x,d=Ak-(0|Al.offsetWidth/2),Aj=Ap.y-Ag.y,Ar=(Aj-(0|Al.offsetHeight/2)),Aq=P.getOffsetCoords(Al,this.el);if(this.keepInContainer){d=Math.max(d,0);d=Math.min(d,this.container.clientWidth-this.el.offsetWidth);Ar=Math.max(Ar,0);Ar=Math.min(Ar,this.container.clientHeight-this.el.offsetHeight)}this.moveToX(d-Aq.x+(Ao||0));this.moveToY(Ar-Aq.y+(Ai||0));Ab(this,Am);N=true;AK=this},release:function(d){d=d||{};s(Z,[d]);if(typeof this.onrelease==H){this.onrelease(d)}X(d);AU(d)},moveToX:function(d){this.style[m]=(this.x=d)+j},moveToY:function(d){this.style[y]=(this.y=d)+j},removeDropTarget:function(Ai){var Ai=document.getElementById(Ai.id),Ag=this.dropTargets,Ah,d;for(Ah=0,d=Ag.length;Ah<d;Ah++){if(Ag[Ah].el===Ai){Ag.splice(Ah,1);return Ai}}return null},toString:function(){return"Draggable(id="+this.id+")"}}}function I(U){this.el=document.getElementById(U);this.id=U}function Q(){return{dragOverClassName:"",initCoords:function(){var V=this.coords||(this.coords={}),U=this.el;P.getOffsetCoords(U,document,V);V.w=U.clientWidth;V.h=U.clientHeight},containsCoords:function(V){var U=this.coords,X=U.x,W=U.y;return(V.x>=X&&V.x<=X+U.w)&&(V.y>=W&&V.y<=W+U.h)},ondragover:false,ondragout:B,ondrop:B}}})();