APE.namespace("APE.anim");(function(){APE.anim.Animation=E;var B="rationalValue";function E(H){if(typeof H=="number"){this.duration=H*1000}this.timeLimit=this.duration}function C(H){return H}E.prototype={paused:false,duration:1000,timeLimit:1000,isReversed:false,startOffset:0,endOffset:1,startValue:0,endValue:1,rationalValue:0,transition:C,position:0,onstart:C,onend:C,onabort:function(H){throw H},run:C,start:function(){if(this.paused){return}this.timeLimit=this.duration;this.endOffset=this.transition(this.endValue);this._start()},startAfter:function(H){var J=this;function I(){J.start();clearTimeout(this.startAfterTimer);delete J.startAfterTimer}J.startAfterTimer=setTimeout(I,H)},_start:function(){A.unregister(this);this._startTime=+new Date;this.onstart();A.register(this);this.started=true;this.playing=true;clearTimeout(this.startAfterTimer);delete this.startAfterTimer},seekTo:function(J,H){J=parseFloat(J);if(!isFinite(J)){return}if(J===this[B]){return}this.startOffset=this.position;this.startValue=this[B];this.endValue=J;var I=Math.abs(J-this.startValue);this.timeLimit=this.duration*I;this.isReversed=(J<this[B]);this._transitionBackwards=this.isReversed&&H;if(this._transitionBackwards){this.endOffset=1-this.transition(1-J)}else{this.endOffset=this.transition(J)}this._start()},toggleDirection:function(){if(!this.started){this.start();return}if(this.isReversed){this.seekTo(1)}else{this.seekTo(0,this.position==1)}},reset:function(){this.position=0;this.timeLimit=this.duration;this.started=false},pause:function(){if(this.paused||!this.playing){return}this.paused=true;this.elapsedTime=new Date-this._startTime;A.unregister(this)},resume:function(){if(!this.paused){return}this.paused=false;this._startTime=new Date-this.elapsedTime;A.register(this)},toString:function(){return"Animation {duration millis: "+this.duration+", position:"+this.position+"}"},stop:function(){clearTimeout(this.startAfterTimer);delete this.startAfterTimer;this._end()},abort:function(H){A.unregister(this);this.onabort(H||{})},_end:function(){this.playing=false;A.unregister(this);if(this.started){this.onend()}}};var A=new function(){this.register=M;this.unregister=J;var O=17,N=[],P;function M(R){if(N.length===0){H.call(this)}for(var Q=0;Q<N.length;Q++){if(N[Q]===R){return}}N.push(R)}function J(R){for(var Q=0;Q<N.length;Q++){if(N[Q]===R){N.splice(Q,1)}}if(N.length===0){N=[];K.call(this)}}function H(){P=setInterval(I,O)}function I(){var R=0,S;for(;R<N.length;R++){try{S=N[R];L(S)}catch(Q){if(S){S.abort(Q)}}}}function K(){self.clearInterval(P)}function L(R){var Q=new Date-R._startTime;if(Q>=R.timeLimit){R.run(R.position=R.endOffset);R[B]=R.endValue;R._end();return}var S=Q/R.duration,T=R.transition;if(R.isReversed){R[B]=R.startValue-S;if(R._transitionBackwards){R.position=1-T(1-R[B])}else{R.position=T(R[B])}}else{R[B]=R.startValue+S;R.position=T(R[B])}if(typeof R.onplay=="function"){R.onplay(R.position)}R.run(R.position)}};var F=Math.PI,G=Math.atan,D=Math.cos;APE.anim.Transitions={none:C,accel:function(H){return H*H*H},decel:function(H){H=1-H;return 1-(H*H*H)},reverse:function(H){return 1-H},getSigmoid:function(I){I=I||1;return H;function H(J){return(G(I*(2*J-1))/G(I)+1)/(2)}},easeInEaseOut:function(H){return(G(H*F/1-F/2)+1)/2.0038848218538874},wobble:function(H){return(-D(3*H*F)/2)+0.5},loop:function(H){return(-D(2*H*F)/2)+0.5},spring:function(H){return 1-(D(H*4.5*F)*Math.exp(-H*6))},swingTo:function(I){var H=1.70158;return(I-=1)*I*((H+1)*I+H)+1},swingToFrom:function(I){var H=1.70158;if((I/=0.5)<1){return 0.5*(I*I*(((H*=(1.525))+1)*I-H))}return 0.5*((I-=2)*I*(((H*=(1.525))+1)*I+H)+2)}}})();