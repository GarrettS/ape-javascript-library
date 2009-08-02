APE.namespace("APE.widget");(function(){var E=APE.widget;E.Calendar=APE.createFactory(G,F);function G(I){this.id=I;if(E.Calendar.IS_NATIVE){return}B(this);this.initEvents()}var A=document.createElement("input");A.setAttribute("type","date");var D=E.Calendar.IS_NATIVE=/date/i.test(A.type);A=null;var C=[31,28,31,30,31,30,31,31,30,31,30,31],H=null;function F(){return{hideOnSelect:true,initEvents:function(){if(D){return}var X=document,V=X.getElementById(this.id),W=APE.EventPublisher;W.add(V,"onfocus",N);W.add(V,"onblur",M);if(!D){W.add(V,"onclick",N);W.add(X,"onmousedown",K)}},calendarId:"",hiddenDayClass:"ape-calendar-empty-day",calendarClass:"ape-calendar",_isHidden:undefined,position:function(X){var V=document.getElementById(this.id),W=APE.dom.getOffsetCoords(V);X.left=W.x+"px";X.top=W.y+V.offsetHeight+"px"},show:function(V){B(this);V.visibility="visible"},hide:function(V){V.visibility="hidden"},onshow:function(){},onhide:function(){},onselect:function(){},getDate:function(){return new Date(this.displayDate)},setDate:function(V){this.displayDate=new Date(V);if(D){document.getElementById(this.id).value=S(this.displayDate);return}T(this,V)}};function T(g,t){var k=window.APE,Z=k.widget.CalendarLocale;if(!Z){throw Error("Missing Resource: APE.widget.CalendarLocale")}O(g);var w=new Date,r=document,f=t.getFullYear(),u=t.getMonth(),c=Z.months.full[u],s=C[u],l,p=0,m=0,a=(0==(f%4))&&((0!=(f%100))||(0==(f%400))),e=r.getElementById(g.calendarId),V=e.getElementsByTagName("table")[0].tBodies[0],Y=V.getElementsByTagName("b"),v="textContent" in e?"textContent":"innerText",o=r.getElementById(g.calendarId+"-header"),q=k.dom,X;l=new Date(t);l.setDate(1);l=l.getDay();o.firstChild.data=f+", "+c;if(u===1&&a){s+=1}while(p<l){X=Y[p++];X[v]=" ";X.className=g.hiddenDayClass}while(m++<s){X=Y[p++];X[v]=m;X.className=""}for(p=l+s,m=Y.length;p<m;p++){X=Y[p];X[v]=" ";X.className=g.hiddenDayClass}var h=r.getElementById(g.id+"-selected-day");if(h){h.id=""}if(w.getYear()==t.getYear()&&w.getMonth()==t.getMonth()){var b=l+w.getDate()-1;g.currentDayIndex=b;var n=Y[b];q.addClass(n,g.calendarClass+"-today")}if(t.getYear()==t.getYear()&&t.getMonth()==t.getMonth()){var W=l+t.getDate();X=Y[W-1];q.addClass(X,g.calendarClass+"-selected-day");X.id=g.id+"-selected-day"}}function O(a){if(!a.calendarId){a.calendarId=a.id+"-calendar"}var f=document;if(f.getElementById(a.calendarId)!==null){return}var g=f.createElement("div"),X=Array.prototype.join,Y=X.call({length:7+1},"<td><b>&nbsp;</b></td>"),c=X.call({length:6+1},"<tr>"+Y+"</tr>\n"),b=APE.widget,V=b.CalendarLocale,W=V.days.abbr,Z="<tbody>"+c+"</tbody>",e="<thead><tr class='calendar-button-row'><th id='"+a.id+"-prev-year' title='"+V.previousYear+"'>&#x00ab;</th><th id='"+a.id+"-prev-month' title='"+V.previousMonth+"'>&#x2039;</th><th colspan='3' class='ape-calendar-header'><div id='"+a.calendarId+"-header'>&nbsp;</div></th><th id='"+a.id+"-next-month' title='"+V.nextMonth+"' class='"+a.calendarClass+"-days'>&#x203A;</th><th id='"+a.id+"-next-year' title='"+V.nextYear+"'>&#x00bb;</th></tr><tr><th>"+W.join("</th><th>")+"</th></tr></thead>";g.onselectstart=I;g.innerHTML="<table>"+e+Z+"</table>";g.id=a.calendarId;g.className=a.calendarClass;g.onmousedown=g.onfocus=Q;f.body.appendChild(g)}function N(W){var V=E.Calendar.getById(this.id);U(V,W)}function U(W,V){if(D){W.onshow(V);return}O(W);var X=document.getElementById(W.calendarId).style;W._isHidden=false;if(H!==null){if(H===W){return}else{P(H,V)}}L(W,X);H=W;W.onshow(V);W.show(X);W.setDate(W.displayDate)}function L(X,Y){var V=document.getElementById(X.id),W=APE.dom.getOffsetCoords(V);Y.left=W.x+"px";Y.top=W.y+V.offsetHeight+"px"}function P(W,V){if(W._isHidden||W._hasFocus){return}W.onhide(V);if(D){return}if(H===W){H=null}W.hide(document.getElementById(W.calendarId).style);W._isHidden=true}function Q(a){a=a||event;var Y=APE.dom,b=Y.Event.getTarget(a),f=this,g,d,Z,W;g=E.Calendar.getById(f.id.replace(/-calendar$/,""));d=g.id;window.clearTimeout(g.hideTimer);W=d+"-selected-day";g._hasFocus=true;if(/^b$/i.test(b.tagName)){if(b.id!==W){var V=+b.firstChild.data,X;if(!V){return}g._hasFocus=!g.hideOnSelect;X=document.getElementById(W);if(X){Y.removeClass(X,"ape-calendar-selected-day");X.id=""}b.id=W;Y.addClass(b,"ape-calendar-selected-day");R(g,V);g.onselect();if(g.hideOnSelect){setTimeout(function(){P(g,a);g._hasFocus=false;g=null},115)}}}else{var c=new Date(g.displayDate);if(b.id===d+"-next-year"){c.setFullYear(c.getFullYear()+1);g.setDate(c)}else{if(b.id===d+"-prev-year"){c.setFullYear(c.getFullYear()-1);g.setDate(c)}else{if(b.id===d+"-next-month"){c.setMonth(c.getMonth()+1);g.setDate(c)}else{if(b.id===d+"-prev-month"){c.setMonth(c.getMonth()-1);g.setDate(c)}}}}}}function R(X,V){X.displayDate.setDate(V);var W=S(X.displayDate);document.getElementById(X.id).value=W}function I(){return false}function S(W){var Y=J(W.getFullYear(),4,"0"),X=J(W.getMonth()+1,2,"0"),V=J(W.getDate(),2,"0");return Y+"-"+X+"-"+V}function J(Y,W,X){Y+="";for(var V=Y.length;V++<W;Y=X+Y){}return Y}function M(X){var W=E.Calendar.getById(this.id);W.hideTimer=window.setTimeout(V,10);function V(){P(W,X||window.event)}}function K(X){var Y=APE.dom,W=Y.Event.getTarget(X),V;if(H!==null){V=document.getElementById(H.calendarId);if(!V){H=null;return}if(Y.contains(V,W)||W===V){return}H._hasFocus=false;P(H,X)}}}function B(L){var I=document.getElementById(L.id),K=/(?:^|\s+)(\d{4})-(\d\d)-(\d\d)(?:$|\s+)/,J=K.exec(I.value);if(!J){L.displayDate=new Date}else{L.displayDate=new Date(0);L.displayDate.setFullYear(J[1],J[2]-1,J[3])}}})();