APE.namespace("APE.widget").createDelegateFactory=function(E,K,B,F){var C=window.APE;function H(R,S,Q,T){this.factory=R;this.eventRegistry=S;this.getMatch=T||L;this.eventTypeList=Q;this.cbMap={}}return(C.widget.createDelegateFactory=P)(E,K,B,F);function P(R,T,Q,S){if(typeof Q==="string"){Q=[Q]}R.delegateFactory=new H(R,T,Q,S);R.addDelegateFor=N;R.removeDelegateFor=G;R.removeAllDelegates=I;return R}function L(Q,R){var S=R.id;return(S in this.cbMap)?S:null}function A(S){var T,Q,U=document.documentElement,R=J(S);for(T=0,Q=S.eventTypeList.length;T<Q;T++){S.eventRegistry.add(U,S.eventTypeList[T],R)}return R}function I(){var U=this.delegateFactory,R,Q,T,S=document.documentElement;for(R=0,Q=U.eventTypeList.length;R<Q;R++){U.eventRegistry.remove(S,U.eventTypeList[R],S,U.delegateCallback)}delete U.delegateCallback}function G(Q){if(typeof Q.id==="string"){Q=Q.id}O(this.delegateFactory,Q)}function O(R,Q){delete R.cbMap[Q];if(D(R.cbMap)){R.factory.removeAllDelegates();delete R.delegateCallback}}function D(Q){return(D=C.__count__?function(R){return R.__count__===0}:typeof Object.keys==="function"?function(R){return typeof R==="object"&&Object.keys(R).length===0}:function(S){if(typeof S==="object"){for(var R in S){return true}}return false})(Q)}function N(S,Q){var R=this.delegateFactory;R.cbMap[S]=Q?{id:S,config:Q}:S;if(!R.delegateCallback){R.delegateCallback=A(R)}}function J(Q){return function(R){M(R,Q)}}function M(R,U){var S=C.dom.Event.getTarget(R),T=U.getMatch(R,S),Q,V="getByNode";if(T){if(typeof T==="string"){V="getById";Q=(U.cbMap[T]||0).config}U.factory[V](T,Q&&Q);O(U,T)}}};