APE.namespace("APE.drag");(function(){var K=self.APE,N=K.dom,M=K.drag,R=N.Event,P=1000,Q={},B,I=self.parseInt,L,F="function",E=K.createFactory(A,D),C=K.createFactory(G,O);M.Draggable=E;M.DropTarget=C;E.instanceDestructor=J;function A(X,S){var V=document,T=V.getElementById(X),U;this.id=X;this.el=this.origEl=T;this.style=T.style;this.isRel=N.getStyle(T,"position").toLowerCase()=="relative";var W=(this.isRel?T.parentNode:N.getContainingBlock(T));if(W===null){W=V.documentElement}this.container=W;this.dropTargets=[];this.handle=T;this.onbeforeexitcontainer=H;for(U in S){this[U]=S[U]}T.style.zIndex=I(N.getStyle(T,"zIndex"),10)||P++}function H(){return !this.keepInContainer}function J(){var S,U,T;for(S in this.instances){T=this.instances[S];for(U in T){delete T[U]}delete this.instances[S]}Q={}}function D(){var AP=document,W=K.EventPublisher,AH=R.preventDefault,AF="documentElement",g=AP[AF].style,AB="serSelect",AR="MozU"+AB,o="MozU"+AB,AE="u"+AB,v=AR in g?AR:o in g?o:AE in g?AE:"",f="px",i="left",s="top",AN=false,Z=0,Y=0,AD,w=false,T=false,n=25,x=-1,e="onmousedown",S="onmousemove",AQ="onmouseup",z,AA;getEventCoords=R.getCoords;if("ontouchstart" in AP){z=true;e="ontouchstart";S="ontouchmove";AQ="ontouchend";W.add(AP,"ontouchcancel",AL)}AA=W.get(AP,e);if("onselectstart" in AP){W.add(AP,"onselectstart",k)}else{AA.addAfter(k)}if("pixelLeft" in g){f=0;i="pixelLeft";s="pixelTop"}AA.add(l).addAfter(b);W.add(AP,"onkeydown",AL);W.add(AP,S,u);W.add(self,S,function(d){d.preventDefault()});W.add(AP,AQ,c);AP=g=null;function k(AT){var d=!AD;if(v){this[AF].style[v]=d?"":"none"}else{AT=AT||event;AT.returnValue=d}}function AJ(d,AT){return AT===d.handle||(d.useHandleTree&&N.contains(d.handle,AT))}function AM(d,AT){if(AT){if(d.selectedClassName){N.addClass(d.el,d.selectedClassName)}if(d.dragMultiple&&!(d.id in Q)){Q[d.id]=d}}else{if(d.selectedClassName){N.removeClass(d.el,d.selectedClassName)}delete Q[d.id]}d.isSelected=AT}function q(AZ){var AT=AZ.container,AW=AZ.el,Aa=document,AV=Aa.documentElement,AY=N.getContainingBlock(AW)||AV,AX,Ab,Ae=(AY===AT)?{x:0,y:0}:N.getOffsetCoords(AY,AT),AU=N.getPixelCoords(AW),Af=N.getOffsetCoords(AW,AW.parentNode),Ad=Af.x-AU.x+Ae.x,Ac=Af.y-AU.y+Ae.y;if(AZ.keepInContainer){if(AT===Aa.body){AX=I(N.getStyle(AT,"width"),10);Ab=I(N.getStyle(AT,"height"),10)}else{AX=AT.clientWidth;Ab=AT.clientHeight}AZ.minX=0-Ad;AZ.maxX=AX-AW.offsetWidth-Ad;AZ.minY=0-Ac;AZ.maxY=Ab-AW.offsetHeight-Ac}}function AC(){for(var d in Q){AM(Q[d],false)}T=false}function V(AW,d){y(d);var AX=N.removeClass,AV,AU,AT,AY;if(w!==false){for(AU=0,AT=w.length;AU<AT;AU++){AV=w[AU];if(AV.hasDropTargetOver){if(typeof AV.ondragout==F){AV.ondragout(AW,d)}if(AV.dragOverClassName){AX(AV.el,AV.dragOverClassName)}AV.hasDropTargetOver=false}}}for(AY in Q){y(Q[AY])}AD=null}function X(d,AT){if(d.activeDragClassName){N.removeClass(d.el,d.activeDragClassName)}if(typeof d.ondragend==F&&d.hasBeenDragged){d.ondragend(AT)}if(d.copyEl){d.el.parentNode.insertBefore(d.copyEl,d.el)}d.hasBeenDragged=false}function j(d,AT){if(AT){if(d.id in Q){AM(d,false)}else{AM(d,true)}}else{if(!d.isSelected){AC();AM(d,true)}}}function AG(AT){var AV="addClass",AX,AU=AT.el,AW=AU,d;if(!AT.copyEl){AT.origEl=AU;AT.copyEl=AU.cloneNode(true);AT.copyEl.id+="Copy"}AX=AT.copyEl;d=AX.style;d.display="";if(AX.parentNode!==AU.parentNode){AU.parentNode.insertBefore(AX,AU)}d.zIndex=I(AW.style.zIndex,10)+100;if(AT.origClassName){N[AV](AU,AT.origClassName)}AT.el=AX;AT.style=d;if(AT.isRel){d.marginBottom=-AW.offsetHeight+-(I(N.getStyle(AW,"marginBottom"),10)||0)+"px";d.marginright=-AW.offsetWidth+-(I(N.getStyle(AW,"marginRight"),10)||0)+"px"}}function AS(d){if(d.copyEl.style.display=="none"){return}d.el=d.origEl;d.style=d.origEl.style;d.moveToX(d.x);d.moveToY(d.y);d.copyEl.style.display="none";if(d.origClassName){N.removeClass(d.el,d.origClassName)}}function AK(AT,d){if(!T){return}var AU,AV;for(AV in Q){AU=Q[AV];if(typeof AT=="number"){AU.moveToX(AU.origX+AT)}if(typeof d=="number"){AU.moveToY(AU.origY+d)}}}function h(d,AT){if(d.isBeingDragged){return}if(d.dragCopy){AG(d)}if(typeof d.ondragstart==F){d.ondragstart(AT)}if(d.activeDragClassName){N.addClass(d.el,d.activeDragClassName)}q(d);d.isBeingDragged=true}function l(AX){if(L){L=false;return}d=AX||event;if(z&&AD){return}AX=a(AX,"touches");var d,AW=R.getTarget(d),AV=E.instances,AU,AT=AW,AY=AX.metaKey||AX.ctrlKey;while(!AU&&AT!==null){AU=AV[AT.id];AT=N.findAncestorWithAttribute(AT,"id")}if(AU){if(!AU.isDragEnabled){if(!AY){AC()}return false}if(!AY&&AU.hasHandleSet&&!AJ(AU,AW)){AC();AU=null;return}else{if(!AY&&!AU.isSelected){AC()}AX.returnValue=false}}else{if(!AY){AC();if(AD){AM(AD,false);AD=null}}return}if(AY&&AD&&!AU.dragMultiple){AN=true;return false}if(!AU.dragMultiple){if(!AY){AC()}else{AN=true;return false}}j(AU,AY);AU.style.zIndex=++P;AD=AU;AH(d);AO(AX,AU);for(var AZ in Q){AO(AX,Q[AZ])}return AW.tagName!=="IMG"}function b(){if(!AD){return}w=[];var AV=AD.dropTargets,AU,AT=0,d=AV.length;for(;AT<d;AT++){AU=AV[AT];AU.initCoords();if(typeof AU.ondragover==F||typeof AU.ondragout==F||AU.dragOverClassName){w.push(AU)}}if(w.length===0){w=false}}function AO(AV,d){if(typeof d.onbeforedragstart==F&&d.onbeforedragstart(AV)==false){return true}var AU=getEventCoords(AV),AT;Z=AU.x;Y=AU.y;AT=N.getPixelCoords(d.el);d.origX=d.grabX=AT.x;d.origY=d.grabY=AT.y;d.isBeingDragged=false}function u(Ag){if(!AD){return}var AV=+new Date,AZ;if(AV-x<n){return}x=AV;AZ=Ag=Ag||event;if(z){Ag=Ag.touches&&Ag.touches[0];if(!Ag){return}AH(AZ)}var AY=getEventCoords(Ag),Af=AY.x,Ac=AY.y,Ab=Af-Z,Aa=Ac-Y,AX=false,Ai=AD.origX+Ab,Ah=AD.origY+Aa,Ad;if(AD.isBeingDragged===false){h(AD,Ag);delete Q[AD.id];for(Ad in Q){T=true;h(Q[Ad],Ag)}}AD.hasBeenDragged=(AD.hasBeenDragged||(Ab||Aa));var AW=Ai<AD.minX,AU=Ai>AD.maxX,Al=Ah<AD.minY,Ae=Ah>AD.maxY,AT=AD.container!=null,Ak=(typeof AD.ondrag==F),d=typeof AD.onbeforeexitcontainer==F,Aj=0;if(typeof AD.onbeforedrag==F&&AD.onbeforedrag(Ag)==false){return}AT&=(AW||AU||Al||Ae);if(AT&&(d||AD.onbeforeexitcontainer()==false)){if(AW){if(!AD.isAtLeft){AD.moveToX(AD.minX);AK(AD.minX-AD.origX,null);if(Ak){AD.ondrag(Ag)}AD.isAtRight=false;AD.isAtLeft=true}Aj+=1}else{if(AU){if(!AD.isAtRight){AD.moveToX(AD.maxX);AK(AD.maxX-AD.origX,null);if(Ak){AD.ondrag(Ag)}AD.isAtRight=true;AD.isAtLeft=false}Aj+=1}else{AD.isAtLeft=AD.isAtRight=false;AD.moveToX(Ai);AK(Ab,null)}}if(Al){if(!AD.isAtTop){AD.moveToY(AD.minY);AK(null,AD.minY-AD.origY);if(Ak){AD.ondrag(Ag)}AD.isAtTop=true;AD.isAtBottom=false}Aj+=1}else{if(Ae){if(!AD.isAtBottom){if(AD.maxY>0){AD.moveToY(AD.maxY)}AK(null,AD.maxY-AD.origY);if(Ak){AD.ondrag(Ag)}AD.isAtTop=false;AD.isAtBottom=true}Aj+=1}else{AD.isAtTop=AD.isAtBottom=false;AD.moveToY(Ah);AK(null,Aa)}}AX=Aj==2;if(AX&&typeof AD.ondragstop==F){AD.ondragstop(Ag)}else{if(Ak){AD.ondrag(Ag)}}}else{AD.isAtLeft=AD.isAtRight=AD.isAtTop=AD.isAtBottom=false;AD.moveToX(Ai);AD.moveToY(Ah);AK(Ab,Aa);if(Ak){AD.ondrag(Ag)}}if(w!==false){t(AD,Ag,Af,Ac)}return false}function c(AU){L=false;if(!AD){return}var AY=(AD.isBeingDragged&&!AD.hasBeenDragged),AX,AT,AV,d,AW;if(!AD.hasBeenDragged&&!AY){if(!AN){AD=null}return}Q[AD.id]=AD;AN=false;if(AD.copyEl){AS(AD)}if(T){for(AX in Q){AT=Q[AX];if(AT.copyEl){AS(AT)}}}AU=a(AU,"changedTouches");m(AU);if(T){for(AX in Q){AV=Q[AX];d=AV.x;AW=AV.y;if(d<AV.minX){AV.moveToX(AV.minX)}else{if(d>AV.maxX){AV.moveToX(AV.maxX)}}if(AW<AV.minY){AV.moveToY(AV.minY)}else{if(AW>AV.maxY){AV.moveToY(AV.maxY)}}if(AV.hasBeenDragged){X(AV,AU)}}}X(AD,AU);AD=null}function AL(d){d=d||event;if(d.keyCode==27||d.type==="touchcancel"){if(AD){AD.release(d)}}}function t(Aa,AY,AU,d){var Ab={x:AU,y:d},AX=0,AW=w.length,AT,AV,AZ={domEvent:AY,dragObj:Aa};for(;AX<AW;AX++){AT=w[AX];AV=AT.containsCoords(Ab);if(!AT.hasDropTargetOver&&AV){AT.hasDropTargetOver=true;if(typeof AT.ondragover==F){AT.ondragover(AZ)}if(AT.dragOverClassName){N.addClass(AT.el,AT.dragOverClassName)}}else{if(AT.hasDropTargetOver&&!AV){if(typeof AT.ondragout==F){AT.ondragout(AZ)}if(AT.dragOverClassName){N.removeClass(AT.el,AT.dragOverClassName)}AT.hasDropTargetOver=false}}}}function m(AV){var AT=AD.dropTargets,AZ,AW,d=AT.length,AU,AY,AX;if(d>0){AW=getEventCoords(AV);for(AU=0;AU<d;AU++){AZ=AT[AU];if(AZ.containsCoords(AW)){if(typeof AZ.ondrop==F){AZ.ondrop({domEvent:AV,dragObj:AD,dropTarget:AZ})}if(T){for(AY in Q){if(AY===AZ.id){continue}if(typeof AZ.ondrop==F){AX=Q[AY];AZ.ondrop({domEvent:AV,dragObj:AX,dropTarget:AZ})}}}if(AZ.dragOverClassName){N.removeClass(AZ.el,AZ.dragOverClassName)}break}}}}function a(AT,d){return AT&&AT[d]&&AT[d][0]||AT||event}function p(AT){var AU=K.anim;AT.startX=AT.x;AT.startY=AT.y;var d=new AU.Animation(0.2);d.transition=AU.Transitions.accel;d.run=r;d.dObj=AT;d.onplay=AT.onglide;d.onend=U;d.start()}function r(AV){var AT=this.dObj,AU=AT.startX-AT.grabX,d=AT.startY-AT.grabY;AV=Math.pow(AV,3);AT.moveToX(AT.startX-(AU*AV));AT.moveToY(AT.startY-(d*AV))}function U(){AI(this.dObj)}function AI(d){if(typeof d.onglideend==F){d.onglideend()}if(d.copyEl){d.el=d.origEl;d.style=d.origEl.style;d.copyEl.style.display="none"}X(d,{})}function y(d){if(K.anim&&d.useAnim){p(d)}else{d.moveToX(d.grabX);d.moveToY(d.grabY);if(typeof d.onglide==F){d.onglide()}AI(d,{})}}return{dragCopy:false,useAnim:true,dragMultiple:false,selectedClassName:"",activeDragClassName:"",useHandleTree:true,isSelected:false,onbeforedrag:B,onbeforedragstart:B,ondragstart:B,ondrag:B,ondragstop:B,ondragend:B,x:0,y:0,origX:0,origY:0,grabX:0,grabY:0,keepInContainer:false,isDragEnabled:true,hasHandleSet:false,setHandle:function(d,AT){this.handle=d;this.hasHandleSet=true;this.useHandleTree=AT!=false},dropTargets:false,addDropTarget:function(AV){var AT=C.getByNode(AV),d=AT.el,AU=this.dropTargets;if(this.el===d){return AT}return AU[AU.length]=C.getByNode(d)},grab:function(AZ,Ab,AV){AZ=AZ||event;var Aa=R.getTarget(AZ),AU;AH(AZ);if(N.contains(this.el,Aa)){return}AU=N.getPixelCoords(this.el);this.grabX=AU.x;this.grabY=AU.y;var Ac=getEventCoords(AZ),AY=this.handle,AT=N.getOffsetCoords(N.getContainingBlock(this.el)),AX=Ac.x-AT.x,d=AX-(0|AY.offsetWidth/2),AW=Ac.y-AT.y,Ae=(AW-(0|AY.offsetHeight/2)),Ad=N.getOffsetCoords(AY,this.el);if(this.keepInContainer){d=Math.max(d,0);d=Math.min(d,this.container.clientWidth-this.el.offsetWidth);Ae=Math.max(Ae,0);Ae=Math.min(Ae,this.container.clientHeight-this.el.offsetHeight)}this.moveToX(d-Ad.x+(Ab||0));this.moveToY(Ae-Ad.y+(AV||0));AO(AZ,this);L=true;AD=this},release:function(d){V(d,this);if(typeof this.onrelease==F){this.onrelease(d)}if(this.dragMultiple){Q[this.id]=this}},moveToX:function(d){this.style[i]=(this.x=d)+f},moveToY:function(d){this.style[s]=(this.y=d)+f},removeDropTarget:function(AV){var AV=document.getElementById(AV.id),AT=this.dropTargets,AU,d;for(AU=0,d=AT.length;AU<d;AU++){if(AT[AU].el===AV){AT.splice(AU,1);return AV}}return null},toString:function(){return"Draggable(id="+this.id+")"}}}function G(S){this.el=document.getElementById(S);this.id=S}function O(){return{dragOverClassName:"",initCoords:function(){this.coords=this.coords||{};N.getOffsetCoords(this.el,document,this.coords);this.coords.w=this.el.clientWidth;this.coords.h=this.el.clientHeight},containsCoords:function(T){var S=this.coords,V=S.x,U=S.y;return(T.x>=V&&T.x<=V+S.w)&&(T.y>=U&&T.y<=U+S.h)},ondragover:false,ondragout:B,ondrop:B}}})();(function(){var B=self.APE,F=B.drag,C=B.dom,E=F.Slider=B.createFactory(A,G),J=1,D=2,H="minValue",I="maxValue";E.direction={HORZ:J,VERT:D};function A(O,K,M,N){this.id=O;this.dir=K;this.value=0;this.rationalValue=0;var L=F.Draggable.getById(O,K);L.keepInContainer=true;this.handle=L;this[H]=M||0;this[I]=N;this.tDist=0;this.init()}function G(){B.EventPublisher.add(document,"onkeydown",R);var P="ape-slider-track-active",S=null;return{init:function(){var W=B.EventPublisher,V=document.getElementById(this.id),X=this.handle,U=this.trackbar=document.getElementById(this.id).parentNode;W.add(X,"onglideend",N,this);W.add(X,"ondragend",N,this);W.add(X,"onglideend",N,this);W.add(X,"ondrag",Q,this);if(!("focus" in X)){W.add(V,"onmousedown",L,this)}W.add(V,"onfocus",L,this);W.add(V,"onblur",K,this);W.add(X,"onglide",Q,this);W.add(X,"ondragstop",Q,this);if(this.dir===D){this.tDist=U.clientHeight-V.offsetHeight;X.moveToX=M}else{this.tDist=U.clientWidth-V.offsetWidth;X.moveToY=M}if(this[I]===undefined){this[I]=this.tDist}W.add(U,"onmousedown",T,U)},ticks:15,rationalValue:0,slideToX:function(U){this.handle.moveToX(U);if(typeof slider.onslide==="function"){slider.onslide()}},setValue:function(U){U=Math.max(this[H],U);U=Math.min(this[I],U);var V=this.handle,X=this[I]-this[H],W=(U-this[H])/X;if(!V||!V.id){return}if(this.dir===D){V.moveToY(this.tDist*(1-W))}else{V.moveToX(this.tDist*W)}this.rationalValue=W;this.value=U},slideToY:function(U){this.handle.moveToY(U);this.onslide()},setRationalValue:function(V,U){V=Math.max(0,V);V=Math.min(1,V);this.rationalValue=V;this.setValue(this[H]+(V*(this[I]-this[H])));if(U){Q.call(this,{})}},toString:function(){return"Slider: "+this.handle.toString()}};function M(){}function T(W){var V=C.Event.getTarget(W),U;if(V!==this){return true}U=E.instances[this.getElementsByTagName("*")[0].id];W=W||self.event;if(W.preventDefault){W.preventDefault()}C.addClass(this,P);U.handle.grab(W);Q.call(U,W);return false}function N(U){C.removeClass(this.trackbar,P);Q.call(this,U);if(typeof this.onslideend==="function"){this.onslideend(U)}}function L(U){S=this;C.addClass(this.trackbar,P)}function K(U){if(S===this){S=null}C.removeClass(this.trackbar,P)}function Q(X){this.value=0;var V=document.getElementById(this.id),W=0;if(this.dir===J){if(V.offsetLeft>0){W=V.offsetLeft/this.tDist}else{W=0}}else{if(V.offsetTop>0){var U=this.tDist-V.offsetTop;W=U/this.tDist}else{W=1}}this.rationalValue=W;this.value=W*(this[I]-this[H]);if(this.onslide){this.onslide(X||{})}}var O;function R(Y){Y=Y||self.event;if(Y.stopPropagation){Y.stopPropagation()}Y.cancelBubble=true;var W=+new Date,U=S;if(!U){return}if(W-O<5){return}O=W;var b=Y.keyCode,a,V=b===37,Z=b===39,c=b===38,X=b===40;if(!(V||Z||c||X)){return true}if(U.id in E.instances){a=U[I]/U.ticks;if(V||X){a=-a}U.setValue(U.value+a);if(U.onslide){U.onslide(Y)}return false}}}})();