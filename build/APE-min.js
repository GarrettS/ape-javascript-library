(function(){function P(){}var N=0,L="prototype",A=Object[L],M="hasOwnProperty",K="instances",A=Object.prototype,C=A[M],H=C;if(typeof APE!=="undefined"){throw Error("APE is already defined.")}self.APE={namespace:I,extend:function(F,T,R){var S;P[L]=T[L];F[L]=S=new P;if(typeof R=="object"){APE.mixin(S,R)}S.constructor=F;return F},mixin:function(U,T){var S=["toString","valueOf"],V,R=0,F;for(V in T){if(T[M](V)){U[V]=T[V]}}for(;R<S.length;R++){F=S[R];if(T[M](F)){U[F]=T[F]}}return U},createFactory:G,getById:Q,deferError:function(F){setTimeout(function(){throw F},1)},toString:function(){return"[APE JavaScript Library]"}};function G(F,S){return{getById:R,getByNode:R};function R(T){var U=(typeof T==="string")?T:E(T);if(!(K in this)){if(typeof S==="function"){F[L]=S()}}return B.call(this,U,F,arguments)}}function B(S,R,F){if(!this[M](K)){this[K]={}}return this[K][S]||(this[K][S]=D(R,F))}function Q(F){return B.call(this,F,this,arguments)}function E(F){var S=F.id,R;if(!S){R=J(this)||"APE";S=F.id=R+"_"+(N++)}return S}function J(F){if(typeof F.name==="string"){return F.name}var R=Function[L].toString.call(F).match(/\s([a-z]+)\(/i);return R&&R[1]||""}function D(S,F){P[L]=S[L];P[L].constructor=S;var R=new P;S.apply(R,F);return R}function I(U){var V=U.split("."),S=self,W=S.qualifiedName,T=0,F=V.length,R;for(;T<F;T++){R=V[T];if(!H.call(S,R)){S[R]=new O((W||"APE")+"."+R)}S=S[R]}return S}O[L].toString=function(){return"["+this.qualifiedName+"]"};function O(F){this.qualifiedName=F}if(H&&!H.call(self,"Object")){H=A[M]=function(F){if(this===self){return(F in this)&&(A[F]!==this[F])}return C.call(this,F)}}})();