APE.namespace("APE.dom");
(function(){function l(b){b=b||window;var c;c="pageXOffset"in b?function(a){a=a||window;return{left:a.pageXOffset,top:a.pageYOffset}}:function(a){a=a||window;a=a.document[h?"body":d];return{left:a.scrollLeft,top:a.scrollTop}};c=(this.getScrollOffsets=c)(b);b=null;return c}function m(b){function c(e){e=(e||window)[a][f];return{width:e[i],height:e[j]}}b=b||window;var a="document",f=a,g=b[a],k="client",i,j;if(typeof g.clientWidth=="number")a="window";else if(h){a=d;f="body"}else if(g[d].clientHeight>0)f=
d;i=k+"Width";j=k+"Height";r=(this.getViewportDimensions=c)(b);b=g=null;return r}APE.mixin(APE.dom,{getScrollOffsets:l,getViewportDimensions:m});var d="documentElement",h=document[d].clientWidth===0})();
