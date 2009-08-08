(function(){var T=window.APE,S=T.anim,W=T.dom,X=S.Animation.prototype.start,K=S.Animation.prototype.start;T.anim.StyleTransition=J;function J(c,Z,a,b){S.Animation.call(this,a);if(c.id){c=c.id}this.id=c;this.adapters=[];if(b){this.transition=b}this.init(Z)}T.extend(S.StyleTransition,S.Animation,{start:function(){this.style=document.getElementById(this.id).style;X.call(this)},end:function(){this.style=null;K.call(this)},run:function P(e){var b=0,d=this.adapters,Z=d.length,c=this.style,a;while(b<Z){a=d[b++];this.style[a.prop]=a.blendTo(e)}},init:function(j){var d=document.getElementById(this.id),m=[],k,f=window.APE,c,a,h,i=f.anim.TransitionAdapterFactory,Z=i.ThresholdTransitionAdapter,l=i.ImmediateThresholdTransitionAdapter;var b=d.style,e=b.cssText,g={};for(c in j){h=j[c];if(!h){continue}if(c=="opacity"&&!("opacity" in d.style)&&("filter" in d.style)){c="alpha";d.style.zoom="1";a=W.getFilterOpacity(d)}else{a=W.getStyle(d,c)}g[c]=a}for(c in j){b[c]=j[c]}b.visibility="visible";b.display="block";for(c in j){h=j[c];if(B.test(h)){h=W.getStyle(d,c)}k=i.fromValues(c,g[c],h,d);m.push(k)}b.cssText=e;m.sort(function(o,n){return(o instanceof l?-1:1)});this.adapters=m},toString:function(){return"StyleTransitionAdapter : id=#"+this.id+"\n"+S.Animation.prototype.toString.call(this)+"\nAdapters:\n  "+this.adapters.join("\n  ")}});var B=/(^-?\d+|(?:-?\d*\.\d+))(px|em|ex|pt|pc|in|cm|mm|%)/i,D=/color/i,H=/(?:width|height|padding|fontSize)$/ig,I=/alpha/,L=/^opacity/,Q=/^\d+$/,C=/^(?:hidden|collapse)/;S.TransitionAdapterFactory={fromValues:function(c,b,a){var Z;if(H.test(c)){Z=this.PositiveLengthTransitionAdapter}else{if(D.test(c)){Z=this.ColorTransitionAdapter}else{if(B.test(b)){Z=this.LengthTransitionAdapter}else{if(I.test(c)){Z=this.FilterTransitionAdapter}else{if(L.test(c)){Z=this.OpacityTransitionAdapter}else{if(c=="fontWeight"&&Q.test(b)&&Q.test(a)){Z=this.FontWeightTransitionAdapter}else{if(c==="visibility"&&C.test(b)||c=="display"&&b=="none"){Z=this.ImmediateThresholdTransitionAdapter}else{Z=this.ThresholdTransitionAdapter}}}}}}}return new Z(c,b,a)}};var R=T.color&&T.color.ColorRGB,Y={PositiveLengthTransitionAdapter:G,ColorTransitionAdapter:V,LengthTransitionAdapter:U,FilterTransitionAdapter:E,OpacityTransitionAdapter:F,FontWeightTransitionAdapter:M,ThresholdTransitionAdapter:O,ImmediateThresholdTransitionAdapter:A};T.mixin(S.TransitionAdapterFactory,Y);function N(c,b,Z,a){this.prop=c;this.fromValue=b;this.toValue=Z;if(a){this.units=a}}N.prototype.toString=function(){var Z=(this.units||"");return T.getFunctionName(this.constructor)+": "+this.prop+", "+this.fromValue.toString()+Z+" \u2014 "+this.toValue.toString()+Z};function V(d,c,Z){if(!R){R=T.color.ColorRGB}var b=R.fromString(c),a=Z=R.fromString(Z);N.call(this,d,b,a);this.currentValue=new R()}T.extend(V,N,{blendTo:function(Z){var a=R.blend(this.fromValue,this.toValue,Z,this.currentValue);return a.toString()}});function U(b,a,Z){N.call(this,b,parseFloat(a),parseFloat(Z),"px")}T.extend(U,N);U.prototype.blendTo=function(a){var Z=1-a;return((this.fromValue*Z)+(this.toValue*a))+this.units};function G(){U.apply(this,arguments)}T.extend(G,U);G.prototype.blendTo=function(b){var Z=1-b,a=Math.max((this.fromValue*Z)+(this.toValue*b),0)+this.units;return a};function F(b,a,Z){N.call(this,b,parseFloat(a),parseFloat(Z))}T.extend(F,N);F.prototype.blendTo=function(b){var Z=1-b,a=Math.max((this.fromValue*Z)+(this.toValue*b),0);return a};function E(b,a,Z){N.call(this,"filter",a,Z)}T.extend(E,N);E.prototype.blendTo=function(b){var Z=1-b,a=Math.abs((this.fromValue*Z)+(this.toValue*b),0);return"alpha(opacity="+Math.abs(a*100)+")"};function M(b,a,Z){N.call(this,b,parseInt(a),parseInt(Z))}T.extend(M,N);M.prototype.blendTo=function(b){var Z=1-b,a=(((this.fromValue*Z)+(this.toValue*b))/100<<0)*100;if(a<100){return 100}if(a>900){return 900}return a};function O(b,a,Z){N.call(this,b,a,Z)}T.extend(O,N);O.prototype.blendTo=function(Z){if(Z===1){return this.toValue}return this.fromValue};function A(b,a,Z){N.call(this,b,a,Z)}T.extend(A,N);A.prototype.blendTo=function(Z){if(Z===0){return this.fromValue}return this.toValue}})();