APE.namespace("APE.drag");(function(){var B=self.APE,F=B.drag,C=B.dom,E=F.Slider=B.createFactory(A,G),J=1,D=2,H="minValue",I="maxValue";E.direction={HORZ:J,VERT:D};function A(O,K,M,N){this.id=O;this.dir=K;this.value=0;this.rationalValue=0;var L=F.Draggable.getById(O,K);L.keepInContainer=true;this.handle=L;this[H]=M||0;this[I]=N;this.tDist=0;this.init()}function G(){B.EventPublisher.add(document,"onkeydown",R);var P="ape-slider-track-active",S=null;return{init:function(){var W=B.EventPublisher,V=document.getElementById(this.id),X=this.handle,U=this.trackbar=document.getElementById(this.id).parentNode;W.add(X,"onglideend",N,this);W.add(X,"ondragend",N,this);W.add(X,"onglideend",N,this);W.add(X,"ondrag",Q,this);if(!("focus" in X)){W.add(V,"onmousedown",L,this)}W.add(V,"onfocus",L,this);W.add(V,"onblur",K,this);W.add(X,"onglide",Q,this);W.add(X,"ondragstop",Q,this);if(this.dir===D){this.tDist=U.clientHeight-V.offsetHeight;X.moveToX=M}else{this.tDist=U.clientWidth-V.offsetWidth;X.moveToY=M}if(this[I]===undefined){this[I]=this.tDist}W.add(U,"onmousedown",T,U)},ticks:15,rationalValue:0,slideToX:function(U){this.handle.moveToX(U);if(typeof slider.onslide==="function"){slider.onslide()}},setValue:function(U){U=Math.max(this[H],U);U=Math.min(this[I],U);var V=this.handle,X=this[I]-this[H],W=(U-this[H])/X;if(!V||!V.id){return}if(this.dir===D){V.moveToY(this.tDist*(1-W))}else{V.moveToX(this.tDist*W)}this.rationalValue=W;this.value=U},slideToY:function(U){this.handle.moveToY(U);this.onslide()},setRationalValue:function(V,U){V=Math.max(0,V);V=Math.min(1,V);this.rationalValue=V;this.setValue(this[H]+(V*(this[I]-this[H])));if(U){Q.call(this,{})}},toString:function(){return"Slider: "+this.handle.toString()}};function M(){}function T(W){var V=C.Event.getTarget(W),U;if(V!==this){return true}U=E.instances[this.getElementsByTagName("*")[0].id];W=W||self.event;if(W.preventDefault){W.preventDefault()}C.addClass(this,P);U.handle.grab(W);Q.call(U,W);return false}function N(U){C.removeClass(this.trackbar,P);Q.call(this,U);if(typeof this.onslideend==="function"){this.onslideend(U)}}function L(U){S=this;C.addClass(this.trackbar,P)}function K(U){if(S===this){S=null}C.removeClass(this.trackbar,P)}function Q(X){this.value=0;var V=document.getElementById(this.id),W=0;if(this.dir===J){if(V.offsetLeft>0){W=V.offsetLeft/this.tDist}else{W=0}}else{if(V.offsetTop>0){var U=this.tDist-V.offsetTop;W=U/this.tDist}else{W=1}}this.rationalValue=W;this.value=W*(this[I]-this[H]);if(this.onslide){this.onslide(X||{})}}var O;function R(Y){Y=Y||self.event;if(Y.stopPropagation){Y.stopPropagation()}Y.cancelBubble=true;var W=+new Date,U=S;if(!U){return}if(W-O<5){return}O=W;var b=Y.keyCode,a,V=b===37,Z=b===39,c=b===38,X=b===40;if(!(V||Z||c||X)){return true}if(U.id in E.instances){a=U[I]/U.ticks;if(V||X){a=-a}U.setValue(U.value+a);if(U.onslide){U.onslide(Y)}return false}}}})();