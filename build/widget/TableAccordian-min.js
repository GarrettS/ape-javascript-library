function TableAccordian(a,b){this.id=a;this.duration=(b||300)/1E3;this.rows=[];this.sheet=new APE.dom.StyleSheetAdapter(this.id+"Sheet")}TableAccordian.getById=APE.getById;TableAccordian.prototype={getRow:function(a){var b;b=this.rows[a];if(!b){b=document.getElementById(this.id);b=TableAccordian.Row.getByNode(b.rows[a],this);this.rows[a]=b}return b},toggleRow:function(a){this.getRow(a).toggle()},openRow:function(a){this.getRow(a).open()},closeRow:function(a){this.getRow(a).close()}};
TableAccordian.Row=function(a,b){APE.anim.Animation.call(this,b.duration);this.transition=APE.anim.Transitions.accel;this.id=a.id;var d="#"+b.id+" #"+a.id+" .tableAccordian",c=b.sheet.getRule(d);c||(c=b.sheet.addRule(d));this.style=c.style;this.isExpanded=a.offsetHeight!=0;this.maxHeight=this.getRowHeight(a);this.isReversed=this.isExpanded;c.style.height="0";a.style.display=""};TableAccordian.Row.name="TableAccordianRow";TableAccordian.Row.getByNode=APE.getByNode;
APE.extend(TableAccordian.Row,APE.anim.Animation,{run:function(a){a=1-a;if("opacity"in this.style)this.style.opacity=String(a);else this.style.filter="alpha(opacity="+(0|a*100)+")";this.style.height=a*this.maxHeight+"px"},onstart:function(){this.isExpanded=!this.isExpanded},toggle:function(){this.isExpanded?this.seekTo(1):this.seekTo(0)},open:function(){this.isExpanded&&this.seekTo(0)},close:function(){this.isExpanded&&this.seekTo(1)},getRowHeight:function(){var a=document.getElementById(this.id),
b=a.cells[0],d=b.style,c=a.style;a=a.parentNode.style;var f=d.cssText,g=c.cssText,h=a.cssText,e=b.currentStyle?"display: block;":"";d.cssText=e+"display: table-cell";c.cssText=e+"display: table-row;";a.cssText=e+"display: table-row-group";d.height=c.height=a.height="auto";e=b.clientHeight;d.height=e+"px";b=b.clientHeight-e;d.cssText=f;c.cssText=g;a.cssText=h;return e-b}});
