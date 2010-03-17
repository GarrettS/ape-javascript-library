/**
 * @fileoverview Calendar Widget
 * @author Garrett Smith
 * 
 * @requires APE.dom.getOffsetCoords, APE.EventPublisher
 * @example <pre>
 * var calendar = APE.widget.Calendar.getById( "cal" );
 * </pre>
 */

APE.namespace("APE.widget").defineCustomFactory(
    "Calendar", 
    function(Calendar) {
        
        var inputTypeDate = document.createElement("input"),
            APE = window.APE,
            dom = APE.dom,
            Event = dom.Event;
        
        // Augment Calendar.
        APE.widget.DelegateFactory.create(Calendar, Event, "focus" /*defaultMatcher*/);
        
        inputTypeDate.setAttribute("type", "date");
        Calendar.IS_NATIVE = /date/i.test(inputTypeDate.type);
        inputTypeDate = null;
        
        return getConstructor;
                
        function getConstructor(Calendar){
            /**
             * @constructor
             * @param {String} id the id of the input element.
             * @private
             * TODO: add support for min/max attributes.
             */
            function CalendarC( id, config ) {
                this.id = id;
                if(IS_NATIVE) return;
                config && APE.createMixin(this, config);
                if(this.useAnim) {
                    this.hide = calendarHide;
                }
                
                this._isHidden = true;
                this.initEvents();
            }
             
            function readDateFromInput(calendar) {
                var input = document.getElementById(calendar.id);
                return parseISO8601(input.value);
            }
            
            /**Parses string formatted as YYYY-MM-DD to a Date object.
             * If the supplied string does not match the format, null is returned.
             * @param {string} dateStringInRange format YYYY-MM-DD, with year in
             * range of 0000-9999, inclusive.
             * @return {Date} Date object representing the string.
             */
            function parseISO8601(dateStringInRange) {
                var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/, 
                    date = null, 
                    month, 
                    parts = isoExp.exec(dateStringInRange);
        
                if(parts) {
                    date = new Date(0);
                    month = +parts[2];
                    date.setFullYear(parts[1], month - 1, parts[3]);
                    if(month === date.getMonth() + 1) {
                        date.setHours(0, 0, 0, 0);
                    } else {
                        date = null;
                    }
                }
                return date;
            }
        
            // Private static prototype properties---------------------------------------------.
            var noop = Function.prototype,
                EventPublisher = APE.EventPublisher,
                addCallback = EventPublisher.add,
                removeCallback = EventPublisher.remove,
                testEl = document.body,
                activeCalendar = null,
                CAN_FOCUS_EL = typeof testEl.focus !== "undefined", // False in Safari 2.x.
                FOCUSED_CLASS = "ape-calendar-focused-el",
                SELECTED_DAY_CLASS = "ape-calendar-selected-day",
                NEXT_PREV_EXP = /-((?:next|prev)-(?:month|year))$/,
                NEXT_PREV_DAY_EXP = /-next-|-prev-|-day\d/,
                DAY_EXP = /-day(\d+)$/,
                key = dom.key,
                IS_NATIVE = Calendar.IS_NATIVE,
                daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31],

                anim = APE.anim,
                StyleTransition = anim.StyleTransition,
                duration = .1,
                styleTransitionObjects = {},
            
             // Add a style transition to show() and hide() the calendar.
                endStyle = {
                    opacity: .98, 
                    width: "14.4em", 
                    height: "14.4em",
                    visibility: "visible"
                };
            
            /** Updates the calendar based on the input date, or, if no input, today.
             * 
             * @param {Calendar} calendar widget to update after input has been read. 
             * @param {boolean} hasDateFromInput true, if date was read from input, 
             *  false, otherwise (and displayDate defaults to "today" 
             */ 
            function updateCalendarWidget(calendar, hasDateFromInput) {
                var CalendarLocale = APE.widget.CalendarLocale,
                    displayDate = calendar.displayDate;
                if(!CalendarLocale) throw Error("Missing Resource: APE.widget.CalendarLocale");
                
                createCalendarOnDemand(calendar); 
                
                var d = document,
                    year = displayDate.getFullYear(),
                    month = displayDate.getMonth(),
                    monthName = CalendarLocale.months.abbr[month],
                    firstDayOfMonth = getFirstDayOfMonth(displayDate),
                    calendarEl = d.getElementById(calendar.calendarId),
                    dayElements = calendarEl.getElementsByTagName("tbody")[0].getElementsByTagName("b"),
                    calendarHeader = d.getElementById(calendar.calendarId+"-header");
                
                calendarHeader.firstChild.data = year +  ", " + monthName;
                populateDays(calendar, year, month, firstDayOfMonth, dayElements);
                hiliteToday(calendar, firstDayOfMonth, dayElements);
                if(hasDateFromInput){
                    hiliteSelectedDay(calendar, firstDayOfMonth + displayDate.getDate(), dayElements);
                }
            }
            
            /** TODO: Consider refactor to a new "APE.date".*/
            function getFirstDayOfMonth(date){
             // Safe copy (Don't mutate displayDate!)
                date = new Date(date); 
                date.setDate(1);
                return date.getDay();
            }
            
            /** Fills in the day elements in the calendar. */
            function populateDays(calendar, year, month, firstDayOfMonth, dayElements) {
                var i = 0, j = 0, 
                    daysInThisMonth = daysInMonth[month],
                    dayElement,
                    dayId = calendar.id + "-day",
                    // TODO: consider refactor to "APE.Date".
                    isLeapYear = (0 == (year%4)) && ((0 != (year%100)) || (0 == (year%400)));

                if(month === 1 && isLeapYear)
                    daysInThisMonth += 1;

                while(i < firstDayOfMonth) {
                    dayElement = dayElements[i++];
                    dayElement[dom.TEXT_CONTENT] = ' ';
                    dayElement.className = calendar.hiddenDayClass;
                    dayElement.id = "";
                }
                // Fill in days.
                while(j++ < daysInThisMonth) { 
                    dayElement = dayElements[i++];
                    dayElement.id = dayId + (j-1);
                    dayElement[dom.TEXT_CONTENT] = j +"";
                    // can receive focus by programmed arrow key handling or 
                    // call to focus().
                    dayElement.tabIndex = -1;
                    dayElement.className = '';
                }
        //        alert(dayElements.length + ", " + i + ", " + j);
        
                for(i = firstDayOfMonth + daysInThisMonth, j = dayElements.length; i < j; i++){
                    dayElement = dayElements[i];
                    dayElement[dom.TEXT_CONTENT] = ' ';
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
            /** creates the HTML used for the calendar. 
             * @param {Calendar} calendar widget to base creation off.*/        
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
                    Locale = APE.widget.CalendarLocale,
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
                if(calendar.useAnim) {
                    dom.addClass(calendarEl, "ape-calendar-anim-start");
                }
                calendarEl.tabIndex = 0;
                calendarEl.onmousedown = calendarMouseDownHandler;
                
                calendarEl.onkeydown = calendarKeyDownHandler;
                // Use the table el to avoid calling this function 
                // for calendarEl's focus event.
                table = calendarEl.firstChild;
                if("onfocusin" in table){
                    table.onfocusin = handleTableFocusIn;
                    table.onfocusout = handleTableFocusOut;
                }
                container.insertBefore(calendarEl, input.nextSibling);
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
            
            /** IE <= 8, :focus is unsupported.
             */
            function handleTableFocusIn(ev){
                var target = Event.getTarget(ev);
                if(NEXT_PREV_DAY_EXP.test(target.id) && target !== null) {
                    dom.addClass(target, FOCUSED_CLASS);
                }
            }
            
            function handleTableFocusOut(ev){
                var target = Event.getTarget(ev);
                // Somehow window.event is null during the test, 
                // and that results in getTarget returning null, 
                // causing target to be null
                if(target !== null) {
                    dom.removeClass(target, FOCUSED_CLASS);
                }
            }
            
            /**
             * @param {Event} ev event parameter for focus event.
             * @description called when the input receives focus or click events.
             */
            function calInputFocusHandler(ev) {
                ev = ev||window.event;

                var calendar = Calendar.getById(this.id),
                    calendarEl = document.getElementById(calendar.id),
                    fromEl = ev.relatedTarget || ev.fromElement;
                if(calendar._isHidden && (!fromEl || (fromEl !== calendarEl && 
                        !dom.contains(calendarEl, fromEl)))){
                    _showCalendar(calendar, ev);
                }
            }
                    
            function calendarKeyDownHandler(ev) {
                ev = ev || window.event;
                var keyCode = ev.keyCode,
                    inputId = this.id.replace(/-calendar$/,""),
                    calendar = Calendar.getById(inputId),
                    target;
                
                if(keyCode === key.ESC) {
                    if(!calendar._isHidden) {
                        // onfocus fires later, asynchronously in IE, 
                        // and this causes onfocus handler to fire, causing 
                        // the calendar to show, when the user really wants 
                        // it to hide. To workaround that, 
                        // call focus, then _hideCalendar in a setTimeout.

                        document.getElementById(inputId).focus();
                        setTimeout(function() {
                            _hideCalendar(calendar);
                        }, 1);
                    }
                } else if(keyCode === key.ENTER) { 
                    target = Event.getTarget(ev);
                    calendarActivationEventHandler(this, target);
                } else if(keyCode === key.TAB){  
                    keepTabsInWidget(calendar, ev);
                } else if(key.ARROW_KEY_EXP.test(keyCode)){ 
                    handleDayNavigation(calendar, ev, keyCode);
                } 
            }
            
            function keepTabsInWidget(calendar, ev){
                if(!CAN_FOCUS_EL) return;
                var target = Event.getTarget(ev),
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
                    currentDay = target.id.match(DAY_EXP),
                    dayToFocus,
                    cellToFocus;
                if(currentDay) {
                    if(keyCode === key.LEFT) {
                        dayToFocus = -1;
                    } else if(keyCode === key.RIGHT){
                        dayToFocus = 1;
                    } else if(keyCode === key.UP) {
                        dayToFocus = -7;
                    } else if(keyCode === key.DOWN) {
                        dayToFocus = 7;
                    }
                    if(dayToFocus) {
                        dayToFocus = +currentDay[1] + dayToFocus;
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
             * @fires onshow
             * @private
             */
            function _showCalendar(calendar) {
                if(IS_NATIVE) {
                    calendar.onshow();
                    return;
                }
                addCallback(document, "onmousedown", calDocumentMouseDownHandler);
                addCallback(document, "onmouseup", calDocumentMouseUpHandler);

                if(!calendar._isHidden) return;
                if(activeCalendar) {
                    _hideCalendar(activeCalendar);
                }
                createCalendarOnDemand(calendar);
                
                calendar._isHidden = false;
                
                var calendarEl = document.getElementById(calendar.calendarId),
                    calStyle = calendarEl.style;
                position(calendar.id, calStyle);
                if(calendar.useAnim) {
                    calendarShowHandler(calendar);
                }    
                calendar.onshow(calendar);
                calendar.show(calStyle);
                activeCalendar = calendar;
                calendar.setDate(readDateFromInput(calendar));
                focusCalendar(calendar, calendarEl);
                
                // IE Needs this for showing calendar over other elements.
                calendarEl.parentNode.style.zIndex = "100";
            }

            /** Try to focus the selected day, but if not possible, focus the calendar. */
            function focusCalendar(calendar, calendarEl){
                if(CAN_FOCUS_EL) {
                    if(calendar.selectedId) {
                        // Using a setTimeout, as in the example, calling "focus" mid-animation
                        // causes the table to be positioned oddly within the container.
                        setTimeout(function(){
                            var selected = document.getElementById(calendar.selectedId);
                            try {
                                selected.focus();
                            } catch(element_hidden){
                            } finally {
                                calendar = calendarEl = selected = null;
                            }
                        }, 120);
                    } else {
                        // This can `cause delegated focus listener to fire 
                        // with target as input.
                        calendarEl.focus();
                    }
                }
            }

            /** Positions the calendar just below the input.
             * @param {string} inputId the id of the input/calendar.
             * @param {CSSStyleDeclaration} calStyle the caledar element's style.
             */
            function position(inputId, calStyle) {
                var input = document.getElementById(inputId),
                    container = input.parentNode,
                    coords = dom.getOffsetCoords(input, container);
                calStyle.left = coords.x + "px";
                calStyle.top =  coords.y + input.offsetHeight + "px";
            }

            /**
             * Hides the calendar.
             * @fires onhide(e)
             */
            function _hideCalendar(calendar) {
                if(calendar._isHidden) return;

                calendar.onhide();
                if(IS_NATIVE) return;
                
                var calendarEl = document.getElementById(calendar.calendarId);
                if(calendarEl !== null) {
                    calendar.hide(calendarEl.style);
                    // IE Needs this for showing calendar over other elements.
                    calendarEl.parentNode.style.zIndex = "";
                }
                calendar._isHidden = true;
            }

            /**
             * @param {Event} e event parameter for click event.
             * @description called when calendar is clicked.
             */
            var monthYearAnim;
            function calendarMouseDownHandler(ev) {
                ev = ev||window.event;
                
                // Ignore right button; just let those have default 
                // behavior.
                // Button values are:
                //   DOM: 0 is "left", 1 "middle"
                //   IE: 1 is "left". 
                if(ev.button > 1) return;
                var target = Event.getTarget(ev),
                    targetId = target.id;
                if(NEXT_PREV_DAY_EXP.test(targetId)) {
                    calendarActivationEventHandler(this, target);
                    if(NEXT_PREV_EXP.test(targetId)) {
                        monthYearAnim = tryGetMonthYearAnim(this, targetId);
                        if(monthYearAnim){
                            monthYearAnim.startAfter(400);
                        }
                    }
                }
            }
            
            /** @return {APE.anim.Animation|undefined} monthYearAnim.
             * This animation is what keeps the days/years updating 
             * while user has mousedown. When document.mouseup occurs,
             * this animation stops.
             */
            function tryGetMonthYearAnim(calendarDiv, targetId){
                var runMonthYearAnim,
                    calendar = Calendar.getById(calendarDiv.id.replace(/-calendar$/,""));

                if(anim) {
                    if(!monthYearAnim){
                        // 3000 seconds should provide more than enough scrolling for 
                        // about 200,000 calls or so (200,000 years).
                        monthYearAnim = new anim.Animation(3000);
                    }
                    monthYearAnim.run = function runMonthYearAnim(){
                        userSelectedMonthOrYear(calendar, targetId);
                    };
                    runMonthYearAnim = calendarDiv = null;
                }
                return monthYearAnim;
            }
            
            /** Called from mousedown/keydown */
            function calendarActivationEventHandler(calendarDiv, target) {
                var calendarObject,
                    targetId = target.id,
                    selectedIndex;
                
                calendarObject = Calendar.getById(calendarDiv.id.replace(/-calendar$/,""));
            
                if(DAY_EXP.test(targetId)) {
                    if(calendarObject.hideOnSelect || targetId !== calendarObject.selectedId) {
                        selectedIndex = +target.firstChild.data;
                        // Days are 1-31.
                        if(selectedIndex){
                            userSelectedDay(calendarObject, selectedIndex, target, targetId);
                        }
                    }
                } else if(NEXT_PREV_EXP.test(targetId)){
                    userSelectedMonthOrYear(calendarObject, targetId);
                }
            }
            
            /**
             * Sets the className on the day the user selected, calls onselect, hides 
             *  widget if hideOnSelect is true.
             *  @param {uint} selectedIndex day selected
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
                    setTimeout(function() {
                        _hideCalendar(calendarObject, ev);
                        calendarObject = target = selected = null;
                    }, 150);
                }
            }

            function userSelectedMonthOrYear(calendarObject, targetId) {            
                var newDate = new Date(calendarObject.displayDate),
                    match = NEXT_PREV_EXP.exec(targetId)[1];
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
                    
            /** Updates the calendar's date. */
            function setDateOfMonth(calendar, dateOfMonth) {
                var dateToModify = calendar.displayDate||new Date,
                    formatted;
                dateToModify.setDate(dateOfMonth);
                formatted = formatDate(dateToModify);
                document.getElementById(calendar.id).value = formatted;
            }
            
            function returnFalse() {return false;}
            
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
            
            /**  @param {Event} ev event parameter for keydown event. */
            function calInputKeyDown(ev) {
                ev = ev || window.event;
                var keyCode = ev.keyCode,
                    calendar;
                if(keyCode === key.ESC || keyCode === key.ENTER) {
                    Event.preventDefault(ev);
                    calendar = Calendar.getById(this.id);
                    if(keyCode === 27) {
                        _hideCalendar(calendar);
                    } else if(keyCode === key.ENTER) {
                        if(calendar._isHidden) {
                            _showCalendar(calendar);
                        } else {
                            _hideCalendar(calendar);
                        }
                    }
                }
            }

            function calDocumentMouseDownHandler(ev){
                if(!activeCalendar) return;
                
                var target = dom.Event.getTarget(ev),
                    d = document,
                    calendarEl = d.getElementById(activeCalendar.calendarId);

                // If the innerHTML was wiped or something.
                // This is a document event handler. Anything can happen.
                // Sometimes during unit test, target is null (IE6).
                if(target && target.id !== activeCalendar.id && 
                        !calendarEl || !dom.isOrContains(calendarEl, target)) {
                    
                    _hideCalendar(activeCalendar);
                    activeCalendar = null;
                    removeCallback(d, "onmousedown", calDocumentMouseDownHandler);
                    removeCallback(d, "onmouseup", calDocumentMouseUpHandler);                
                }    
            }

            function calDocumentMouseUpHandler(ev){
                monthYearAnim && monthYearAnim.stop();
            }

            function getStyleTransition(id) {
                var obj = styleTransitionObjects[id];
                if(!obj) {
                    obj = styleTransitionObjects[id] = new StyleTransition(
                     id, 
                     endStyle, duration,
                     anim.Transitions.getSigmoid(3)
                 );
                }
                return obj;
            }
        
            function calendarShowHandler(calendar){
                if(calendar.useAnim) 
                    getStyleTransition(calendar.calendarId).seekTo(1);
            }
        
            function calendarHide(){
                if(this.useAnim) 
                    getStyleTransition(this.calendarId).seekTo(0);
            }

            CalendarC.prototype = {     
                /** set to <code>true</code> to hide the calendar when a date is selected. */
                hideOnSelect : true,
                useAnim : true,
                
                /** call initEvents when calendar HTML is Calendar's html is regenerated (via innerHTML). 
                 */
                initEvents : function() {
                    if(IS_NATIVE) return;
                    
                    var d = document, 
                        input = d.getElementById(this.id);
                        
                    addCallback(input, "onfocus", calInputFocusHandler);
                    addCallback(input, "onkeydown", calInputKeyDown);
                    
                    // IE needs this because if calendar is 
                    // not shown at pg load time, and input has focus,
                    // onfocus won't fire when user clicks input.
                    addCallback(input, "onclick", calInputFocusHandler);
                },
                
                purgeEvents : function(){
                    var d = document, 
                        input = d.getElementById(this.id);
                    if(input) {
                        removeCallback(input, "onfocus", calInputFocusHandler);
                        removeCallback(input, "onkeydown", calInputKeyDown);
                        removeCallback(input, "onclick", calInputFocusHandler);
                    }
                    removeCallback(d, "onmousedown", calDocumentMouseDownHandler);
                    removeCallback(d, "onmouseup", calDocumentMouseUpHandler); 
                },
                
                calendarId : "",
                
                hiddenDayClass : 'ape-calendar-empty-day',
                calendarClass : 'ape-calendar',
            
                /** Shows the calendar by setting visibility to 'visible'.
                 * @param {CSSStyleDeclaration} calStyle the caledar element's style.
                 * Called internally, but may be overridden.
                 */
                show : function(calStyle) {
                    calStyle.visibility = "visible";
                },
                
                /**
                 * Hides the calendar by setting visibility to "hidden"
                 * @param {CSSStyleDeclaration} calStyle the calendar element's style.
                 * Called internally, but may be overridden.
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
            return CalendarC;
        }
    }
);