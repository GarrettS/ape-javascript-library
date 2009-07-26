(function(){APE.mixin(APE.dom,{getStyleUnit:A,findInheritedStyle:T,getCascadedStyle:O});var Y=APE.dom,Z="style",F=Y.IS_COMPUTED_STYLE,a="getComputedStyle",P="currentStyle",R=/\dpx$/,M=/^thi|med/,K=/(-?\d+|(?:-?\d*\.\d+))(?:em|ex|pt|pc|in|cm|mm\s*)/,V=/(-?\d+|(?:-?\d*\.\d+))(px|em|ex|pt|pc|in|cm|mm|%)\s*/,D=Y.borderRadiusExp,b=/loat$/,C=/(?:width|height|padding|fontSize)$/ig,U=/^width|height|margin|padding|textIndent/,c=/^(?:font|text|letter)/,W=/width|height|top|left/,Q="px";function T(e,h,d){for(var f,g=e;f=O(g,h,d);g=g.parentNode){if(f&&!/^(?:inher|trans|(?:rgba\((?=(0,\s))(?:\1\1\1)0\)))/.test(f)){break}}return f}function O(f,h,d){var e=f[Z],g=e[h]||"";if(g&&Y.multiLengthPropExp.test(h)){g=I(g)}if(!g||(d&&g.indexOf(d)===-1)||h.indexOf("border")===0&&M.test(g)){if(P in f){g=N(f,h,d)}else{if(D.test(h)){h=D.exec(h)[0]}g=E(f,h,d)}}return g}function N(e,d,h){var l=e[P],k="",i,j=e.ownerDocument,g=j.defaultView;if(d=="opacity"){if(F){k=g[a](e,"").opacity}else{if(!("opacity" in l)){k=Y.getFilterOpacity(e)}}}else{if(!(d in l)){return""}if(b.test(d)){d=floatProp}k=e[Z][d]||l[d];if(k=="auto"){k=Y.getCurrentStyleValueFromAuto(e,d)||k}}if(h&&k.indexOf(h)==-1){if(X&&V.test(k)&&F){var f=g[a](e,d);i=J(e,d,h);if(i){k=i.fromPx(e.parentNode,d,f[d],f)}}else{if(k==0&&h){k="0"+h}else{i=J(e,d,h);k=i.fromPx(e.parentNode,d)}}}return k}function E(e,d,m){if(F){var k=e.ownerDocument.defaultView,l=k[a](e,""),o=l[d],q,g=0,j,h,n,f;if(!(d in l)){return""}if(o===""){q=Y.tryGetShorthandValues(l,d)}else{if(parseFloat(o)==0&&m){return"0"+m}}if(m){if(!q){q=[o]}n=J(e,d,m);if(n){h=e.parentNode;for(j=q.length;g<j;g++){f=q[g];if(f=="0"){q[g]="0"+m}else{if(!n.exp.test(f)){q[g]=n.fromPx(h,d,f,l)}}}}}if(q){o=I(q.join(" "))}return o}}function I(g){var e=g.split(" "),f=1,d,h=true,j=e[0];for(d=e.length-1;f<d;f++){if(!h){break}h=e[f]==e[f+1]}if(h){g=j}return g}function J(e,f,d){if(d=="em"){if(F){return L.em||(L.em=new L("em",1))}return new L("em",1,e,f)}if(d=="ex"){if(F){return L.ex||(L.ex=new L("ex",0.5))}return new L("ex",1,e,f)}if(d=="%"){if(U.test(f)){return new G(e,f)}return new S(e,f)}}function L(f,d,e,g){this.exp=new RegExp("\\d"+f+"$");this.unit=f;this.fontSizeMultiplier=d;if(e&&e[P]){this.val=e[P][g];if(K.test(this.val)){this.val=Y.convertNonPixelToPixel(e,K.exec(this.val))}if(g=="fontSize"){e=e.parentNode}this.fontSize=Y.getStyle(e,"fontSize")}}L.prototype={fromPx:B};function A(e){var d=V.exec(e);return d&&d[2]||""}function B(e,l,k,f){k=this.val||k;var g=R.exec(k),h=e.ownerDocument.defaultView;if(g){if(g[0]){var i,j=parseFloat(k);if(!this.fontSize){if(l=="fontSize"){i=h[a](e,"").fontSize}else{i=f.fontSize}}i=parseFloat(i||this.fontSize);if(isFinite(j)){return j/i*this.fontSizeMultiplier+this.unit}}}if(!k){return""}else{if(isFinite(k)){return k+this.unit}}return k}var H={fromPx:function(e,g,f){e=this.parent;var d=e.ownerDocument.defaultView;containingBlockValue=d[a](e,"").width,containingBlockPx=parseFloat(containingBlockValue),thisPx=parseFloat(f),thisPercent=Math.ceil(thisPx/containingBlockPx*10000)/100;if(C.test(g)){if(thisPercent<0){thisPercent=0}}return thisPercent+"%"},exp:c};function S(d,e){this.p=e;this.parent=Y.getContainingBlock(d)}function G(d,e){this.p=e;this.parent=d.parentNode}S.prototype=G.prototype=H;G.prototype.exp=U;var X=(function(){var e=document.getElementsByTagName("head")[0],d,g,f;if(!e[P]){return false}f=e[Z];d=f.fontSize;f.fontSize=".4em";g=e[P].fontSize=="0em";f.fontSize=d;return g})()})();