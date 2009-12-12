
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
     * TODO: add support for min/max attributes.
     */
    function Calendar( id ) {
        this.id = id;
        if(IS_NATIVE) return;
        this._isHidden = true;
        this.initEvents();
    }
    
    // Determine if input type="date" is supported.
    // If HTML 5 input type="date" is supported, exit.
    var inputTypeDate = document.createElement("input");
    inputTypeDate.setAttribute("type", "date");
    var IS_NATIVE = widget.Calendar.IS_NATIVE = /date/i.test(inputTypeDate.type),
        daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
        
    inputTypeDate = null;
    
    function readDateFromInput(calendar) {
        var input = document.getElementById(calendar.id),
            iso8601Exp = /(?:^|\s+)(\d{4})-(\d\d)-(\d\d)(?:$|\s+)/,
            split = iso8601Exp.exec(input.value),
            displayDate;
        if(split) {
            displayDate = new Date(0);
            displayDate.setFullYear(split[1], split[2]-1, split[3]);
        }
        return displayDate;
    }

    function createCalendarPrototype(){
        // Private static prototype methods---------------------------------------------.
        
        var Event = dom.Event,
            testEl = document.body,
            TEXT_CONTENT = typeof testEl.textContent === "string" ? "textContent" : "innerText",
            CAN_FOCUS_EL = typeof testEl.focus !== "undefined",
            FOCUSED_CLASS = "ape-calendar-focused-el",
            SELECTED_DAY_CLASS = "ape-calendar-selected-day",
            addedDocmouseup;
        testEl = null;
        
        /** @param {Calendar} calendar widget to update after input has been read. 
         *  @param {boolean} hasDateFromInput true, if date was read from input, 
         *  false, otherwise (and displayDate defaults to "today" 
         */ 
        function updateCalendarWidget(calendar, hasDateFromInput) {

            var CalendarLocale = widget.CalendarLocale;
            if(!CalendarLocale) throw Error("Missing Resource: APE.widget.CalendarLocale");
            
            createCalendarOnDemand(calendar); 
            
            var curDate = new Date,
                d = document,
                year = calendar.displayDate.getFullYear(),
                month = calendar.displayDate.getMonth(),
                monthName = CalendarLocale.months.abbr[month],
                firstDayOfMonth = getFirstDayOfMonth(calendar.displayDate),
                calendarEl = d.getElementById(calendar.calendarId),
                dayElements = calendarEl.getElementsByTagName("tbody")[0].getElementsByTagName("b"),
                calendarHeader = d.getElementById(calendar.calendarId+"-header");
            
            calendarHeader.firstChild.data = year +  ", " + monthName;
            populateDays(calendar, year, month, firstDayOfMonth, dayElements);
            hiliteToday(calendar, firstDayOfMonth, dayElements);
            if(hasDateFromInput){
                hiliteSelectedDay(calendar, firstDayOfMonth + calendar.displayDate.getDate(), dayElements);
            }
        }
        
        function getFirstDayOfMonth(date){
         // Safe copy (Don't mutate displayDate!)
            date = new Date(date); 
            date.setDate(1);
            return date.getDay();
        }
        
        function populateDays(calendar, year, month, firstDayOfMonth, dayElements) {
            var i = 0, j = 0, 
                daysInThisMonth = daysInMonth[month],
                dayElement,
                dayId = calendar.id + "-day",
                isLeapYear = (0 == (year%4)) && ((0 != (year%100)) || (0 == (year%400)));

            if(month === 1 && isLeapYear)
                daysInThisMonth += 1;

            while(i < firstDayOfMonth) {
                dayElement = dayElements[i++];
                dayElement[TEXT_CONTENT] = ' ';
                dayElement.className = calendar.hiddenDayClass;
                dayElement.id = "";
            }
            // Fill in days.
            while(j++ < daysInThisMonth) { 
                dayElement = dayElements[i++];
                dayElement.id = dayId + (j-1);
                dayElement[TEXT_CONTENT] = j +"";
                // can receive focus by programmed arrow key handling or 
                // call to focus().
                dayElement.tabIndex = -1;
                dayElement.className = '';
            }
    //        alert(dayElements.length + ", " + i + ", " + j);
    
            for(i = firstDayOfMonth + daysInThisMonth, j = dayElements.length; i < j; i++){
                dayElement = dayElements[i];
                dayElement[TEXT_CONTENT] = ' ';
                dayElement.className = calendar.hiddenDayClass;
            }
        }
        
        function hiliteToday(calendar, firstDayOfMonth, dayElements){
            if(isCurrentMonthDisplayed(calendar)) {
                var currentDay = firstDayOfMonth + new Date().getDate()-1;
                dom.addClass(dayElements[currentDay], calendar.calendarClass + "-today");
            }
        }
        
        /** Hilites the date in the widget that is represented in the input */ 
        function hiliteSelectedDay(calendar, selectedDayIndex, dayElements){
            if(isCurrentMonthDisplayed(calendar) && !calendar.selectedId) {
                var dayElement = dayElements[selectedDayIndex - 1];
                dom.addClass(dayElement, SELECTED_DAY_CLASS);
                calendar.selectedId = dayElement.id;
            }
        }
        
        /**
         * Returns true if widget date the same as input date.
         */
        function isCurrentMonthDisplayed(calendar){
            var curDate = readDateFromInput(calendar) || new Date;
            return curDate != null && 
                calendar.displayDate.getYear() == curDate.getYear() 
                && calendar.displayDate.getMonth() == curDate.getMonth();
        }
        /** creates the HTML used for the calendar. */        
        function createCalendarOnDemand(calendar) {
            if(!calendar.calendarId) {
                calendar.calendarId = calendar.id + "-calendar";
            }
            var d = document;

            if(d.getElementById(calendar.calendarId) !== null) return;
            
            var calendarEl = d.createElement("div"),
                table,
                input = d.getElementById(calendar.id),
                container = input.parentNode,
                calendarBody = buildCalendarBody(),
                Locale = widget.CalendarLocale,
                dayNames = Locale.days.abbr, 
                calendarHead = "<thead>" 
                +"<tr class='calendar-button-row'>"
                +"<th id='"+calendar.id+ "-prev-year' tabindex='0' title='" 
                + Locale.previousYear + "'>&#x00ab;</th>"
                +"<th id='"+calendar.id+ "-prev-month' tabindex='0' title='" + Locale.previousMonth + "'>&#x2039;</th>"
                +"<th colspan='3' class='ape-calendar-header'><div id='"
                +calendar.calendarId+"-header'>-</div></th>"
                +"<th id='"+calendar.id+ "-next-month' tabindex='0' title='" + Locale.nextMonth 
                +"' class='"+calendar.calendarClass+"-days'>&#x203A;</th>"
                +"<th id='"+calendar.id+ "-next-year' tabindex='0' title='" + Locale.nextYear + "'>&#x00bb;</th></tr>"
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
            calendarEl.onmousedown = calendarMousedownHandler;
            
            if(!addedDocmouseup){
                // We need to clear the timerID on document, 
                // incase the user mouse out of the next/prev elements,
                // and then mouse up.
                APE.EventPublisher.add(document, "onmouseup", calendarMouseupHandler);
            }
            calendarEl.onkeydown = calendarKeyDownHandler;
            // Use the table el to avoid calling this function 
            // for calendarEl's focus event.
            table = calendarEl.firstChild;
            if("onfocusin" in table){
                table.onfocusin = handleTableFocusIn;
                table.onfocusout = handleTableFocusOut;
            }
            Event.addDelegatedFocus(container, containerFocused);
            container.insertBefore(calendarEl, input.nextSibling);
            Event.addDelegatedBlur(input.parentNode, hideCalendarOnBlur);
        }
        
        function hideCalendarOnBlur(ev){
            var target = Event.getTarget(ev),
                id = this.id.replace("-calendar", ""),
                input = document.getElementById(this.id),
                calendarDiv = document.getElementById(this.id),
                calendar;
            if(target !== input && !dom.contains(calendarDiv, target)) {
                calendar = widget.Calendar.getById(id);
                _hideCalendar(calendar);
            }
        }
        
        function buildCalendarBody(){
            var td = [],
                weekCount = 6,
                htmlBuf = [],
                i;
            td.length = 8;
            htmlBuf.length = weekCount;
            td = td.join("<td><b>&nbsp;</b></td>");
            for(i = 0; i < weekCount; i++) {
                htmlBuf[i] = "<tr id='w" + i+1 + "'>"+td+"</tr>\n";
            }
            return"<tbody>" + htmlBuf.join("") + "</tbody>";
        }
        
        /** IE <= 8, :focus is unsupported.*/
        function handleTableFocusIn(ev){
            var target = Event.getTarget(ev),
                tabIndex = target.tabIndex;
            if(/-next-|-prev-|-day/.test(target.id)) {
                dom.addClass(target, FOCUSED_CLASS);
            }
            Event.stopPropagation(ev);
        }
        
        function handleTableFocusOut(ev){
            var target = Event.getTarget(ev);
            dom.removeClass(target, FOCUSED_CLASS);
        }
        
        /**
         * @param {Event} ev event parameter for focus event.
         * @description called when the input receives focus or click events.
         */
        function calInputFocusHandler(ev) {
            ev = ev||window.event;

            var calendar = widget.Calendar.getById(this.id),
                calendarEl = document.getElementById(calendar.id),
                fromEl = ev.relatedTarget || ev.fromElement;
            if(calendar._isHidden && (!fromEl || (fromEl !== calendarEl && 
                    !dom.contains(calendarEl, fromEl)))){
                _showCalendar(calendar, ev);
            }
        }
        
        function calInputKeyHandler(ev){
            ev = ev || window.event;
            var calendar = widget.Calendar.getById(this.id),
                calendarEl = document.getElementById(calendar.id),
                keyCode = ev.keyCode;
            if(keyCode === 27) {
                Event.preventDefault(ev);
                _hideCalendar(calendar);
            } else if(keyCode === 13) { // Enter
                Event.preventDefault(ev);
                if(calendar._isHidden) {
                    _showCalendar(calendar);
                } else {
                    _hideCalendar(calendar);
                } 
            }
        }
        
        function calendarKeyDownHandler(ev) {
            ev = ev || window.event;
            var keyCode = ev.keyCode,
                inputId = this.id.replace(/-calendar$/,""),
                calendar = widget.Calendar.getById(inputId),
                target;
            
            if(keyCode === 27) {
                _hideCalendar(calendar);
            } else if(keyCode === 13) { // Enter.
                target = Event.getTarget(ev);
                calendarActivationEventHandler(this, target);
            } else if(keyCode === 9){ // Tab
                keepTabsInWidget(calendar, ev);
            } else if(/37|38|39|40/.test(keyCode)){ 
                handleDayNavigation(calendar, ev, keyCode);
            } 
        }
        
        function keepTabsInWidget(calendar, ev){
            if(!CAN_FOCUS_EL) return;
            var target = Event.getTarget(ev),
                calendarEl,
                hasShiftKey = ev.shiftKey,
                prevYearId = calendar.id + "-prev-year",
                isPreviousYear = target.id === prevYearId,
                isNextYear = target.id === calendar.id + "-next-year";
            if(hasShiftKey && isPreviousYear || !hasShiftKey && isNextYear){
                Event.preventDefault(ev);
            } else if(target.tabIndex === -1 && CAN_FOCUS_EL){
             // If user hit Tab on a day element, focus the first tabbable 
             // element in the calendar.
                 Event.preventDefault(ev);
                 document.getElementById(prevYearId).focus();
            }
        }
        
        function handleDayNavigation(calendar, ev, keyCode) {
            var target = Event.getTarget(ev),
                currentDay = target.id.match(/-day(\d+)$/),
                dayToFocus,
                cellToFocus;
            if(currentDay) {
                if(keyCode === 37) {
                    dayIndex = -1;
                } else if(keyCode === 39){
                    dayIndex = 1;
                } else if(keyCode === 38) {
                    dayIndex = -7;
                } else if(keyCode === 40) {
                    dayIndex = 7;
                }
                if(dayIndex) {
                    dayToFocus = +currentDay[1] + dayIndex;
                } 
            } else {
                dayToFocus = 0;
            }
            cellToFocus = document.getElementById(calendar.id + "-day" + dayToFocus);
            if(cellToFocus) {
                tryFocusCell(cellToFocus);
            }
        }
        
        function tryFocusCell(cellToFocus){
            if(CAN_FOCUS_EL) {
                cellToFocus.tabIndex = 0;
                cellToFocus.focus();
                cellToFocus.tabIndex = -1;
            }
        }

        /**
         * Shows the calendar. The first time this is called, 
         * the selectedDate is initialized.
         * @param {Event} ev the DOM Event the triggered the action.
         * @fires onshow
         * @private
         */
        function _showCalendar(calendar, ev) {
            if(IS_NATIVE) {
                calendar.onshow(ev);
                return;
            }

            createCalendarOnDemand(calendar);

            var el = document.getElementById(calendar.calendarId),
                calStyle = el.style;
            
            calendar._isHidden = false;
            
            if(isShown(calendar.calendarEl.style)) {
                _hideCalendar(calendar, ev);
            }
            
            position(calendar, calStyle);
            calendar.onshow(ev);
            calendar.show(calStyle); 
            calendar.setDate(readDateFromInput(calendar));
            if(CAN_FOCUS_EL) {
                if(calendar.selectedId) {
                    document.getElementById(calendar.selectedId).focus();
                } else {
                    el.focus();                
                }
            }
        }

         /** Positions the calendar just below the input.
          * @param {CSSStyleDeclaration} calStyle the caledar element's style.
          */
         function position(calendar, calStyle) {
             var input = document.getElementById(calendar.id);
             calStyle.left = input.offsetLeft + "px";
             calStyle.top =  input.offsetTop + input.offsetHeight + "px";
         }

         /**
         * Hides the calendar.
         * @param {Event} e the DOM Event the triggered the action.
         * @fires onhide(e)
         */
        function _hideCalendar(calendar, ev) {
            if(calendar._isHidden) return;

            calendar.onhide(ev);
            if(IS_NATIVE) return;
            
            var calendarEl = document.getElementById(calendar.calendarId);
            calendar.hide(calendarEl.style);
            calendar._isHidden = true;
            document.getElementById(calendar.id).focus();
        }

        /**
         * @param {Event} e event parameter for click event.
         * @description called when calendar is clicked.
         */
        var monthYearAnim;
        function calendarMousedownHandler(ev) {
            ev = ev||window.event;
            
            // Ignore right button; just let those have default 
            // behavior.
            // Button values are:
            //   DOM: 0 is "left", 1 "middle"
            //   IE: 1 is "left". 
            if(ev.button > 1) return;
            var target = Event.getTarget(ev),
                calendarDiv = this;
            if(/-next-|-prev-/.test(target.id)) {
                calendarActivationEventHandler(calendarDiv, target);
                monthYearAnim = tryGetMonthYearAnim(calendarDiv, target);
                if(monthYearAnim){
                    monthYearAnim.startAfter(400);
                }
            }
        }
        
        /** @return {APE.anim.Animation|undefined} monthYearAnim */
        function tryGetMonthYearAnim(calendarDiv, target){
            var runMonthYearAnim, anim = APE.anim;
            if(!monthYearAnim && anim){
                monthYearAnim = new anim.Animation(10);
            }
            monthYearAnim.run = function runMonthYearAnim(){
                calendarActivationEventHandler(calendarDiv, target);
            }
            runMonthYearAnim = null;
            return monthYearAnim;
        }
        
        function calendarMouseupHandler(ev){
            monthYearAnim && monthYearAnim.stop();
        }
        /** Called from mousedown/keydown */
        function calendarActivationEventHandler(calendarDiv, target) {
            var calendarObject,
                targetId = target.id,
                selectedIndex;
            
            calendarObject = widget.Calendar.getById(calendarDiv.id.replace(/-calendar$/,""));
        
            if(/^b$/i.test(target.tagName)) {
                if(calendarObject.hideOnSelect || targetId !== calendarObject.selectedId) {
                    selectedIndex = +target.firstChild.data;
                    // Days are 1-31.
                    if(selectedIndex){
                        userSelectedDay(calendarObject, selectedIndex, target, targetId);
                    }
                }
            } else if(/-next-|-prev-/.test(targetId)){
                userSelectedMonthOrYear(calendarObject, targetId);
            }
        }
        
        /**
         * Sets the className on the day the user selected, calls onselect, hides 
         *  widget if hideOnSelect is true.
         *  @param {int] selectedIndex day selected
         *  @param {HTMLElement} target the element the user clicked.
         *  @param (string} selectedId new id to give to target.
         */
        function userSelectedDay(calendarObject, selectedIndex, target, selectedId, ev){
            var selected = document.getElementById(calendarObject.selectedId),
                selectedClass = SELECTED_DAY_CLASS;
            
            if(selected) {
                dom.removeClass(selected, selectedClass);
            }
            dom.addClass(target, selectedClass);
            calendarObject.selectedId = target.id;
            setDateOfMonth(calendarObject, selectedIndex);
        
            calendarObject.onselect();
            if(calendarObject.hideOnSelect) {
                document.getElementById(calendarObject.id).focus();
                setTimeout(function(){
                    _hideCalendar(calendarObject, ev);
                    calendarObject = target = selected = null;
                }, 150);
            }
        }

        function userSelectedMonthOrYear(calendarObject, targetId) {
            var newDate,
                nextPrevMonthYearExp = 
                    new RegExp("^" + calendarObject.id + "-((?:next|prev)-(?:year|month))"),
                match;
            
            if(nextPrevMonthYearExp.test(targetId)){
                newDate = new Date(calendarObject.displayDate);
                match = nextPrevMonthYearExp.exec(targetId)[1];
                if(match === "next-year") {
                    newDate.setFullYear(newDate.getFullYear() + 1);
                } else if(match === "prev-year") {
                    newDate.setFullYear(newDate.getFullYear() - 1);
                } else if(match === "next-month") {
                    newDate.setMonth(newDate.getMonth() + 1);
                } else if(match === "prev-month") {
                     newDate.setMonth(newDate.getMonth() - 1);
                }
                calendarObject.setDate(newDate);
            }
        }
        
        /** Updates the calendar's date. */
        function setDateOfMonth(calendar, dateOfMonth) {
            var dateToModify = calendar.displayDate||new Date,
                formatted;
            dateToModify.setDate(dateOfMonth);
            formatted = formatDate(dateToModify);
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
         * @param {Event} ev event parameter for keydown event.
         */
        function calInputKeyDown(ev) {
            ev = ev || window.event;
            var keyCode = ev.keyCode,
                calendar;
            if(keyCode === 27 || keyCode === 13) {
                calendar = widget.Calendar.getById(this.id);
                if(keyCode === 27) {//ESC.
                    _hideCalendar(calendar, ev);
                } else if(keyCode === 13) { // Enter.
                    if(calendar._isHidden) {
                        _showCalendar(calendar);
                    } else {
                        _hideCalendar(calendar);
                    }
                }
            }
        }

        return {     
            /** set to <code>true</code> to hide the calendar when a date is selected. */
            hideOnSelect : true,
        
            /** call initEvents when calendar HTML is Calendar's html is regenerated (via innerHTML). 
             */
            initEvents : function() {
                if(IS_NATIVE) return;
                
                var d = document, 
                    input = d.getElementById(this.id),
                    addCallback = APE.EventPublisher.add;
                    
                addCallback(input, "onfocus", calInputFocusHandler);
                addCallback(input, "onkeydown", calInputKeyHandler);
                addCallback(input, "onkeydown", calInputKeyDown);
                if(!IS_NATIVE) {
                    // IE needs this because if calendar is 
                    // not shown at pg load time, and input has focus,
                    // onfocus won't fire when user clicks input.
                    addCallback(input, "onclick", calInputFocusHandler);
               }
            },
            
            calendarId : "",
        
            hiddenDayClass : 'ape-calendar-empty-day',
            calendarClass : 'ape-calendar',
        
            /** Shows the calendar by setting visibility to 'visible'.
             * @param {CSSStyleDeclaration} calStyle the caledar element's style.
             * Used internally, but may be overridden.
             */
            show : function(calStyle) {
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
            
            isShown : function(calStyle) {
                return calStyle.visibility === "visible";
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
                return this.displayDate||readDateFromInput(this);
            },
                
            /** Sets the internal date object represented by the calendar.
             * @internal
             */
            setDate : function(date) {
                if(IS_NATIVE) {
                    document.getElementById(this.id).value = formatDate(date);
                    return;
                }
                var hasDateFromInput = date != null,
                    ONE_DAY = 1000 * 60 * 60 * 24;
                date = hasDateFromInput ? new Date(date) : new Date;
                if(!this.displayDate || !this.selectedId || 
                      Math.abs(this.displayDate - date.getTime()) > ONE_DAY) {
                    this.displayDate = date;
                    updateCalendarWidget(this, hasDateFromInput);
                }
            }
        };
    }    
})();