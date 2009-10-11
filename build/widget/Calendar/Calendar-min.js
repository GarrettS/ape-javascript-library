APE.namespace("APE.widget");(function(){var C=self.APE,G=C.widget,E=C.dom;G.Calendar=C.createFactory(B,J);function B(K){this.id=K;if(I){return}H(this);this.initEvents()}var F=document.createElement("input");F.setAttribute("type","date");var I=G.Calendar.IS_NATIVE=/date/i.test(F.type),A=[31,28,31,30,31,30,31,31,30,31,30,31],D=null;F=null;function H(N){var K=document.getElementById(N.id),M=/(?:^|\s+)(\d{4})-(\d\d)-(\d\d)(?:$|\s+)/,L=M.exec(K.value);if(!L){N.displayDate=new Date}else{N.displayDate=new Date(0);N.displayDate.setFullYear(L[1],L[2]-1,L[3])}}function J(){return{hideOnSelect:true,initEvents:function(){if(I){return}var c=document,a=c.getElementById(this.id),b=EventPublisher=C.EventPublisher.add;b(a,"onfocus",R);b(a,"onblur",Q);if(!I){b(a,"onclick",R);b(c,"onmousedown",N)}},calendarId:"",hiddenDayClass:"ape-calendar-empty-day",calendarClass:"ape-calendar",_isHidden:undefined,show:function(a){H(this);a.visibility="visible"},hide:function(a){a.visibility="hidden"},onshow:X,onhide:X,onselect:X,getDate:function(){return new Date(this.displayDate)},setDate:function(a){this.displayDate=new Date(a);if(I){document.getElementById(this.id).value=W(this.displayDate);return}Y(this,a)}};function Y(m,v){var e=G.CalendarLocale;if(!e){throw Error("Missing Resource: APE.widget.CalendarLocale")}S(m);var y=new Date,t=document,l=v.getFullYear(),w=v.getMonth(),h=e.months.full[w],u=A[w],o,r=0,p=0,f=(0==(l%4))&&((0!=(l%100))||(0==(l%400))),k=t.getElementById(m.calendarId),c=k.getElementsByTagName("tbody")[0].getElementsByTagName("b"),x="textContent" in k?"textContent":"innerText",s=t.getElementById(m.calendarId+"-header"),b;o=new Date(v);o.setDate(1);o=o.getDay();s.firstChild.data=l+", "+h;if(w===1&&f){u+=1}while(r<o){b=c[r++];b[x]=" ";b.className=m.hiddenDayClass}while(p++<u){b=c[r++];b[x]=p;b.className=""}for(r=o+u,p=c.length;r<p;r++){b=c[r];b[x]=" ";b.className=m.hiddenDayClass}var n=t.getElementById(m.id+"-selected-day");if(n){n.id=""}if(y.getYear()==v.getYear()&&y.getMonth()==v.getMonth()){var g=o+y.getDate()-1;m.currentDayIndex=g;var q=c[g];E.addClass(q,m.calendarClass+"-today")}if(v.getYear()==v.getYear()&&v.getMonth()==v.getMonth()){var a=o+v.getDate();b=c[a-1];E.addClass(b,m.calendarClass+"-selected-day");b.id=m.id+"-selected-day"}}function S(g){if(!g.calendarId){g.calendarId=g.id+"-calendar"}var j=document;if(j.getElementById(g.calendarId)!==null){return}var k=j.createElement("div"),c=Array.prototype.join,e=c.call({length:7+1},"<td><b>&nbsp;</b></td>"),h=c.call({length:6+1},"<tr>"+e+"</tr>\n"),a=G.CalendarLocale,b=a.days.abbr,f="<tbody>"+h+"</tbody>",i="<thead><tr class='calendar-button-row'><th id='"+g.id+"-prev-year' title='"+a.previousYear+"'>&#x00ab;</th><th id='"+g.id+"-prev-month' title='"+a.previousMonth+"'>&#x2039;</th><th colspan='3' class='ape-calendar-header'><div id='"+g.calendarId+"-header'>&nbsp;</div></th><th id='"+g.id+"-next-month' title='"+a.nextMonth+"' class='"+g.calendarClass+"-days'>&#x203A;</th><th id='"+g.id+"-next-year' title='"+a.nextYear+"'>&#x00bb;</th></tr><tr><th>"+b.join("</th><th>")+"</th></tr></thead>";k.onselectstart=K;k.innerHTML="<table>"+i+f+"</table>";k.id=g.calendarId;k.className=g.calendarClass;k.onmousedown=k.onfocus=U;j.body.appendChild(k)}function R(b){b=b||self.event;var a=G.Calendar.getById(this.id);Z(a,b)}function Z(b,a){if(I){b.onshow(a);return}S(b);var c=document.getElementById(b.calendarId).style;b._isHidden=false;if(D!==null){if(D===b){return}else{T(D,a)}}O(b,c);D=b;b.onshow(a);b.show(c);b.setDate(b.displayDate)}function O(c,d){var a=document.getElementById(c.id),b=E.getOffsetCoords(a);d.left=b.x+"px";d.top=b.y+a.offsetHeight+"px"}function T(b,a){if(b._isHidden||b._hasFocus){return}b.onhide(a);if(I){return}if(D===b){D=null}b.hide(document.getElementById(b.calendarId).style);b._isHidden=true}function U(i){i=i||event;var h=E.Event.getTarget(i),g=this,c,f,d=h.id,b,a;c=G.Calendar.getById(g.id.replace(/-calendar$/,""));f=c.id;self.clearTimeout(c.hideTimer);b=f+"-selected-day";c._hasFocus=true;if(/^b$/i.test(h.tagName)){if(d!==b){a=+h.firstChild.data;if(a){L(c,a,h,b)}}}else{P(c,d,f)}}function L(c,a,g,b,f){var d;c._hasFocus=!c.hideOnSelect;d=document.getElementById(b);if(d){E.removeClass(d,"ape-calendar-selected-day");d.id=""}g.id=b;E.addClass(g,"ape-calendar-selected-day");V(c,a);c.onselect();if(c.hideOnSelect){setTimeout(function(){T(c,f);c._hasFocus=false;c=null},115)}}function P(b,c,d){var a=new Date(b.displayDate),e;if(c===d+"-next-year"){e=a.setFullYear(a.getFullYear()+1)}else{if(c===d+"-prev-year"){e=a.setFullYear(a.getFullYear()-1)}else{if(c===d+"-next-month"){e=a.setMonth(a.getMonth()+1)}else{if(c===d+"-prev-month"){e=a.setMonth(a.getMonth()-1)}}}}if(e){b.setDate(a)}}function V(c,a){c.displayDate.setDate(a);var b=W(c.displayDate);document.getElementById(c.id).value=b}function K(){return false}function X(){}function W(b){var d=M(b.getFullYear(),4,"0"),c=M(b.getMonth()+1,2,"0"),a=M(b.getDate(),2,"0");return d+"-"+c+"-"+a}function M(d,b,c){d+="";for(var a=d.length;a++<b;d=c+d){}return d}function Q(c){var b=G.Calendar.getById(this.id);b.hideTimer=self.setTimeout(a,10);function a(){T(b,c||self.event)}}function N(c){var b=E.Event.getTarget(c),a;if(D!==null){a=document.getElementById(D.calendarId);if(!a){D=null;return}if(E.contains(a,b)||b===a){return}D._hasFocus=false;T(D,c)}}}})();