APE.namespace("APE.drag");(function(){var M=self.APE,P=M.dom,D=P.getStyle,O=M.drag,T=P.Event,R=1000,S={},B,C=Function.prototype,K=self.parseInt,N,H="function",G=M.createFactory(A,F),E=M.createFactory(I,Q);O.Draggable=G;O.DropTarget=E;G.instanceDestructor=L;function A(a,U){var Y=document,V=Y.getElementById(a),X,Z,W;this.id=a;this.el=this.origEl=V;this.style=V.style;this.isRel=D(V,"position").toLowerCase()=="relative";Z=(this.isRel?V.parentNode:P.getContainingBlock(V));if(Z===null){Z=Y.documentElement}this.container=Z;this.dropTargets=[];this.handle=V;this.onbeforeexitcontainer=J;if(U){for(W in U){this[W]=U[W]}X=U.constraint;if(X=="y"){this.moveToX=C}else{if(X=="x"){this.moveToY=C}}V.style.zIndex=K(D(V,"zIndex"),10)||R++}}function J(){return !this.keepInContainer}function L(){var U,W,V;for(U in this.instances){V=this.instances[U];for(W in V){delete V[W]}delete this.instances[U]}S={}}function F(){var AW=document,Y=M.EventPublisher,AY=Y.add,AM=T.preventDefault,AK="documentElement",k=AW[AK].style,AG="serSelect",AZ="MozU"+AG,s="MozU"+AG,AJ="u"+AG,AA=AZ in k?AZ:s in k?s:AJ in k?AJ:"",j="px",n="left",x="top",AU=false,e=0,a=0,AI,AB=false,V=false,AS=false,r=25,AC=-1,i="onmousedown",U="onmousemove",AX="onmouseup",AE,AF;getEventCoords=T.getCoords;if("ontouchstart" in AW){AE=true;i="ontouchstart";U="ontouchmove";AX="ontouchend";AY(AW,"ontouchcancel",AR)}AF=Y.get(AW,i);if("onselectstart" in AW){AY(AW,"onselectstart",o)}else{AF.addAfter(o)}if("pixelLeft" in k){j=0;n="pixelLeft";x="pixelTop"}AF.add(p).addAfter(g);AY(AW,"onkeydown",AR);AY(AW,U,z);AY(self,U,function(d){d.preventDefault()});AY(AW,AX,h);AW=k=null;function o(Ab){var d=!AI;if(AA){this[AK].style[AA]=d?"":"none"}else{Ab=Ab||event;Ab.returnValue=d}}function AP(d,Ab){return Ab===d.handle||(d.useHandleTree&&P.contains(d.handle,Ab))}function AT(d,Ab){if(Ab){if(d.selectedClassName){P.addClass(d.el,d.selectedClassName)}if(d.dragMultiple&&!(d.id in S)){S[d.id]=d}}else{if(d.selectedClassName){P.removeClass(d.el,d.selectedClassName)}delete S[d.id]}d.isSelected=Ab}function v(Ah){var Ab=Ah.container,Ae=Ah.el,Aj=document,Ad=Aj.documentElement,Ag=P.getContainingBlock(Ae)||Ad,Af,Ak,An=(Ag===Ab)?{x:0,y:0}:P.getOffsetCoords(Ag,Ab),Ac=P.getPixelCoords(Ae);try{P.getOffsetCoords(Ae,Ae.parentNode)}catch(Ai){console.log(Ae.id,Ae.parentNode.nodeName)}var Ao=P.getOffsetCoords(Ae,Ae.parentNode),Am=Ao.x-Ac.x+An.x,Al=Ao.y-Ac.y+An.y;if(Ah.keepInContainer){if(Ab===Aj.body){Af=K(D(Ab,"width"),10);Ak=K(D(Ab,"height"),10)}else{Af=Ab.clientWidth;Ak=Ab.clientHeight}Ah.minX=0-Am;Ah.maxX=Af-Ae.offsetWidth-Am;Ah.minY=0-Al;Ah.maxY=Ak-Ae.offsetHeight-Al}}function AH(){for(var d in S){AT(S[d],false)}V=false}function X(Ae,d){AD(d);var Af=P.removeClass,Ad,Ac,Ab,Ag;if(AB!==false){for(Ac=0,Ab=AB.length;Ac<Ab;Ac++){Ad=AB[Ac];if(Ad.hasDropTargetOver){if(typeof Ad.ondragout==H){Ad.ondragout(Ae,d)}if(Ad.dragOverClassName){Af(Ad.el,Ad.dragOverClassName)}Ad.hasDropTargetOver=false}}}for(Ag in S){AD(S[Ag])}}function Z(d,Ab){if(d.activeDragClassName){P.removeClass(d.el,d.activeDragClassName)}if(d.copyEl){d.el.parentNode.insertBefore(d.copyEl,d.el)}}function m(d,Ab){if(Ab){if(d.id in S){AT(d,false)}else{AT(d,true)}}else{if(!d.isSelected){AH();AT(d,true)}}}function c(d){var Ab=d.el,Ac=d.copyEl;if(!Ac){Ac=d.copyEl=document.getElementById(d.proxyId)}AO(d,Ac,Ab)}function AL(d){if(!d.copyEl){d.copyEl=d.el.cloneNode(true);d.copyEl.id+="Copy"}AO(d,d.copyEl,d.el)}function AO(Ab,Ae,Ad){var d=Ae.style;Ab.origEl=Ad;Ad.parentNode.insertBefore(Ae,Ad);d.zIndex=K(Ad.style.zIndex,10)+100;if(Ab.origClassName){P.addClass(Ad,Ab.origClassName)}Ab.el=Ae;Ab.style=d;var Ac=D(Ad,"display");d.display=Ac;if(Ab.isRel){u(d,Ad,Ac)}}function u(d,Ac,Ab){if(Ab=="inline"){d.marginRight=-Ac.offsetWidth+-(K(D(Ac,"marginRight"),10)||0)+"px"}else{d.marginBottom=-Ac.offsetHeight+-(K(D(Ac,"marginBottom"),10)||0)+"px"}}function Aa(d){d.el=d.origEl;d.style=d.origEl.style;d.moveToX(d.x);d.moveToY(d.y);d.copyEl.style.display="none";if(d.origClassName){P.removeClass(d.el,d.origClassName)}}function AQ(Ab,d){if(!V||AS){return}var Ac,Ad;for(Ad in S){Ac=S[Ad];if(typeof Ab=="number"){Ac.moveToX(Ac.origX+Ab)}if(typeof d=="number"){Ac.moveToY(Ac.origY+d)}}}function l(d,Ab){if(d.isBeingDragged){return}if(d.dragCopy){AL(d)}if(typeof d.ondragstart==H){d.ondragstart(b(d,Ab))}if(d.activeDragClassName){P.addClass(d.el,d.activeDragClassName)}v(d);d.isBeingDragged=true}function b(d,Ad){var Ae=d.id,Ac={},Ab=1;Ac[Ae]=d;if(V){for(Ae in S){Ac[Ae]=S[Ae];Ab++}}return{domEvent:Ad,draggableList:Ac,count:Ab}}function p(Af){if(N){N=false;return}var d=Af||event;if(AE&&AI){return}Af=f(Af,"touches");var Ae=T.getTarget(d),Ad=G.instances,Ac,Ab=Ae,Ag=Af.metaKey||Af.ctrlKey;while(!Ac&&Ab!==null){Ac=Ad[Ab.id];Ab=P.findAncestorWithAttribute(Ab,"id")}if(Ac){if(!Ac.isDragEnabled){if(!Ag){AH()}return false}if(!Ag&&Ac.hasHandleSet&&!AP(Ac,Ae)){AH();Ac=null;return}else{if(!Ag&&!Ac.isSelected){AH()}Af.returnValue=false}}else{if(!Ag){AH();if(AI){AT(AI,false);AI=null}}return}if(Ag&&AI&&!Ac.dragMultiple){AU=true;return false}if(!Ac.dragMultiple){if(!Ag){AH()}else{AU=true;return false}}m(Ac,Ag);Ac.style.zIndex=++R;if(AV(Af,Ac)==false){return true}AI=Ac;AM(d);for(var Ah in S){AV(Af,S[Ah])}return Ae.tagName!=="IMG"}function g(){if(!AI){return}AB=[];var Ad=AI.dropTargets,Ac,Ab=0,d=Ad.length;for(;Ab<d;Ab++){Ac=Ad[Ab];Ac.initCoords();if(typeof Ac.ondragover==H||typeof Ac.ondragout==H||Ac.dragOverClassName){AB.push(Ac)}}if(AB.length===0){AB=false}}function AV(Ad,d){if(typeof d.onbeforedragstart==H&&d.onbeforedragstart(b(d,Ad))==false){return false}var Ac=getEventCoords(Ad),Ab;e=Ac.x;a=Ac.y;Ab=P.getPixelCoords(d.el);d.origX=d.grabX=Ab.x;d.origY=d.grabY=Ab.y;d.isBeingDragged=false}function z(An){if(!AI){return}var Ac=+new Date,Ag;if(Ac-AC<r){return}AC=Ac;Ag=An=An||event;if(AE){An=An.touches&&An.touches[0];if(!An){return}AM(Ag)}var Af=getEventCoords(An),Am=Af.x,Aj=Af.y,Ai=Am-e,Ah=Aj-a,Ae=false,Ap=AI.origX+Ai,Ao=AI.origY+Ah,Ak;if(AI.isBeingDragged===false){AS=!!AI.proxyId;for(Ak in S){V=true;break}delete S[AI.id];l(AI,An);if(AI.proxyId){c(AI)}for(Ak in S){l(S[Ak],An)}}AI.hasBeenDragged=(AI.hasBeenDragged||!!(Ai||Ah));var Ad=Ap<AI.minX,Ab=Ap>AI.maxX,As=Ao<AI.minY,Al=Ao>AI.maxY,d=AI.container!=null,Ar=(typeof AI.ondrag==H),Aq=0;if(typeof AI.onbeforedrag==H&&AI.onbeforedrag(An)==false){return}d&=(Ad||Ab||As||Al);if(d&&AI.onbeforeexitcontainer()==false){if(Ad){if(!AI.isAtLeft){AI.moveToX(AI.minX);AQ(AI.minX-AI.origX,null);if(Ar){AI.ondrag(An)}AI.isAtRight=false;AI.isAtLeft=true}Aq+=1}else{if(Ab){if(!AI.isAtRight){AI.moveToX(AI.maxX);AQ(AI.maxX-AI.origX,null);if(Ar){AI.ondrag(An)}AI.isAtRight=true;AI.isAtLeft=false}Aq+=1}else{AI.isAtLeft=AI.isAtRight=false;AI.moveToX(Ap);AQ(Ai,null)}}if(As){if(!AI.isAtTop){AI.moveToY(AI.minY);AQ(null,AI.minY-AI.origY);if(Ar){AI.ondrag(An)}AI.isAtTop=true;AI.isAtBottom=false}Aq+=1}else{if(Al){if(!AI.isAtBottom){if(AI.maxY>0){AI.moveToY(AI.maxY)}AQ(null,AI.maxY-AI.origY);if(Ar){AI.ondrag(An)}AI.isAtTop=false;AI.isAtBottom=true}Aq+=1}else{AI.isAtTop=AI.isAtBottom=false;AI.moveToY(Ao);AQ(null,Ah)}}Ae=Aq==2;if(Ae){AI.ondragstop(An)}else{if(Ar){AI.ondrag(An)}}}else{AI.isAtLeft=AI.isAtRight=AI.isAtTop=AI.isAtBottom=false;AI.moveToX(Ap);AI.moveToY(Ao);AQ(Ai,Ah);if(Ar){AI.ondrag(An)}}if(AB!==false){y(AI,An,Am,Aj)}return false}function h(Af){N=false;if(!AI){return}var Ae=AI.hasBeenDragged,Ab=(AI.isBeingDragged&&!Ae),Ad={},d,Ac,Ah,Ag;if(!AI.hasBeenDragged&&!Ab){if(!AU){AI=null}return}AU=false;S[AI.id]=AI;for(d in S){Ac=S[d];Ac=Ad[d]=S[d];if(Ac.copyEl){Aa(Ac)}}Af=f(Af,"changedTouches");q(Af);if(V&&!AS){for(d in S){Ac=S[d];Ah=Ac.x;Ag=Ac.y;if(Ah<Ac.minX){Ac.moveToX(Ac.minX)}else{if(Ah>Ac.maxX){Ac.moveToX(Ac.maxX)}}if(Ag<Ac.minY){Ac.moveToY(Ac.minY)}else{if(Ag>Ac.maxY){Ac.moveToY(Ac.maxY)}}}}if(Ae){var Ai=false==AI.ondragend({domEvent:Af,draggableList:Ad});if(!Ai){Z(AI,Af);for(d in S){Z(S[d],Af)}}}AI.hasBeenDragged=false;S[AI.id]=AI;AI=null}function AR(d){d=d||event;if(d.keyCode==27||d.type==="touchcancel"){if(AI){AI.release(d)}}}function y(Ai,Ag,Ac,d){var Aj={x:Ac,y:d},Af=0,Ae=AB.length,Ab,Ad,Ah={domEvent:Ag,dragObj:Ai};for(;Af<Ae;Af++){Ab=AB[Af];Ad=Ab.containsCoords(Aj);if(!Ab.hasDropTargetOver&&Ad){Ab.hasDropTargetOver=true;if(typeof Ab.ondragover==H){Ab.ondragover(Ah)}if(Ab.dragOverClassName){P.addClass(Ab.el,Ab.dragOverClassName)}}else{if(Ab.hasDropTargetOver&&!Ad){if(typeof Ab.ondragout==H){Ab.ondragout(Ah)}if(Ab.dragOverClassName){P.removeClass(Ab.el,Ab.dragOverClassName)}Ab.hasDropTargetOver=false}}}}function q(Ad){var Ab=AI.dropTargets,Ah,Ae,d=Ab.length,Ac,Ag,Af;if(d>0){Ae=getEventCoords(Ad);for(Ac=0;Ac<d;Ac++){Ah=Ab[Ac];if(Ah.containsCoords(Ae)){if(typeof Ah.ondrop==H){Ah.ondrop({domEvent:Ad,dragObj:AI,dropTarget:Ah})}if(V){for(Ag in S){if(Ag===Ah.id){continue}if(typeof Ah.ondrop==H){Af=S[Ag];Ah.ondrop({domEvent:Ad,dragObj:Af,dropTarget:Ah})}}}if(Ah.dragOverClassName){P.removeClass(Ah.el,Ah.dragOverClassName)}break}}}}function f(Ab,d){return Ab&&Ab[d]&&Ab[d][0]||Ab||event}function t(Ab){var Ac=M.anim;Ab.startX=Ab.x;Ab.startY=Ab.y;var d=new Ac.Animation(0.2);d.transition=Ac.Transitions.accel;d.run=w;d.dObj=Ab;d.onplay=Ab.onglide;d.onend=W;d.start()}function w(Ad){var Ab=this.dObj,Ac=Ab.startX-Ab.grabX,d=Ab.startY-Ab.grabY;Ad=Math.pow(Ad,3);Ab.moveToX(Ab.startX-(Ac*Ad));Ab.moveToY(Ab.startY-(d*Ad))}function W(){AN(this.dObj)}function AN(d){if(typeof d.onglideend==H){d.onglideend()}if(d.copyEl){d.el=d.origEl;d.style=d.origEl.style;d.copyEl.style.display="none"}Z(d,{})}function AD(d){if(M.anim&&d.useAnim){t(d)}else{d.moveToX(d.grabX);d.moveToY(d.grabY);if(typeof d.onglide==H){d.onglide()}AN(d,{})}}return{dragCopy:false,useAnim:true,dragMultiple:false,selectedClassName:"",activeDragClassName:"",useHandleTree:true,isSelected:false,onbeforedrag:B,onbeforedragstart:C,ondragstart:B,ondrag:B,ondragstop:C,ondragend:C,x:0,y:0,origX:0,origY:0,grabX:0,grabY:0,keepInContainer:false,isDragEnabled:true,hasHandleSet:false,setHandle:function(d,Ab){this.handle=d;this.hasHandleSet=true;this.useHandleTree=Ab!=false},dropTargets:false,addDropTarget:function(Ad){var Ab=E.getByNode(Ad),d=Ab.el,Ac=this.dropTargets;if(this.el===d){return Ab}return Ac[Ac.length]=E.getByNode(d)},grab:function(Ah,Aj,Ad){Ah=Ah||event;var Ai=T.getTarget(Ah),Ac;AM(Ah);if(P.contains(this.el,Ai)){return}Ac=P.getPixelCoords(this.el);this.grabX=Ac.x;this.grabY=Ac.y;var Ak=getEventCoords(Ah),Ag=this.handle,Ab=P.getOffsetCoords(P.getContainingBlock(this.el)),Af=Ak.x-Ab.x,d=Af-(0|Ag.offsetWidth/2),Ae=Ak.y-Ab.y,Am=(Ae-(0|Ag.offsetHeight/2)),Al=P.getOffsetCoords(Ag,this.el);if(this.keepInContainer){d=Math.max(d,0);d=Math.min(d,this.container.clientWidth-this.el.offsetWidth);Am=Math.max(Am,0);Am=Math.min(Am,this.container.clientHeight-this.el.offsetHeight)}this.moveToX(d-Al.x+(Aj||0));this.moveToY(Am-Al.y+(Ad||0));AV(Ah,this);N=true;AI=this},release:function(d){X(d,this);if(typeof this.onrelease==H){this.onrelease(d)}if(this.dragMultiple){S[this.id]=this}if(this===AI){AI.hasBeenDragged=false;AI=null}},moveToX:function(d){this.style[n]=(this.x=d)+j},moveToY:function(d){this.style[x]=(this.y=d)+j},removeDropTarget:function(Ad){var Ad=document.getElementById(Ad.id),Ab=this.dropTargets,Ac,d;for(Ac=0,d=Ab.length;Ac<d;Ac++){if(Ab[Ac].el===Ad){Ab.splice(Ac,1);return Ad}}return null},toString:function(){return"Draggable(id="+this.id+")"}}}function I(U){this.el=document.getElementById(U);this.id=U}function Q(){return{dragOverClassName:"",initCoords:function(){this.coords=this.coords||{};P.getOffsetCoords(this.el,document,this.coords);this.coords.w=this.el.clientWidth;this.coords.h=this.el.clientHeight},containsCoords:function(V){var U=this.coords,X=U.x,W=U.y;return(V.x>=X&&V.x<=X+U.w)&&(V.y>=W&&V.y<=W+U.h)},ondragover:false,ondragout:B,ondrop:B}}})();