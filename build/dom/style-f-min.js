APE.namespace("APE.dom");(function(){var Q=APE.dom;Q.getStyle=D;Q.setOpacity=R;var E=Q.IS_COMPUTED_STYLE,P="currentStyle",O="opacity",F="style",G="px",J="filter",I="alpha("+O+"=",M=/^(?:margin|(border)(Width|Color|Style)|padding)$/,N=/\Wopacity\s*=\s*([\d]+)/i,A=/^auto|\d%$/,L="cssFloat",C=["Top","Right","Bottom","Left"];if(!(L in document.documentElement[F])){L="styleFloat"}function K(U){var W,V=U[J];if(!N.test(V)){return 1}W=N.exec(V);return W[1]/100}function R(X,U){var W=X[F],V;if(O in W){W[O]=U}else{if(J in W){W[J]=I+(U*100)+")";V=X[P];if(V&&!V.hasLayout){W.zoom=1}}}}function D(V,U){var c="",Z,Y,W,X,a,b=V[Q.OWNER_DOCUMENT];if(/float/.test(U)){U=L}if(E){Z=b.defaultView.getComputedStyle(V,"");if(!(U in Z)){return""}c=Z[U];if(c===""){c=S(Z,U).join(" ")}if(U=="zIndex"&&c=="normal"){return"0"}if(A.test(c)){c=T(V,U)}}else{Z=V[P];if(U===O){c=K(Z)}else{c=Z[U];if(A.test(c)){c=T(V,U)}else{if(!(U in Z)){return""}}}Y=H.exec(c);if(Y){W=c.split(" ");W[0]=B(V,Y[0]);for(X=1,a=W.length;X<a;X++){Y=H.exec(W[X]);W[X]=B(V,Y[0])}c=W.join(" ")}}return c}function T(W,V){var c=W[F],b,X,U,Y,a,Z;if("pixelWidth" in c&&/width|height|top|left/.test(V)){X="pixel"+(V.charAt(0).toUpperCase())+V.substring(1);b=c[X]}if(b){return b+G}if(V==="width"){a=W.clientLeft||0;U=parseFloat(D(W,"borderRightWidth"))||a;Z=parseFloat(D(W,"paddingLeft"))||0+parseFloat(D(W,"paddingRight"))||0;return W.offsetWidth-a-U-Z+G}else{if(V==="height"){Y=W.clientTop||0;U=parseFloat(D(W,"borderBottomWidth"))||Y;Z=parseFloat(D(W,"paddingTop"))||0+parseFloat(D(W,"paddingBottom"))||0;return W.offsetHeight-Y-U+G}else{if(V=="margin"&&W[P].position!="absolute"){b=parseFloat(D(W.parentNode,"width"))-W.offsetWidth;if(b===0){return"0px"}b="0px "+b;return b+" "+b}}}return"0"}function S(a,V){var W=M.exec(V),Y,e,Z,c,d,b=true,U,X=1;if(W&&W[0]){U=C;Y=W[1]||W[0];e=W[2]||""}else{return[""]}Z=a[Y+U[0]+e];d=[Z];while(X<4){c=a[Y+U[X]+e];b=b&&c==Z;Z=c;d[X++]=c}if(b){return[Z]}return d}var H=/(-?\d+|(?:-?\d*\.\d+))(?:em|ex|pt|pc|in|cm|mm\s*)/;function B(Y,Z){if(Y.runtimeStyle){if(parseFloat(Z)===0){return"0px"}var X=Y[F],W=X.left,V=Y.runtimeStyle,U=V.left;V.left=Y[P].left;X.left=(Z||0);Z=X.pixelLeft+G;X.left=W;V.left=U;return Z}}})();