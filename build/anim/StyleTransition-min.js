(function(){var Y=window.APE,X=Y.anim,g=X.Animation,W=g.prototype,e=Y.dom,T,I="fromValue",c="opacity",O="toValue",N="px",J="prototype",A="blendTo",b="toString",f="extend",M="style";X.StyleTransition=L;function L(k,h,i,j){g.call(this,i);if(k.id){k=k.id}this.id=k;if(j){this.transition=j}this.init(h)}Y[f](L,g,{_start:function(){this[M]=document.getElementById(this.id)[M];W._start.call(this)},_end:function(){this[M]=null;W._end.call(this)},run:function(n){var k=0,m=this.adapters,h=m.length,l=this[M],j;while(k<h){j=m[k++];l[j.prop]=j[A](n)}},init:function(n){var j=document.getElementById(this.id),p=[],o,h,m,i=j[M],k=i.cssText,l={};if(T===undefined){T=!(c in i)&&("filter" in i)}for(h in n){if(!n[h]){continue}if(h===c&&T&&!j.currentStyle.hasLayout){i.zoom="1"}l[h]=e.getStyle(j,h)}d(j,n);for(h in n){m=n[h];if(D.test(m)){m=e.getStyle(j,h)}o=S.fromValues(h,l[h],m);p.push(o)}i.cssText=k;p.sort(function(r,q){return(r instanceof B)?-1:1});this.adapters=p},toString:function(){return"StyleTransitionAdapter : id=#"+this.id+"\n"+W[b].call(this)+"\nAdapters:\n  "+this.adapters.join("\n  ")}});function d(k,i){var l,h,j=k[M];for(l in i){h=i[l];if(l===c){e.setOpacity(k,h)}else{j[l]=h}}j.visibility="visible";j.display="block"}var D=/(^-?\d+|(?:-?\d*\.\d+))(px|em|ex|pt|pc|in|cm|mm|%)/i,E=/color/i,K=/(?:width|height|padding|fontSize)$/ig,V=/^\d+$/,C=/^(?:hidden|collapse)/;var S={fromValues:function(k,j,i){var h;if(K.test(k)){h=H}else{if(E.test(k)){h=a}else{if(D.test(j)){h=Z}else{if(k===c){h=T?F:G}else{if(k=="fontWeight"&&V.test(j)&&V.test(i)){h=P}else{if(k==="visibility"&&C.test(j)||k=="display"&&j=="none"){h=B}else{h=R}}}}}}return new h(k,j,i)}};var U=Y.color&&Y.color.ColorRGB;function Q(j,i,h){this.prop=j;this[I]=i;this[O]=h}Q[J][b]=function(){return"Transition: "+this.prop+", "+this[I][b]()+" \u2014 "+this[O][b]()};function a(l,k,h){if(!U){U=Y.color.ColorRGB}var j=U.fromString(k),i=U.fromString(h);Q.call(this,l,j,i);this.currentValue=new U()}Y[f](a,Q);a[J][A]=function(h){var i=U.blend(this[I],this[O],h,this.currentValue);return i[b]()};function Z(j,i,h){Q.call(this,j,parseFloat(i),parseFloat(h))}Y[f](Z,Q);Z[J][A]=function(i){var h=1-i;return((this[I]*h)+(this[O]*i))+N};function H(){Z.apply(this,arguments)}Y[f](H,Z);H[J][A]=function(j){var h=1-j,i=Math.max((this[I]*h)+(this[O]*j),0)+N;return i};function G(j,i,h){Q.call(this,j,parseFloat(i),parseFloat(h))}Y[f](G,Q);G[J][A]=function(j){var h=1-j,i=Math.max((this[I]*h)+(this[O]*j),0);return i};function F(j,i,h){Q.call(this,"filter",i,h)}Y[f](F,Q);F[J][A]=function(j){var h=1-j,i=Math.abs((this[I]*h)+(this[O]*j),0);return"alpha(opacity="+Math.abs(i*100)+")"};function P(j,i,h){Q.call(this,j,parseInt(i,10),parseInt(h,10))}Y[f](P,Q);P[J][A]=function(j){var h=1-j,i=(((this[I]*h)+(this[O]*j))/100<<0)*100;if(i<100){return 100}if(i>900){return 900}return i};function R(j,i,h){Q.call(this,j,i,h)}Y[f](R,Q);R[J][A]=function(h){if(h===1){return this[O]}return this[I]};function B(j,i,h){Q.call(this,j,i,h)}Y[f](B,Q);B[J][A]=function(h){if(h===0){return this[I]}return this[O]}})();