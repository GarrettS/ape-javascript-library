APE.namespace("APE.widget");(function(){var C=self.APE,D=C.widget,E=C.dom;D.Scroller=C.createFactory(A,B);function A(H,G,F){this.id=H;this.timeDuration=G||250;this.isVertical=!!F;this._queue=0;this.init()}function B(){function F(I){return H;function H(){I.move()}}function G(){var H=this.id.match(/(\w+)(Next|Prev)$/),I=D.Scroller.getById(H[1]);I.moveStart(H[2]==="Next")}return{pos:0,init:function(){var Q=document,H=this.id,I=Q.getElementById(H),R,N=I.childNodes,L,M,O=E.Event.addCallback,P=this.isVertical,K=P?"offsetTop":"offsetLeft",S=P?"offsetHeight":"offsetWidth",J=Q.getElementById(H+"Prev");next=Q.getElementById(H+"Next");this.clientDimension=P?"clientHeight":"clientWidth";this.stylePos=P?"top":"left";for(L=0,M=N.length;L<M;L++){R=N[L];if(!R){break}if(!/LI/i.test(R.tagName)){R.parentNode.removeChild(R)}}this.scrollDistance=I.lastChild[K]+I.lastChild[S];this.frameSize=I.parentNode[this.clientDimension];I.style[P?"height":"width"]=this.scrollDistance+10+"px";if(J!==null){O(J,"click",G)}if(next!==null){O(next,"click",G)}},moveStart:function(K){if(this.timerId){this._queue+=K?1:-1;return}var L=document,N=this.id,M=L.getElementById(N+"Frame")[this.clientDimension],J,H;if(this.scrollDistance<=M){return}this.style=L.getElementById(N).style;if(K){M=-M}this.newPos=this.pos+M;J=L.getElementById(N+"Prev");H=L.getElementById(N+"Next");if(!K){E.removeClass(H,"scrollerButton-disabled");if(this.newPos>=0){M=-this.pos;this.newPos=0;E.addClass(J,"scrollerButton-disabled")}}else{if(this.pos===0&&this.newPos){E.removeClass(J,"scrollerButton-disabled")}if(this.newPos<=this.frameSize-this.scrollDistance){E.addClass(H,"scrollerButton-disabled");var I=this.scrollDistance+this.pos-this.frameSize;M=-I;this.newPos=this.pos-I}}this.startTime=new Date().valueOf();this.startPos=this.pos;this.dx=M;this.timerId=self.setInterval(F(this),12)},move:function(){var H=new Date-this.startTime,J=H/this.timeDuration,I=(Math.atan(1.4*(2*J-1))/Math.atan(1.4)+1)/2;if(J>=1){return this.moveEnd()}this.style[this.stylePos]=(this.pos=0|this.startPos+this.dx*I)+"px"},moveEnd:function(){self.clearInterval(this.timerId);this.timerId=null;this.style[this.stylePos]=(this.pos=this.newPos)+"px";if(this._queue!==0){var H=this._queue>0;this._queue+=H?-1:1;this.moveStart(H)}else{if(typeof this.onend=="function"){this.onend()}this.style=null}}}}})();