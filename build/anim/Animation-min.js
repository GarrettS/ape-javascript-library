APE.namespace("APE.anim");
(function(){function n(a){if(typeof a=="number")this.duration=a*1E3;this.timeLimit=this.duration}function h(a){return a}APE.anim.Animation=n;var f="rationalValue";n.prototype={paused:false,duration:1E3,timeLimit:1E3,isReversed:false,startOffset:0,endOffset:1,startValue:0,endValue:1,rationalValue:0,transition:h,position:0,onstart:h,onend:h,onabort:function(a){throw a;},run:h,start:function(){if(!this.paused){this.playing=true;this.timeLimit=this.duration;this.endOffset=this.transition(this.endValue);this._start()}},
_start:function(){g.unregister(this);this._startTime=+new Date;this.onstart();g.register(this);this.started=true},seekTo:function(a,d){a=parseFloat(a);if(isFinite(a))if(a!==this[f]){this.startOffset=this.position;this.startValue=this[f];this.endValue=a;var i=Math.abs(a-this.startValue);this.timeLimit=this.duration*i;this.endOffset=(this._transitionBackwards=(this.isReversed=a<this[f])&&d)?1-this.transition(1-a):this.transition(a);this._start()}},toggleDirection:function(){if(this.started)this.isReversed?
this.seekTo(1):this.seekTo(0,this.position==1);else this.start()},reset:function(){this.position=0;this.timeLimit=this.duration},pause:function(){this.paused=true;this.elapsedTime=new Date-this._startTime;g.unregister(this)},resume:function(){this.paused=false;this._startTime=new Date-this.elapsedTime;g.register(this)},toString:function(){return"Animation {duration millis: "+this.duration+", position:"+this.position+"}"},stop:function(a){this._end(a)},abort:function(a){g.unregister(this);this.onabort(a||
{})},_end:function(a){g.unregister(this);a!==false&&this.onend()}};var g=new (function(){function a(b){e.length===0&&i.call(this);for(var c=0;c<e.length;c++)if(e[c]===b)return;e.push(b)}function d(b){for(var c=0;c<e.length;c++)e[c]===b&&e.splice(c,1);if(e.length===0){e=[];p.call(this)}}function i(){o=self.setInterval(q,r)}function q(){for(var b=0,c;b<e.length;b++)try{c=e[b];s(c)}catch(j){c&&c.abort(j)}}function p(){self.clearInterval(o)}function s(b){var c=new Date-b._startTime;if(c>=b.timeLimit){b.run(b.position=
b.endOffset);b[f]=b.endValue;b._end()}else{c=c/b.duration;var j=b.transition;if(b.isReversed){b[f]=b.startValue-c;b.position=b._transitionBackwards?1-j(1-b[f]):j(b[f])}else{b[f]=b.startValue+c;b.position=j(b[f])}typeof b.onplay=="function"&&b.onplay(b.position);b.run(b.position)}}this.register=a;this.unregister=d;var r=17,e=[],o}),k=Math.PI,l=Math.atan,m=Math.cos;APE.anim.Transitions={none:h,accel:function(a){return a*a*a},decel:function(a){a=1-a;return 1-a*a*a},reverse:function(a){return 1-a},getSigmoid:function(a){function d(i){return(l(a*
(2*i-1))/l(a)+1)/2}a=a||1;return d},easeInEaseOut:function(a){return(l(a*k/1-k/2)+1)/2.0038848218538874},wobble:function(a){return-m(3*a*k)/2+0.5},loop:function(a){return-m(2*a*k)/2+0.5},spring:function(a){return 1-m(a*4.5*k)*Math.exp(-a*6)},swingTo:function(a){var d=1.70158;return(a-=1)*a*((d+1)*a+d)+1},swingToFrom:function(a){var d=1.70158;if((a/=0.5)<1)return 0.5*a*a*(((d*=1.525)+1)*a-d);return 0.5*((a-=2)*a*(((d*=1.525)+1)*a+d)+2)}}})();
