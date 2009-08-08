APE.namespace("APE.anim");(function(){APE.anim.Animation=C;function C(E){if(typeof E=="number"){this.duration=E*1000}this.timeLimit=this.duration}function B(E){return E}C.prototype={paused:false,duration:1000,timeLimit:1000,isReversed:false,startOffset:0,endOffset:1,startValue:0,endValue:1,rationalValue:0,transition:B,position:0,onstart:B,onend:B,onabort:function(E){throw E},run:B,start:function(){if(this.paused){return}this.playing=true;this.timeLimit=this.duration;this.endOffset=this.transition(this.endValue);this._start()},_start:function(){A.unregister(this);this._startTime=new Date-0;this.onstart();A.register(this);this.started=true},seekTo:function(G,E){G=parseFloat(G);if(!isFinite(G)){return}if(G===this.rationalValue){return}this.startOffset=this.position;this.startValue=this.rationalValue;this.endValue=G;var F=Math.abs(G-this.startValue);this.timeLimit=this.duration*F;this.isReversed=(G<this.rationalValue);this._transitionBackwards=this.isReversed&&E;if(this._transitionBackwards){this.endOffset=1-this.transition(1-G)}else{this.endOffset=this.transition(G)}this._start()},toggleDirection:function(){if(!this.started){this.start();return}if(this.isReversed){this.seekTo(1)}else{this.seekTo(0,this.position==1)}},reset:function(){this.position=0;this.timeLimit=this.duration},pause:function(){this.paused=true;this.elapsedTime=new Date-this._startTime;A.unregister(this)},resume:function(){this.paused=false;this._startTime=new Date-this.elapsedTime;A.register(this)},toString:function(){return"Animation {duration millis: "+this.duration+", position:"+this.position+"}"},stop:function(E){this._end(E)},abort:function(E){A.unregister(this);this.onabort(E||{})},_end:function(E){A.unregister(this);if(E!==false){this.onend()}}};var A=new function(){this.register=H;this.unregister=G;var J=17,E=[],I;function H(N){if(E.length===0){L.call(this)}for(var M=0;M<E.length;M++){if(E[M]===N){return}}E.push(N)}function G(N){for(var M=0;M<E.length;M++){if(E[M]===N){E.splice(M,1)}}if(E.length===0){E=[];F.call(this)}}function L(){I=window.setInterval(K,J)}function K(){var N=0,O;for(;N<E.length;N++){try{O=E[N];D(O)}catch(M){if(O){O.abort(M)}}}}function F(){window.clearInterval(I)}};function D(F){var E=new Date-F._startTime;if(E>=F.timeLimit){F.run(F.position=F.endOffset);F.rationalValue=F.endValue;F._end();return}var G=(E/F.duration);if(F.isReversed){F.rationalValue=F.startValue-G;if(F._transitionBackwards){F.position=1-F.transition(1-F.rationalValue)}else{F.position=F.transition(F.rationalValue)}}else{F.rationalValue=F.startValue+G;F.position=F.transition(F.rationalValue)}if(typeof F.onplay=="function"){F.onplay(F.position)}F.run(F.position)}})();APE.anim.Transitions={none:function(A){return A},accel:function(A){return A*A*A},decel:function(A){A=1-A;return 1-(A*A*A)},reverse:function(A){return 1-A},sigmoid:function(C,A){var B=Math.atan;A=A||1;return(B(A*(2*C-1))/B(A)+1)/(2)},sigmoid2:function(B){var A=Math.atan;return(A(2*(2*B-1))/A(2)+1)/(2)},sigmoid3:function(B){var A=Math.atan;return(A(3*(2*B-1))/A(3)+1)/(2)},sigmoid4:function(B){var A=Math.atan;return(A(4*(2*B-1))/A(4)+1)/(2)},tan:function(B){var A=Math.tan;return(A(1*(2*B-1))/A(1)+1)/(2)},reverseWarp:function(B){var A=Math.tan;return(A(2*(2*B-1))/A(2)+1)/(2)},easeInEaseOut:function(B){var A=Math.PI;return(Math.atan(B*A/1-A/2)+1)/2.0038848218538874},wobble:function(A){return(-Math.cos(3*A*Math.PI)/2)+0.5},loop:function(A){return(-Math.cos(2*A*Math.PI)/2)+0.5},spring:function(A){return 1-(Math.cos(A*4.5*Math.PI)*Math.exp(-A*6))},swingTo:function(B){var A=1.70158;return(B-=1)*B*((A+1)*B+A)+1},swingToFrom:function(B){var A=1.70158;if((B/=0.5)<1){return 0.5*(B*B*(((A*=(1.525))+1)*B-A))}return 0.5*((B-=2)*B*(((A*=(1.525))+1)*B+A)+2)},toString:function(){return"APE anim Transitions"}};