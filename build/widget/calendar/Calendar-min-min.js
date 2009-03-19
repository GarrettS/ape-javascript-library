APE.namespace("APE.widget");APE.widget.Calendar=function(D){this.id=(typeof D=="string"?D:D.id);var C=document.getElementById(this.id);this.displayDate=new Date(C.value);if(isNaN(this.displayDate.valueOf())){this.displayDate=new Date}this.initEvents()};APE.widget.Calendar.getByNode=APE.getByNode;APE.widget.Calendar.getById=APE.getById;APE.widget.Calendar.focusHandler=function(B){APE.widget.Calendar.getById(this.id)._show(B)};APE.widget.Calendar.documentMouseDownHandler=function(K){var I=APE.dom,L=I.Event.getTarget(K),J=APE.widget.Calendar,H=J.activeCalendar,G;if(H){G=document.getElementById(H.calendarId);if(!G){J.activeCalendar=null;return}if(I.contains(G,L)||L===G){return}H._hasFocus=false;H._hide(K)}};APE.widget.Calendar.blurHandler=function(E){var F=APE.widget.Calendar.getByNode(this);F.hideTimer=setTimeout(function D(){F._hide(E||event)},10)};APE.widget.Calendar.mousedownHandler=function(J){J=J||event;var L=APE.dom,R=L.Event.getTarget(J),O,N,P;if(R.className=="ape-calendar"){O=R}else{O=L.findAncestorWithClass(R,"ape-calendar")}N=APE.widget.Calendar.getById(O.id.replace(/-calendar$/,""));P=N.id;N._hasFocus=true;clearTimeout(N.hideTimer);selectedId=P+"-selected-day";if(R.tagName.toLowerCase()=="b"){if(R.id===selectedId){return}var M=parseInt(R.firstChild.data);if(!M){return}var K=document.getElementById(selectedId);if(K){L.removeClass(K,"ape-calendar-selected-day");K.id=""}R.id=selectedId;L.addClass(R,"ape-calendar-selected-day");N.setDateOfMonth(M);N.onselect();if(N.hideOnSelect){setTimeout(function(){N._hide(J);N._hasFocus=false;N=null},115)}}else{var Q=new Date(N.displayDate);if(R.id===P+"-next-year"){Q.setYear(Q.getFullYear()+1);N.setDate(Q)}else{if(R.id===P+"-prev-year"){Q.setYear(Q.getFullYear()-1);N.setDate(Q)}else{if(R.id===P+"-next-month"){Q.setMonth(Q.getMonth()+1);N.setDate(Q)}else{if(R.id===P+"-prev-month"){Q.setMonth(Q.getMonth()-1);N.setDate(Q)}}}}}};APE.widget.Calendar.prototype={days:[31,28,31,30,31,30,31,31,30,31,30,31],hideOnSelect:true,initEvents:function(){var F=document,E=F.getElementById(this.id),G=APE.widget.Calendar,H=APE.EventPublisher;H.add(E,"onfocus",G.focusHandler);H.add(E,"onblur",G.blurHandler);H.add(E,"onclick",G.focusHandler);H.add(F,"onmousedown",G.documentMouseDownHandler)},id:"",calendarId:"",hiddenDayClass:"ape-calendar-empty-day",calendarClass:"ape-calendar",_isHidden:undefined,_show:function(G){if(!this.calendarId){this.create()}var H=document.getElementById(this.calendarId),F=H.style,E=this.constructor.activeCalendar;this._isHidden=false;if(E){if(E===this){return}else{E._hide()}}this.position(F);this.constructor.activeCalendar=this;this.show(F);this.onshow(G);this.setDate(this.displayDate)},position:function(E){var D=document.getElementById(this.id),F=APE.dom.getOffsetCoords(D);E.left=F.x+"px";E.top=F.y+D.offsetHeight+"px"},show:function(B){B.visibility="visible"},_hide:function(B){if(this._isHidden){return}if(this._hasFocus){return}this.onhide(B);if(this.constructor.activeCalendar===this){this.constructor.activeCalendar=null}this.hide(document.getElementById(this.calendarId).style);this._isHidden=true},hide:function(B){B.visibility="hidden"},onshow:function(){},onhide:function(){},onselect:function(){},create:function(){if(this.calendarId){return}this.calendarId=this.id+"-calendar";var O=document;if(O.getElementById(this.calendarId)){return}var S=O.createElement("div"),L=Array.prototype.join,K=L.call({length:7+1},"<td><b>&nbsp;</b></td>"),Q=L.call({length:6+1},"<tr>"+K+"</tr>\n"),R=APE.widget,N=R.CalendarLocale,M=N.days.abbr,T="<tbody>"+Q+"</tbody>",P="<thead><tr class='calendar-button-row'><th id='"+this.id+"-prev-year' title='"+N.previousYear+"'>&#x00ab;</th><th id='"+this.id+"-prev-month' title='"+N.previousMonth+"'>&#x2039;</th><th colspan='3' class='ape-calendar-header'><div id='"+this.calendarId+"-header'>&nbsp;</div></th><th id='"+this.id+"-next-month' title='"+N.nextMonth+"' class='"+this.calendarClass+"-days'>&#x203A;</th><th id='"+this.id+"-next-year' title='"+N.nextYear+"'>&#x00bb;</th></tr><tr><th>"+M.join("</th><th>")+"</th></tr></thead>";S.onselectstart=this.returnFalse;S.innerHTML="<table>"+P+T+"</table>";S.id=this.calendarId;S.className=this.calendarClass;S.onmousedown=S.onfocus=R.Calendar.mousedownHandler;O.body.appendChild(S)},returnFalse:function(B){return false},setDateOfMonth:function(C){this.displayDate.setDate(C);var D=this.formatDate();document.getElementById(this.id).value=D},getDate:function(){return new Date(this.displayDate)},formatDate:function(){return APE.widget.CalendarLocale.months.abbr[this.displayDate.getMonth()]+" "+this.displayDate.getDate()+", "+this.displayDate.getFullYear()},setDate:function(b){if(!this.calendarId){this.create()}var j=window.APE,q=j.widget.CalendarLocale;if(!q){throw Error("Missing Resource: APE.widget.CalendarLocale")}var Y=new Date,c=document,m=b.getFullYear(),a=b.getMonth(),n=q.months.full[a],u=this.days[a],i,e=0,h=0,p=(0==(m%4))&&((0!=(m%100))||(0==(m%400))),l=c.getElementById(this.calendarId),v=l.getElementsByTagName("table")[0].tBodies[0],r=v.getElementsByTagName("b"),Z="textContent" in l?"textContent":"innerText",f=c.getElementById(this.calendarId+"-header"),d=j.dom,s;i=new Date(b);i.setDate(1);i=i.getDay();f.firstChild.data=m+", "+n;if(a===1&&p){u+=1}while(e<i){s=r[e++];s[Z]=" ";s.className=this.hiddenDayClass}while(h++<u){s=r[e++];s[Z]=h;s.className=""}for(e=i+u,h=r.length;e<h;e++){s=r[e];s[Z]=" ";s.className=this.hiddenDayClass}var k=c.getElementById(this.id+"-selected-day");if(k){k.id=""}if(Y.getYear()==b.getYear()&&Y.getMonth()==b.getMonth()){var o=i+Y.getDate()-1;this.currentDayIndex=o;var g=r[o];d.addClass(g,this.calendarClass+"-today")}if(b.getYear()==b.getYear()&&b.getMonth()==b.getMonth()){var t=i+b.getDate();s=r[t-1];d.addClass(s,this.calendarClass+"-selected-day");s.id=this.id+"-selected-day"}this.displayDate=new Date(b)}};