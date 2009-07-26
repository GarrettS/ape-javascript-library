/**
 * @fileoverview Calendar Widget
 * @author Garrett Smith
 * 
 * @requires APE.dom.getOffsetCoords, APE.EventPublisher
 * @example <pre>
 * var calendar = APE.widget.Calendar.getById( "cal" );
 * calendar.create();
 * </pre>
 */

APE.namespace("APE.widget");

(function(){
    
    // If HTML 5 input type="date" is supported, exit.
    var inputTypeDate = document.createElement("input"),
        isHTML5Calendar;
    inputTypeDate.setAttribute("type", "date");
    isHTML5Calendar = /date/i.test(inputTypeDate.type);
    inputTypeDate = null;
    
    var widget = APE.widget;
    widget.Calendar = APE.createFactory(Calendar, createCalendarPrototype);
    
    /**
     * @constructor
     * @param {String} id the id of the input element.
     * @private
     */
    function Calendar( id ) {
        this.id = id;
        if(isHTML5Calendar) return;
        readDateFromInput(this);
        this.initEvents();
    }
        
   /** 
     * Days in months. JavaScript Date object does not provide this.
     * @type {[number]}
     */
    var daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31],
        activeCalendar = null;

    function createCalendarPrototype(){
        return {
                
            /** 
             * @type {boolean} 
             * @description set to <code>true</code> to hide the calendar when a
             * date is selected.
             */
            hideOnSelect : true,
        
            /**
             * This can generally be ignored.
             * Initializes events for calendar. If Calendar's html is regenerated (via innerHTML)
             * then call this method when calendar HTML is generated. 
             */
            initEvents : function() {
        
                var d = document, input = d.getElementById(this.id),
                    EventPublisher = APE.EventPublisher;
                    
                EventPublisher.add(input, "onfocus", calendarFocusHandler);
                EventPublisher.add(input, "onblur", calendarBlurHandler);
        
                // IE needs this because if calendar is 
                // not shown at pg load time, and input has focus,
                // onfocus won't fire when user clicks input.
                EventPublisher.add(input, "onclick", calendarFocusHandler);
                EventPublisher.add(d, "onmousedown", calendarDocumentMouseDownHandler);
            },
        
            /** 
             * @type {String}
             * @description the <code>id</code> of the Calendar instance (also the 
             * same as the html <code>input</code> element.
             */
            id : "",
            calendarId : "",
        
            hiddenDayClass : 'ape-calendar-empty-day',
            calendarClass : 'ape-calendar',
        
            /** @internal */
            _isHidden : undefined,
        
            /**
             * Shows the calendar. The first time this is called, 
             * the selectedDate is initialized.
             * @param {Event} e the DOM Event the triggered the action.
             * @fires onshow
             * @private
             */
            _show : function(e) {
                if(!this.calendarId) this.create();
                var calendar = document.getElementById(this.calendarId),
                    calStyle = calendar.style;
        
                this._isHidden = false;
        
                if(activeCalendar !== null) {
                    if(activeCalendar === this) {
                        return;
                    } else {
                        activeCalendar._hide();
                    }
                }
        
                this.position(calStyle);
                activeCalendar = this;
                this.show(calStyle);
                this.onshow(e);
        
                this.setDate(this.displayDate);
            },
        
            /** Positions the calendar just below the 
             * input using APE.dom.getOffsetCoords.
             * @param {CSSStyleDeclaration} calStyle the caledar element's style.
             */
            position : function(calStyle) {
                var input = document.getElementById(this.id),
                    coords = APE.dom.getOffsetCoords(input);
                calStyle.left = coords.x + "px";
                calStyle.top = coords.y + input.offsetHeight + "px";
            },
        
            /**
             * Shows the calendar by setting visibility to 'visible'.
             * @param {CSSStyleDeclaration} calStyle the caledar element's style.
             */
            show : function(calStyle) {        
                readDateFromInput(this);
                calStyle.visibility = "visible";
            },
        
            /**
             * Hides the calendar.
             * @param {Event} e the DOM Event the triggered the action.
             * @fires onhide(e)
             */
            _hide : function(e) {
                if(this._isHidden) return;
                if(this._hasFocus && !this.hideOnSelect) return;
        
                this.onhide(e);
                if(activeCalendar === this)
                    activeCalendar = null;
                this.hide(document.getElementById(this.calendarId).style);
                this._isHidden = true;
            },
        
            /**
             * Hides the calendar by setting visibility to "hidden"
             * @param {CSSStyleDeclaration} calStyle the calendar element's style.
             * @private
             */
            hide : function(calStyle) {
                calStyle.visibility = "hidden";
            },
        
            /** 
             * @event 
             * @description fires immediately after visibility has been set to "visible" 
             * in show();
             */
            onshow : function(){},
        
            /** 
             * @event 
             * @description fires immediately after visibility has been set to "hidden" 
             * in hide();
             */
            onhide : function(){},
        
            /** 
             * @event 
             * @description a date was selected.
             */
            onselect : function(){},
        
            /** 
             * creates the HTML used for the calendar.
             */
            create : function() {
                if(this.calendarId) return;
        
                this.calendarId = this.id + "-calendar";
                
                var d = document;
                if(d.getElementById(this.calendarId)) return;
        
                var calendar = d.createElement("div"),
                    join = Array.prototype.join,
                    td = join.call({length:7+1}, "<td><b>&nbsp;</b></td>"),
                    trs = join.call({length:6+1}, "<tr>"+td+"</tr>\n"),
                    widget = APE.widget,
                    Locale = widget.CalendarLocale,
                    dayNames = Locale.days.abbr, 
                    calendarBody = "<tbody>" + trs + "</tbody>",
                    calendarHead = "<thead>" 
                    +"<tr class='calendar-button-row'><th id='"+this.id+ "-prev-year' title='" 
                    + Locale.previousYear + "'>&#x00ab;</th>"
                    +"<th id='"+this.id+ "-prev-month' title='" + Locale.previousMonth + "'>&#x2039;</th>"
                    +"<th colspan='3' class='ape-calendar-header'><div id='"+this.calendarId+"-header'"
                    +">&nbsp;</div></th>"
                    +"<th id='"+this.id+ "-next-month' title='" + Locale.nextMonth 
                    +"' class='"+this.calendarClass+"-days'>&#x203A;</th>"
                    +"<th id='"+this.id+ "-next-year' title='" + Locale.nextYear + "'>&#x00bb;</th></tr>"
                    +"<tr><th>" 
                    + dayNames.join("</th><th>")
                    + "</th></tr>"
                    +"</thead>";
                
                calendar.onselectstart = returnFalse;
                calendar.innerHTML =  "<table>" 
                    + calendarHead + calendarBody
                    + "</table>";
                calendar.id = this.calendarId;
                calendar.className = this.calendarClass;
                calendar.onmousedown = calendar.onfocus = calendarMousedownHandler;
                d.body.appendChild(calendar);
            },
        
            /** 
             * Sets the date of the month. 
             */
            setDateOfMonth : function(dateOfMonth) {
                this.displayDate.setDate(dateOfMonth);
                var formatted = this.formatDate();
                document.getElementById(this.id).value = formatted;
            },
            
            /**
             * @return {Date} a copy of the internal Date 
             * representing calendar's currently selected date.
             */
            getDate : function() {
                return new Date(this.displayDate);
            },
        
            /** 
             * formats the date in default of MM dd, yyyy. Looks like 
             * January 4, 2009.
             * Override this to format <code>this.selectedDate</code>.
             */
            formatDate : (function() {
                return formatDate;
        
                function formatDate() {
                    var yyyy = padLeft(this.displayDate.getFullYear(), 4, "0"),
                        mm = padLeft(this.displayDate.getMonth() + 1, 2, "0"),
                        dd =  padLeft(this.displayDate.getDate(), 2, "0");
                    return yyyy + "-" + mm + "-" + dd;
                }
        
                function padLeft(input, size, ch) {
                    var s = input + "";
                    while(s.length < size) {
                      s = ch + s;
                    }
                    return s;
                }
            })(),
        
            /**
             * Sets the internal date object represented by the calendar.
             * @internal
             */
            setDate : function(date) {
                if(!this.calendarId) this.create();
                var APE = window.APE,
                    CalendarLocale = APE.widget.CalendarLocale;
                if(!CalendarLocale) throw Error("Missing Resource: APE.widget.CalendarLocale");
                        
                var curDate = new Date,
                    d = document,
                    year = date.getFullYear(),
                    month = date.getMonth(),
                    monthName = CalendarLocale.months.full[month],
                    daysInThisMonth = daysInMonth[month],
                    firstDayOfMonth,
                    i = 0,
                    j = 0,
                    isLeapYear = (0 == (year%4)) && ( (0 != (year%100)) || (0 == (year%400))),
                    calendar = d.getElementById(this.calendarId),
                    tbody = calendar.getElementsByTagName("table")[0].tBodies[0],
                    dayElements = tbody.getElementsByTagName("b"),
                    textContent = "textContent"in calendar ? "textContent" : "innerText",
                    calendarHeader = d.getElementById(this.calendarId+"-header"),
                    dom = APE.dom,
                    dayElement;
            
                firstDayOfMonth = new Date(date);
                firstDayOfMonth.setDate(1);
                firstDayOfMonth = firstDayOfMonth.getDay();
        
                calendarHeader.firstChild.data = year + ", " + monthName;
        
                if(month === 1 && isLeapYear)
                    daysInThisMonth += 1;
        
                while(i < firstDayOfMonth) {
                    dayElement = dayElements[i++];
                    dayElement[textContent] = ' ';
                    dayElement.className = this.hiddenDayClass;
                }
                // Fill in days.
                while(j++ < daysInThisMonth) { 
                    dayElement = dayElements[i++];
                    dayElement[textContent] = j;
                    dayElement.className = '';
                }
        
        //        alert(dayElements.length + ", " + i + ", " + j);
        
                for(i = firstDayOfMonth + daysInThisMonth, j = dayElements.length; i < j; i++){
                    dayElement = dayElements[i];
                    dayElement[textContent] = ' ';
                    dayElement.className = this.hiddenDayClass;
                }
        
                var selected = d.getElementById(this.id + "-selected-day");
                if(selected) {
                    selected.id = "";
                }
        
                // Need to hilite current day.
                if(curDate.getYear() == date.getYear() && curDate.getMonth() == date.getMonth()) {
                    var currentDay = firstDayOfMonth + curDate.getDate()-1;
                    this.currentDayIndex = currentDay;
                    var day = dayElements[currentDay];
                    dom.addClass(day, this.calendarClass + "-today");
                }
                if(date.getYear() == date.getYear() 
                    && date.getMonth() == date.getMonth()) {
                    var selectedDayIndex = firstDayOfMonth + date.getDate();
                    dayElement = dayElements[selectedDayIndex - 1];
                    dom.addClass(dayElement, this.calendarClass + "-selected-day");
                    dayElement.id = this.id + "-selected-day";
                }
                this.displayDate = new Date(date);
            }
        };
    }
    
    // Private static methods---------------------------------------------------
    
    function returnFalse() {return false;}

    function readDateFromInput(calendar) {
        var input = document.getElementById(calendar.id),
            iso8601Exp = /(?:^|\s+)(\d{4})-(\d\d)-(\d\d)(?:$|\s+)/,
            split = iso8601Exp.exec(input.value);
        if(!split) {
            calendar.displayDate = new Date;
        } else {
            calendar.displayDate = new Date(0);
            calendar.displayDate.setFullYear(split[1], split[2]-1, split[3]);
        }
    }

    /**
     * @param {Event} e event parameter for blur event.
     * @description called when the document receives a mousedown event.
     */
    function calendarBlurHandler(e) {
        var calendar = widget.Calendar.getById(this.id);
    
        // A delay window here to cancel focus from the mousedown handler.
        // ideally, we could check e.explicitOriginalTarget, 
        // and that actually works in Mozilla! But it doesn't 
        // work in any other browsers. Even IE's toElement 
        // doesn't contain the non-focusable toElement for blur.
        calendar.hideTimer = setTimeout(function blurHandler(){calendar._hide(e||event);}, 10);
    }
    
    /**
     * @param {Event} e event parameter for focus event.
     * @description called when the input receives focus or click events.
     */
    function calendarFocusHandler(e) {
        widget.Calendar.getById(this.id)._show(e);
    }

    function calendarDocumentMouseDownHandler(e){
        var dom = APE.dom,
            target = dom.Event.getTarget(e),
            calendarEl;
        if(activeCalendar !== null) {
            calendarEl = document.getElementById(activeCalendar.calendarId);
    
            // If the innerHTML was wiped or something. 
            // This is a document event handler. Anything can happen. 
            if(!calendarEl) {
                activeCalendar = null;
                return;
            }
            if(dom.contains(calendarEl, target) || target === calendarEl) return;
            
            activeCalendar._hasFocus = false;
            activeCalendar._hide(e);
        }
    }
    
    /**
     * @param {Event} e event parameter for click event.
     * @description called when calendar is clicked.
     */
    function calendarMousedownHandler(e) {
        e = e||event;
        var dom = APE.dom,
            target = dom.Event.getTarget(e),
            calendarDiv,
            calendarObject,
            calId;
            
        if(target.className == "ape-calendar") {
            calendarDiv = target;
        }
        else {
            calendarDiv = dom.findAncestorWithClass(target, "ape-calendar");
        }
        calendarObject = widget.Calendar.getById(calendarDiv.id.replace(/-calendar$/,""));
        calId = calendarObject.id;
    
        // Canceled the hide action that will be caused by blur().
        calendarObject._hasFocus = true;
        clearTimeout(calendarObject.hideTimer);
    
        selectedId = calId + "-selected-day";
    
        if(/^b$/i.test(target.tagName)) {
           if(target.id !== selectedId) {
    
                var selectedIndex = +target.firstChild.data,
                    selected;
        
                if(!selectedIndex) return;
                
                selected = document.getElementById(selectedId);
                if(selected) {
                    dom.removeClass(selected, "ape-calendar-selected-day");
                    selected.id = "";
                }
                target.id = selectedId;
                dom.addClass(target, "ape-calendar-selected-day");
                calendarObject.setDateOfMonth(selectedIndex);
            
                calendarObject.onselect();
                if(calendarObject.hideOnSelect) {
                    setTimeout(function(){
                        calendarObject._hide(e);
                        calendarObject._hasFocus = false;
                        calendarObject = null;
                    }, 115);
                }
           }
        }
        else {
            var newDate = new Date(calendarObject.displayDate);
            if(target.id === calId + "-next-year") {
                newDate.setFullYear(newDate.getFullYear() + 1);
                calendarObject.setDate(newDate);
            } else if(target.id === calId + "-prev-year") {
                newDate.setFullYear(newDate.getFullYear() - 1);
                calendarObject.setDate(newDate);
            } else if(target.id === calId + "-next-month") {
                newDate.setMonth(newDate.getMonth() + 1);
                calendarObject.setDate(newDate);
            } else if(target.id === calId + "-prev-month") {
                newDate.setMonth(newDate.getMonth() - 1);
                calendarObject.setDate(newDate);
            }
        }
    }
})();