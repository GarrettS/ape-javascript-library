APE.namespace("APE.drag");(function(){var M=self.APE,P=M.dom,D=P.getStyle,O=M.drag,T=P.Event,R=1000,S={},B,C=Function.prototype,K=self.parseInt,N,H="function",G=M.createFactory(A,F),E=M.createFactory(I,Q);O.Draggable=G;O.DropTarget=E;G.instanceDestructor=L;function A(Z,U){var X=document,V=X.getElementById(Z),Y,W;this.id=Z;this.el=this.origEl=V;this.style=V.style;this.isRel=D(V,"position").toLowerCase()=="relative";Y=(this.isRel?V.parentNode:P.getContainingBlock(V));if(Y===null){Y=X.documentElement}this.container=Y;this.dropTargets=[];this.handle=V;this.onbeforeexitcontainer=J;if(U){for(W in U){this[W]=U[W]}V.style.zIndex=K(D(V,"zIndex"),10)||R++}}function J(){return !this.keepInContainer}function L(){var U,W,V;for(U in this.instances){V=this.instances[U];for(W in V){delete V[W]}delete this.instances[U]}S={}}function F(){var Ab=document,Y=M.EventPublisher,Ad=Y.add,AP=T.preventDefault,AN="documentElement",k=Ab[AN].style,AH="serSelect",Ae="MozU"+AH,s="MozU"+AH,AL="u"+AH,AB=Ae in k?Ae:s in k?s:AL in k?AL:"",j="px",n="left",y="top",AZ=false,e=0,a=0,AK,AC=false,V=false,AX=false,r=25,AD=-1,i="onmousedown",U="onmousemove",Ac="onmouseup",AF,AG,AU=T.getCoords;if("ontouchstart" in Ab){AF=true;i="ontouchstart";U="ontouchmove";Ac="ontouchend";Ad(Ab,"ontouchcancel",AW)}AG=Y.get(Ab,i);if("onselectstart" in Ab){Ad(Ab,"onselectstart",o)}else{AG.addAfter(o)}if("pixelLeft" in k){j=0;n="pixelLeft";y="pixelTop"}AG.add(p).addAfter(g);Ad(Ab,"onkeydown",AW);Ad(Ab,U,AA);Ad(self,U,function(d){d.preventDefault()});Ad(Ab,Ac,h);Ab=k=null;function o(Ag){var d=!AK;if(AB){this[AN].style[AB]=d?"":"none"}else{Ag=Ag||event;Ag.returnValue=d}}function AS(d,Ag){return Ag===d.handle||(d.useHandleTree&&P.contains(d.handle,Ag))}function AY(d,Ag){if(Ag){if(d.selectedClassName){P.addClass(d.el,d.selectedClassName)}if(d.dragMultiple&&!(d.id in S)){S[d.id]=d}}else{if(d.selectedClassName){P.removeClass(d.el,d.selectedClassName)}delete S[d.id]}d.isSelected=Ag}function w(Am){var Ag=Am.container,Aj=Am.el,An=document,Ai=An.documentElement,Al=P.getContainingBlock(Aj)||Ai,Ak,Ao,Ar=(Al===Ag)?{x:0,y:0}:P.getOffsetCoords(Al,Ag),Ah=P.getPixelCoords(Aj),As=P.getOffsetCoords(Aj,Aj.parentNode),Aq=As.x-Ah.x+Ar.x,Ap=As.y-Ah.y+Ar.y;if(Am.keepInContainer){if(Ag===An.body){Ak=K(D(Ag,"width"),10);Ao=K(D(Ag,"height"),10)}else{Ak=Ag.clientWidth;Ao=Ag.clientHeight}Am.minX=0-Aq;Am.maxX=Ak-Aj.offsetWidth-Aq;Am.minY=0-Ap;Am.maxY=Ao-Aj.offsetHeight-Ap}}function AJ(){for(var d in S){AY(S[d],false)}V=false}function X(Ai){AE(AK);var Ah,Ag,d,Aj;if(AC!==false){for(Ag=0,d=AC.length;Ag<d;Ag++){Ah=AC[Ag];if(Ah.hasDropTargetOver){if(typeof Ah.ondragout==H){Ah.ondragout(Ai,AK)}if(Ah.dragOverClassName){P.removeClass(Ah.el,Ah.dragOverClassName)}Ah.hasDropTargetOver=false}}}for(Aj in S){if(Aj!==AK.id){AE(S[Aj])}}}function Z(d,Ag){if(d.activeDragClassName){P.removeClass(d.el,d.activeDragClassName)}AM(d);if(d.copyEl){Af(d)}if(d===AK){if(Ag.type!=="keyup"){q(Ag)}AV(Ag)}d.hasBeenDragged=false}function AV(d){if(AK.hasBeenDragged){if(AK.dragMultiple){S[AK.id]=AK}else{S={}}if(d&&d.type){AK.ondragend({domEvent:d,draggableList:S})}}AZ=false;AK=null}function m(d,Ag){if(Ag){if(d.id in S){AY(d,false)}else{AY(d,true)}}else{if(!d.isSelected){AJ();AY(d,true)}}}function c(d){var Ag=d.el,Ah=d.copyEl;if(!Ah){Ah=d.copyEl=document.getElementById(d.proxyId)}AR(d,Ah,Ag)}function AO(d){if(!d.copyEl){d.copyEl=d.el.cloneNode(true);d.copyEl.id+="Copy"}AR(d,d.copyEl,d.el)}function AR(Ag,Aj,Ai){var d=Aj.style;Ag.origEl=Ai;d.zIndex=K(Ai.style.zIndex,10)+100;if(Ag.origClassName){P.addClass(Ai,Ag.origClassName)}Ag.el=Aj;Ag.style=d;var Ah=D(Ai,"display");d.display=Ah;if(Ag.dragCopy){Ai.parentNode.insertBefore(Aj,Ai);if(Ag.isRel){u(d,Ai,Ah)}}else{AI(Ag,Aj,Ai)}}function AI(d,Ai,Ah){var Ag=P.getOffsetCoords(Ah,Ai.parentNode);d.moveToX(Ag.x);d.moveToY(Ag.y)}function u(d,Ah,Ag){if(Ag=="inline"){d.marginRight=-Ah.offsetWidth+-(K(D(Ah,"marginRight"),10)||0)+"px"}else{d.marginBottom=-Ah.offsetHeight+-(K(D(Ah,"marginBottom"),10)||0)+"px"}}function Af(d){d.el=d.origEl;d.style=d.el.style;d.moveToX(d.x);d.moveToY(d.y);d.copyEl.style.display="none";if(d.origClassName){P.removeClass(d.el,d.origClassName)}if(d.dragCopy&&!d.proxyId){d.el.parentNode.insertBefore(d.copyEl,d.el)}}function AT(Ag,d){if(!V||AX){return}var Ah,Ai;for(Ai in S){Ah=S[Ai];if(typeof Ag=="number"){Ah.moveToX(Ah.origX+Ag)}if(typeof d=="number"){Ah.moveToY(Ah.origY+d)}}}function l(d,Ag){if(d.isBeingDragged){return}if(d.dragCopy&&!d.proxyId){AO(d)}if(typeof d.ondragstart==H){d.ondragstart(b(d,Ag))}if(d.activeDragClassName){P.addClass(d.el,d.activeDragClassName)}w(d);d.isBeingDragged=true}function b(d,Ai){var Aj=d.id,Ah={},Ag=1;Ah[Aj]=d;if(V){for(Aj in S){Ah[Aj]=S[Aj];Ag++}}return{domEvent:Ai,draggableList:Ah,count:Ag}}function p(Ak){if(N){N=false;return}var d=Ak||event;if(AF&&AK){return}Ak=f(Ak,"touches");var Aj=T.getTarget(d),Am,Ai=G.instances,Ah,Ag=Aj,Al=Ak.metaKey||Ak.ctrlKey;while(!Ah&&Ag!==null){Ah=Ai[Ag.id];Ag=P.findAncestorWithAttribute(Ag,"id")}if(Ah){if(!Ah.isDragEnabled){if(!Al){AJ()}return false}if(!Al&&Ah.hasHandleSet&&!AS(Ah,Aj)){AJ();Ah=null;return}else{if(!Al&&!Ah.isSelected){AJ()}Ak.returnValue=false}}else{if(!Al){AJ();if(AK){AY(AK,false);AK=null}}return}if(Al&&AK&&!Ah.dragMultiple){AZ=true;return false}if(!Ah.dragMultiple){if(!Al){AJ()}else{AZ=true;return false}}m(Ah,Al);Ah.style.zIndex=++R;if(Aa(Ak,Ah)==false){return}AK=Ah;AP(d);for(Am in S){Aa(Ak,S[Am])}return Aj.tagName!=="IMG"}function g(){if(!AK){return}AC=[];var Ai=AK.dropTargets,Ah,Ag=0,d=Ai.length;for(;Ag<d;Ag++){Ah=Ai[Ag];Ah.initCoords();if(typeof Ah.ondragover==H||typeof Ah.ondragout==H||Ah.dragOverClassName){AC.push(Ah)}}if(AC.length===0){AC=false}}function Aa(Ai,d){if(typeof d.onbeforedragstart==H&&d.onbeforedragstart(b(d,Ai))==false){return false}var Ah=AU(Ai),Ag;if(d.proxyId&&!d.dragCopy){c(d)}v(d);e=Ah.x;a=Ah.y;Ag=P.getPixelCoords(d.el);d.origX=d.grabX=Ag.x;d.origY=d.grabY=Ag.y;d.isBeingDragged=false}function v(d){var Ag=d.constraint;if(Ag=="y"){d.moveToX=C}else{if(Ag=="x"){d.moveToY=C}}}function AM(d){delete d.moveToX;delete d.moveToY}function AA(As){if(!AK){return}var Ah=+new Date,Al;if(Ah-AD<r){return}AD=Ah;Al=As=As||event;if(AF){As=As.touches&&As.touches[0];if(!As){return}AP(Al)}var Ak=AU(As),Ar=Ak.x,Ao=Ak.y,An=Ar-e,Am=Ao-a,Aj=false,Au=AK.origX+An,At=AK.origY+Am,Ap;if(AK.isBeingDragged===false){AX=!!AK.proxyId;for(Ap in S){V=true;break}delete S[AK.id];l(AK,As);if(AK.proxyId&&AK.dragCopy){c(AK)}for(Ap in S){l(S[Ap],As)}}AK.hasBeenDragged=(AK.hasBeenDragged||!!(An||Am));var Ai=Au<AK.minX,Ag=Au>AK.maxX,Ax=At<AK.minY,Aq=At>AK.maxY,d=AK.container!=null,Aw=(typeof AK.ondrag==H),Av=0;if(typeof AK.onbeforedrag==H&&AK.onbeforedrag(As)==false){return}d&=(Ai||Ag||Ax||Aq);if(d&&AK.onbeforeexitcontainer()==false){if(Ai){if(!AK.isAtLeft){AK.moveToX(AK.minX);AT(AK.minX-AK.origX,null);if(Aw){AK.ondrag(As)}AK.isAtRight=false;AK.isAtLeft=true}Av+=1}else{if(Ag){if(!AK.isAtRight){AK.moveToX(AK.maxX);AT(AK.maxX-AK.origX,null);if(Aw){AK.ondrag(As)}AK.isAtRight=true;AK.isAtLeft=false}Av+=1}else{AK.isAtLeft=AK.isAtRight=false;AK.moveToX(Au);AT(An,null)}}if(Ax){if(!AK.isAtTop){AK.moveToY(AK.minY);AT(null,AK.minY-AK.origY);if(Aw){AK.ondrag(As)}AK.isAtTop=true;AK.isAtBottom=false}Av+=1}else{if(Aq){if(!AK.isAtBottom){if(AK.maxY>0){AK.moveToY(AK.maxY)}AT(null,AK.maxY-AK.origY);if(Aw){AK.ondrag(As)}AK.isAtTop=false;AK.isAtBottom=true}Av+=1}else{AK.isAtTop=AK.isAtBottom=false;AK.moveToY(At);AT(null,Am)}}Aj=Av==2;if(Aj){AK.ondragstop(As)}else{if(Aw){AK.ondrag(As)}}}else{AK.isAtLeft=AK.isAtRight=AK.isAtTop=AK.isAtBottom=false;AK.moveToX(Au);AK.moveToY(At);AT(An,Am);if(Aw){AK.ondrag(As)}}if(AC!==false){z(AK,As,Ar,Ao)}return false}function h(Ah){N=false;if(!AK){return}var Ag=AK.hasBeenDragged,Al=(AK.isBeingDragged&&!Ag),Ak,Ai,d,Aj;if(!AK.hasBeenDragged&&!Al){if(!AZ){AK=null}return}Ah=f(Ah,"changedTouches");if(V&&!AX){for(Ak in S){Ai=S[Ak];d=Ai.x;Aj=Ai.y;if(d<Ai.minX){Ai.moveToX(Ai.minX)}else{if(d>Ai.maxX){Ai.moveToX(Ai.maxX)}}if(Aj<Ai.minY){Ai.moveToY(Ai.minY)}else{if(Aj>Ai.maxY){Ai.moveToY(Ai.maxY)}}}}for(Ak in S){Z(S[Ak],Ah)}Z(AK,Ah)}function AW(d){if(!AK){return}d=d||event;if(d.keyCode==27||d.type==="touchcancel"){AK.release(d)}}function z(An,Al,Ah,d){var Ao={x:Ah,y:d},Ak=0,Aj=AC.length,Ag,Ai,Am={domEvent:Al,dragObj:An};for(;Ak<Aj;Ak++){Ag=AC[Ak];Ai=Ag.containsCoords(Ao);if(!Ag.hasDropTargetOver&&Ai){Ag.hasDropTargetOver=true;if(typeof Ag.ondragover==H){Ag.ondragover(Am)}if(Ag.dragOverClassName){P.addClass(Ag.el,Ag.dragOverClassName)}}else{if(Ag.hasDropTargetOver&&!Ai){if(typeof Ag.ondragout==H){Ag.ondragout(Am)}if(Ag.dragOverClassName){P.removeClass(Ag.el,Ag.dragOverClassName)}Ag.hasDropTargetOver=false}}}}function q(Ai){var Ag=AK.dropTargets,Am,Aj,d=Ag.length,Ah,Al,Ak;if(d>0){Aj=AU(Ai);for(Ah=0;Ah<d;Ah++){Am=Ag[Ah];if(Am.containsCoords(Aj)){if(typeof Am.ondrop==H){Am.ondrop({domEvent:Ai,dragObj:AK,dropTarget:Am})}if(V){for(Al in S){if(Al===Am.id){continue}if(typeof Am.ondrop==H){Ak=S[Al];Am.ondrop({domEvent:Ai,dragObj:Ak,dropTarget:Am})}}}if(Am.dragOverClassName){P.removeClass(Am.el,Am.dragOverClassName)}break}}}}function f(Ag,d){return Ag&&Ag[d]&&Ag[d][0]||Ag||event}function t(Ag){var Ah=M.anim,d=new Ah.Animation(0.2);d.transition=Ah.Transitions.accel;d.run=x;d.dObj=Ag;d.onplay=Ag.onglide;d.onend=W;d.start()}function x(Ai){var Ag=this.dObj,Ah=Ag.x-Ag.grabX,d=Ag.y-Ag.grabY;Ai=Math.pow(Ai,3);Ag.moveToX(Ag.x-(Ah*Ai));Ag.moveToY(Ag.y-(d*Ai))}function W(){AQ(this.dObj)}function AQ(d){if(typeof d.onglideend==H){d.onglideend()}if(d.copyEl){d.el=d.origEl;d.style=d.origEl.style;d.copyEl.style.display="none"}Z(d,{})}function AE(d){if(M.anim&&d.useAnim){t(d)}else{d.moveToX(d.grabX);d.moveToY(d.grabY);if(typeof d.onglide==H){d.onglide()}AQ(d,{})}}return{dragCopy:false,useAnim:true,dragMultiple:false,selectedClassName:"",activeDragClassName:"",useHandleTree:true,isSelected:false,onbeforedrag:B,onbeforedragstart:C,ondragstart:B,ondrag:B,ondragstop:C,ondragend:C,x:0,y:0,origX:0,origY:0,grabX:0,grabY:0,keepInContainer:false,isDragEnabled:true,hasHandleSet:false,setHandle:function(d,Ag){this.handle=d;this.hasHandleSet=true;this.useHandleTree=Ag!=false},dropTargets:false,addDropTarget:function(Ai){var Ag=E.getByNode(Ai),d=Ag.el,Ah=this.dropTargets;if(this.el===d){return Ag}return Ah[Ah.length]=E.getByNode(d)},grab:function(Am,Ao,Ai){Am=Am||event;var An=T.getTarget(Am),Ah;AP(Am);if(P.contains(this.el,An)){return}Ah=P.getPixelCoords(this.el);this.grabX=Ah.x;this.grabY=Ah.y;var Ap=AU(Am),Al=this.handle,Ag=P.getOffsetCoords(P.getContainingBlock(this.el)),Ak=Ap.x-Ag.x,d=Ak-(0|Al.offsetWidth/2),Aj=Ap.y-Ag.y,Ar=(Aj-(0|Al.offsetHeight/2)),Aq=P.getOffsetCoords(Al,this.el);if(this.keepInContainer){d=Math.max(d,0);d=Math.min(d,this.container.clientWidth-this.el.offsetWidth);Ar=Math.max(Ar,0);Ar=Math.min(Ar,this.container.clientHeight-this.el.offsetHeight)}this.moveToX(d-Aq.x+(Ao||0));this.moveToY(Ar-Aq.y+(Ai||0));Aa(Am,this);N=true;AK=this},release:function(d){X(d);if(typeof this.onrelease==H){this.onrelease(d)}},moveToX:function(d){this.style[n]=(this.x=d)+j},moveToY:function(d){this.style[y]=(this.y=d)+j},removeDropTarget:function(Ai){var Ai=document.getElementById(Ai.id),Ag=this.dropTargets,Ah,d;for(Ah=0,d=Ag.length;Ah<d;Ah++){if(Ag[Ah].el===Ai){Ag.splice(Ah,1);return Ai}}return null},toString:function(){return"Draggable(id="+this.id+")"}}}function I(U){this.el=document.getElementById(U);this.id=U}function Q(){return{dragOverClassName:"",initCoords:function(){this.coords=this.coords||{};P.getOffsetCoords(this.el,document,this.coords);this.coords.w=this.el.clientWidth;this.coords.h=this.el.clientHeight},containsCoords:function(V){var U=this.coords,X=U.x,W=U.y;return(V.x>=X&&V.x<=X+U.w)&&(V.y>=W&&V.y<=W+U.h)},ondragover:false,ondragout:B,ondrop:B}}})();(function(){var B=self.APE,F=B.drag,C=B.dom,E=F.Slider=B.createFactory(A,G),J=1,D=2,H="minValue",I="maxValue";E.direction={HORZ:J,VERT:D};function A(O,K,M,N){this.id=O;this.dir=K;this.value=0;this.rationalValue=0;var L=F.Draggable.getById(O,K);L.keepInContainer=true;this.handle=L;this[H]=M||0;this[I]=N;this.tDist=0;this.init()}function G(){B.EventPublisher.add(document,"onkeydown",R);var P="ape-slider-track-active",S=null;return{init:function(){var W=B.EventPublisher,V=document.getElementById(this.id),X=this.handle,U=this.trackbar=document.getElementById(this.id).parentNode;W.add(X,"onglideend",N,this);W.add(X,"ondragend",N,this);W.add(X,"onglideend",N,this);W.add(X,"ondrag",Q,this);if(!("focus" in X)){W.add(V,"onmousedown",L,this)}W.add(V,"onfocus",L,this);W.add(V,"onblur",K,this);W.add(X,"onglide",Q,this);W.add(X,"ondragstop",Q,this);if(this.dir===D){this.tDist=U.clientHeight-V.offsetHeight;X.moveToX=M}else{this.tDist=U.clientWidth-V.offsetWidth;X.moveToY=M}if(this[I]===undefined){this[I]=this.tDist}W.add(U,"onmousedown",T,U)},ticks:15,rationalValue:0,slideToX:function(U){this.handle.moveToX(U);if(typeof slider.onslide==="function"){slider.onslide()}},setValue:function(U){U=Math.max(this[H],U);U=Math.min(this[I],U);var V=this.handle,X=this[I]-this[H],W=(U-this[H])/X;if(!V||!V.id){return}if(this.dir===D){V.moveToY(this.tDist*(1-W))}else{V.moveToX(this.tDist*W)}this.rationalValue=W;this.value=U},slideToY:function(U){this.handle.moveToY(U);this.onslide()},setRationalValue:function(V,U){V=Math.max(0,V);V=Math.min(1,V);this.rationalValue=V;this.setValue(this[H]+(V*(this[I]-this[H])));if(U){Q.call(this,{})}},toString:function(){return"Slider: "+this.handle.toString()}};function M(){}function T(W){var V=C.Event.getTarget(W),U;if(V!==this){return true}U=E.instances[this.getElementsByTagName("*")[0].id];W=W||self.event;if(W.preventDefault){W.preventDefault()}C.addClass(this,P);U.handle.grab(W);Q.call(U,W);return false}function N(U){C.removeClass(this.trackbar,P);Q.call(this,U);if(typeof this.onslideend==="function"){this.onslideend(U)}}function L(U){S=this;C.addClass(this.trackbar,P)}function K(U){if(S===this){S=null}C.removeClass(this.trackbar,P)}function Q(X){this.value=0;var V=document.getElementById(this.id),W=0;if(this.dir===J){if(V.offsetLeft>0){W=V.offsetLeft/this.tDist}else{W=0}}else{if(V.offsetTop>0){var U=this.tDist-V.offsetTop;W=U/this.tDist}else{W=1}}this.rationalValue=W;this.value=W*(this[I]-this[H]);if(this.onslide){this.onslide(X||{})}}var O;function R(Y){Y=Y||self.event;if(Y.stopPropagation){Y.stopPropagation()}Y.cancelBubble=true;var W=+new Date,U=S;if(!U){return}if(W-O<5){return}O=W;var b=Y.keyCode,a,V=b===37,Z=b===39,c=b===38,X=b===40;if(!(V||Z||c||X)){return true}if(U.id in E.instances){a=U[I]/U.ticks;if(V||X){a=-a}U.setValue(U.value+a);if(U.onslide){U.onslide(Y)}return false}}}})();