
/**
 * @fileoverview Calendar Widget
 * @author Garrett Smith
 * 
 * @requires APE.dom.getOffsetCoords, APE.EventPublisher
 * @example <pre>
 * var calendar = APE.widget.Calendar.getById( "cal" );
 * </pre>
 */

APE.namespace("APE.widget");

(function(){
    
    var APE = self.APE,
        widget = APE.widget, 
        dom = APE.dom;
    widget.Calendar = APE.createFactory(Calendar, createCalendarPrototype);

    /**
     * @constructor
     * @param {String} id the id of the input element.
     * @private
     */
    function Calendar( id ) {
        this.id = id;
        if(IS_NATIVE) return;
        readDateFromInput(this);
        this.initEvents();
    }
    
    // Determine if input type="date" is supported.
    // If HTML 5 input type="date" is supported, exit.
    var inputTypeDate = document.createElement("input");
    inputTypeDate.setAttribute("type", "date");
    var IS_NATIVE = widget.Calendar.IS_NATIVE = /date/i.test(inputTypeDate.type),
        daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31],
        activeCalendar = null;
        
    inputTypeDate = null;
    
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

    function createCalendarPrototype(){
        return {     
            /** set to <code>true</code> to hide the calendar when a date is selected. */
            hideOnSelect : true,
        
            /** call initEvents if/when calendar HTML is Calendar's html is regenerated (via innerHTML). 
             */
            initEvents : function() {
                if(IS_NATIVE) return;
                
                var d = document, 
                    input = d.getElementById(this.id),
                    addCallback = EventPublisher = APE.EventPublisher.add;
                    
                addCallback(input, "onfocus", calendarFocusHandler);
                addCallback(input, "onblur", calendarBlurHandler);
        
                if(!IS_NATIVE) {
                    // IE needs this because if calendar is 
                    // not shown at pg load time, and input has focus,
                    // onfocus won't fire when user clicks input.
                    addCallback(input, "onclick", calendarFocusHandler);
                    addCallback(d, "onmousedown", calendarDocumentMouseDownHandler);
               }
            },
        
            calendarId : "",
        
            hiddenDayClass : 'ape-calendar-empty-day',
            calendarClass : 'ape-calendar',
        
            /** @internal */
            _isHidden : 0,
                
            /** Shows the calendar by setting visibility to 'visible'.
             * @param {CSSStyleDeclaration} calStyle the caledar element's style.
             * Used internally, but may be overridden.
             */
            show : function(calStyle) {        
                readDateFromInput(this);
                calStyle.visibility = "visible";
            },
       
            /**
             * Hides the calendar by setting visibility to "hidden"
             * @param {CSSStyleDeclaration} calStyle the calendar element's style.
             * Used internally, but may be overridden.
             */
            hide : function(calStyle) {
                calStyle.visibility = "hidden";
            },
        
            /** @event 
             * @description fires immediately after visibility has been set to "visible" in show();
             */
            onshow : noop,
        
            /** @event 
             * @description fires immediately after visibility has been set to "hidden" in hide();
             */
            onhide : noop,
        
            /**@event 
             * @description a date was selected. */
            onselect : noop,
        
            /**
             * @return {Date} a copy of the internal Date 
             * representing calendar's currently selected date.
             */
            getDate : function() {
                return new Date(this.displayDate);
            },
                
            /** Sets the internal date object represented by the calendar.
             * @internal
             */
            setDate : function(date) {
                
                this.displayDate = new Date(date);

                if(IS_NATIVE) {
                    document.getElementById(this.id).value = formatDate(this.displayDate);
                    return;
                }
                updateCalendarWidget(this, date);
            }
        };

        // Private static prototype methods---------------------------------------------.
        
        function updateCalendarWidget(calendar, date) {
            var CalendarLocale = widget.CalendarLocale;
            if(!CalendarLocale) throw Error("Missing Resource: APE.widget.CalendarLocale");
                    
            createCalendarOnDemand(calendar); 
            
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
                calendarEl = d.getElementById(calendar.calendarId),
                dayElements = calendarEl.getElementsByTagName("tbody")[0].getElementsByTagName("b"),
                textContent = "textContent"in calendarEl ? "textContent" : "innerText",
                calendarHeader = d.getElementById(calendar.calendarId+"-header"),
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
                dayElement.className = calendar.hiddenDayClass;
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
                dayElement.className = calendar.hiddenDayClass;
            }
    
            var selected = d.getElementById(calendar.id + "-selected-day");
            if(selected) {
                selected.id = "";
            }
    
            // Need to hilite current day.
            if(curDate.getYear() == date.getYear() && curDate.getMonth() == date.getMonth()) {
                var currentDay = firstDayOfMonth + curDate.getDate()-1;
                calendar.currentDayIndex = currentDay;
                var day = dayElements[currentDay];
                dom.addClass(day, calendar.calendarClass + "-today");
            }
            if(date.getYear() == date.getYear() 
                && date.getMonth() == date.getMonth()) {
                var selectedDayIndex = firstDayOfMonth + date.getDate();
                dayElement = dayElements[selectedDayIndex - 1];
                dom.addClass(dayElement, calendar.calendarClass + "-selected-day");
                dayElement.id = calendar.id + "-selected-day";
            }
        }
        
        /** creates the HTML used for the calendar. */        
        function createCalendarOnDemand(calendar) {
            if(!calendar.calendarId) {
                calendar.calendarId = calendar.id + "-calendar";
            }
            var d = document;

            if(d.getElementById(calendar.calendarId) !== null) return;
            
            var calendarEl = d.createElement("div"),
                join = Array.prototype.join,
                td = join.call({length:7+1}, "<td><b>&nbsp;</b></td>"),
                trs = join.call({length:6+1}, "<tr>"+td+"</tr>\n"),
                Locale = widget.CalendarLocale,
                dayNames = Locale.days.abbr, 
                calendarBody = "<tbody>" + trs + "</tbody>",
                calendarHead = "<thead>" 
                +"<tr class='calendar-button-row'><th id='"+calendar.id+ "-prev-year' title='" 
                + Locale.previousYear + "'>&#x00ab;</th>"
                +"<th id='"+calendar.id+ "-prev-month' title='" + Locale.previousMonth + "'>&#x2039;</th>"
                +"<th colspan='3' class='ape-calendar-header'><div id='"+calendar.calendarId+"-header'"
                +">&nbsp;</div></th>"
                +"<th id='"+calendar.id+ "-next-month' title='" + Locale.nextMonth 
                +"' class='"+calendar.calendarClass+"-days'>&#x203A;</th>"
                +"<th id='"+calendar.id+ "-next-year' title='" + Locale.nextYear + "'>&#x00bb;</th></tr>"
                +"<tr><th>" 
                + dayNames.join("</th><th>")
                + "</th></tr>"
                +"</thead>";
            
            calendarEl.onselectstart = returnFalse;
            calendarEl.innerHTML =  "<table>" 
                + calendarHead + calendarBody
                + "</table>";
            calendarEl.id = calendar.calendarId;
            calendarEl.className = calendar.calendarClass;
            calendarEl.onmousedown = calendarEl.onfocus = calendarMousedownHandler;
            d.body.appendChild(calendarEl);
        }

        /**
         * @param {Event} e event parameter for focus event.
         * @description called when the input receives focus or click events.
         */
        function calendarFocusHandler(e) {
            e = e||self.event;
            var calendar = widget.Calendar.getById(this.id);
            _showCalendar(calendar, e);
        }

        /**
         * Shows the calendar. The first time this is called, 
         * the selectedDate is initialized.
         * @param {Event} e the DOM Event the triggered the action.
         * @fires onshow
         * @private
         */
        function _showCalendar(calendar, e) {
            if(IS_NATIVE) {
                calendar.onshow(e);
                return;
            }
            createCalendarOnDemand(calendar);
            
            var calStyle = document.getElementById(calendar.calendarId).style;
    
            calendar._isHidden = false;
    
            if(activeCalendar !== null) {
                if(activeCalendar === calendar) {
                    return;
                } else {
                    _hideCalendar(activeCalendar, e);
                }
            }
    
            position(calendar, calStyle);
            activeCalendar = calendar;
            calendar.onshow(e);
            calendar.show(calStyle);    
            calendar.setDate(calendar.displayDate);
        }

        /** Positions the calendar just below the 
         * input using APE.dom.getOffsetCoords.
         * @param {CSSStyleDeclaration} calStyle the caledar element's style.
         */
        function position(calendar, calStyle) {
            var input = document.getElementById(calendar.id),
                coords = dom.getOffsetCoords(input);
            calStyle.left = coords.x + "px";
            calStyle.top = coords.y + input.offsetHeight + "px";
        }
    
        /**
         * Hides the calendar.
         * @param {Event} e the DOM Event the triggered the action.
         * @fires onhide(e)
         */
        function _hideCalendar(calendar, ev) {
            if(calendar._isHidden || calendar._hasFocus) return;

            calendar.onhide(ev);
            if(IS_NATIVE) return;
            
            if(activeCalendar === calendar)
                activeCalendar = null;
            calendar.hide(document.getElementById(calendar.calendarId).style);
            calendar._isHidden = true;
        }
        

        /**
         * @param {Event} e event parameter for click event.
         * @description called when calendar is clicked.
         */
        function calendarMousedownHandler(e) {
            e = e||window.event;
            var target = dom.Event.getTarget(e),
                calendarDiv = this,
                calendarObject,
                calId,
                targetId = target.id,
                selectedId,
                selectedIndex;
                
            calendarObject = widget.Calendar.getById(calendarDiv.id.replace(/-calendar$/,""));
            calId = calendarObject.id;

            clearTimeout(calendarObject.hideTimer);
        
            selectedId = calId + "-selected-day";
            calendarObject._hasFocus = true;
            
            if(/^b$/i.test(target.tagName)) {
                if(targetId !== selectedId) {
                    selectedIndex = +target.firstChild.data;
                    // Days are 1-31.
                    if(selectedIndex){
                        selectDay(calendarObject, selectedIndex, target, selectedId);
                    }
                }
            } else {
                selectMonthOrYear(calendarObject, targetId, calId);
            }
        }
        
        /**
         * Sets the className on the day the user selected.
         *  @param {int] selectedIndex day selected
         *  @param {HTMLElement} target the element the user clicked.
         *  @param (string} selectedId new id to give to target.
         */
        function selectDay(calendarObject, selectedIndex, target, selectedId, e){
            var selected;            

            // Canceled the hide action that will be caused by blur().
            calendarObject._hasFocus = !calendarObject.hideOnSelect;
            selected = document.getElementById(selectedId);
            
            if(selected) {
                dom.removeClass(selected, "ape-calendar-selected-day");
                selected.id = "";
            }
            target.id = selectedId;
            dom.addClass(target, "ape-calendar-selected-day");
            setDateOfMonth(calendarObject, selectedIndex);
        
            calendarObject.onselect();
            if(calendarObject.hideOnSelect) {
                setTimeout(function(){
                    _hideCalendar(calendarObject, e);
                    calendarObject._hasFocus = false;
                    calendarObject = null;
                }, 115);
            }
        }

        function selectMonthOrYear(calendarObject, targetId, calId) {
            var newDate = new Date(calendarObject.displayDate),
                selected;
            if(targetId === calId + "-next-year") {
                selected = newDate.setFullYear(newDate.getFullYear() + 1);
            } else if(targetId === calId + "-prev-year") {
                selected = newDate.setFullYear(newDate.getFullYear() - 1);
            } else if(targetId === calId + "-next-month") {
                selected = newDate.setMonth(newDate.getMonth() + 1);
            } else if(targetId === calId + "-prev-month") {
                selected = newDate.setMonth(newDate.getMonth() - 1);
            }
            if(selected) {
                calendarObject.setDate(newDate);
            }
        }
        
        /** 
         * Sets the date of the month. 
         */
        function setDateOfMonth(calendar, dateOfMonth) {
            calendar.displayDate.setDate(dateOfMonth);
            var formatted = formatDate(calendar.displayDate);
            document.getElementById(calendar.id).value = formatted;
        }
        
        function returnFalse() {return false;}
        function noop(){}
        
         /** 
         * formats the date in default of MM dd, yyyy. Looks like 
         * January 4, 2009.
         * Override this to format <code>this.selectedDate</code>.
         */
         function formatDate(dateInRange) {
             var yyyy = ("000" + dateInRange.getFullYear()).slice(-4),
                 mm = ("0" + (dateInRange.getMonth() + 1)).slice(-2),
                 dd = ("0" + (dateInRange.getDate())).slice(-2);
             return yyyy + "-" + mm + "-" + dd;
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
            calendar.hideTimer = setTimeout(blurHandler, 10);
            function blurHandler(){
                _hideCalendar(calendar, e||self.event);
            }
        }

        function calendarDocumentMouseDownHandler(e){
            var target = dom.Event.getTarget(e),
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
                _hideCalendar(activeCalendar, e);
            }
        }    
    }    
})();