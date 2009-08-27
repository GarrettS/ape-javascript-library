APE.namespace("APE.color");(function(){var F=self.APE,G=F.color,E=/(?:\s|^)#(?:[\da-f]{3}|[\da-f]{6})(?:\s|$)/i,B=/rgb\(([\d]{1,3})\,\s?([\d]{1,3})\,\s?([\d]{1,3})\)/;G.ColorRGB=C;G.ColorHSV=M;function C(P,O,N){this.r=P;this.g=O;this.b=N}F.mixin(C,{fromNumber:L,fromString:D,fromHexString:K,fromRgbString:J,blend:H});function L(N){return new C((16711680&N)>>16,(65280&N)>>8,255&N)}function K(Q){if(!E.test(Q)){throw Error("ColorRGB.fromHexString(hex) invalid: "+Q)}var R=parseInt(Q.substring(1),16),P,O,N;if(Q.length==4){P=R&3840;O=R&240;N=R&15;return new C((P>>4)+(P>>8),O+(O>>4),(N<<4)+N)}return L(R)}function D(N){return(E.test(N)?K(N):J(N))}function J(O){var N=O.match(B);if(N!=null){return new C(N[1],N[2],N[3])}return new C()}function H(U,S,T,P){var O=(T>1?0:1-T),R=U.r*O+S.r*T,Q=U.g*O+S.g*T,N=U.b*O+S.b*T;R=(R^(R>>31))-(R>>31);Q=(Q^(Q>>31))-(Q>>31);N=(N^(N>>31))-(N>>31);if(P&&"r" in P){P.r=R;P.g=Q;P.b=N;return P}return new C(R,Q,N)}C.prototype={r:255,g:255,b:255,toHSV:function(){var N=Math.max(this.r,this.g,this.b),O=Math.min(this.r,this.g,this.b),Q=0,P=0;if(N>O){switch(N){case this.r:P=(this.g-this.b)/(N-O);break;case this.g:P=2+((this.b-this.r)/(N-O));break;case this.b:P=4+((this.r-this.g)/(N-O));break}Q=(N-O)/N}P*=60;if(P<0){P+=360}return new M(P,Q,N/255)},toString:function(){return"rgb("+this.r+", "+this.g+", "+this.b+")"},toHexString:function(){return"#"+N(this.r)+N(this.g)+N(this.b);function N(P){var O=P.toString(16);return(O.length===2?O:"0"+O)}},equals:function(N){return(this.r===N.r)&&(this.b===N.b)&&(this.g===N.g)},isValid:function(){return A(this.r)&&A(this.g)&&A(this.b)},valueOf:function(){return(this.r<<16)+(this.g<<8)+this.b}};function A(N){return isFinite(N)&&N>=0&&N<=255}function M(P,O,N){this.h=P;this.s=O;this.v=N}M.rgbForHue=I;function I(N){if(N===360){N=0}return new M(N,1,1).toRGB()}M.prototype={h:360,s:1,v:1,toRGB:function(){var Y=this.h/360,P=this.s,O=this.v,T,Z,N;if(P===0){T=Z=N=O}else{Y*=6;var U=Y|0,X=O*(1-P),W=O*(1-P*(Y-U)),Q=O*(1-P*(1-(Y-U)));switch(U){case 0:T=O;Z=Q;N=X;break;case 1:T=W;Z=O;N=X;break;case 2:T=X;Z=O;N=Q;break;case 3:T=X;Z=W;N=O;break;case 4:T=Q;Z=X;N=O;break;default:T=O;Z=X;N=W}}return new C(T*255|0,Z*255|0,N*255|0)},toString:function(){return"[ "+this.h.toFixed(0)+", "+this.s.toFixed(2)+", "+this.v.toFixed(2)+" ]"}}})();