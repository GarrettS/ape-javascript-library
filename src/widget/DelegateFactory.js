APE.namespace("APE.widget").createDelegateFactory = 
    function(factory, eventRegistry, eventTypeList, matcher) {
    
    var APE = window.APE;
    
    function DelegateFactoryC(factory, eventRegistry, eventTypeList, getMatch) {
        this.factory = factory;
        this.eventRegistry = eventRegistry;
        this.getMatch = getMatch || defaultMatcher;
        this.eventTypeList = eventTypeList;
        this.cbMap = {};
    }
    
    return (APE.widget.createDelegateFactory = createDelegateFactory
                        )(factory, eventRegistry, eventTypeList, matcher);

    function createDelegateFactory(factory, eventRegistry, eventTypeList, matcher) {
        if(typeof eventTypeList === "string") {
            eventTypeList = [eventTypeList];
        }
        factory.delegateFactory = 
            new DelegateFactoryC(factory, eventRegistry, eventTypeList, matcher);
        factory.addDelegateFor = addDelegateFor;
        factory.removeDelegateFor = removeDelegateFor;
        factory.removeAllDelegates = removeAllDelegates;
        return factory;
    }    

    function defaultMatcher(ev, target) {
        var id = target.id;
        return(id in this.cbMap) ? id : null;
    }
    
    /** Returns the delegateCallback; called when a Factory's registered delegates
     * goes from 0 to 1.
     */
    function createDelegateCallback(factory){
        var i, len, 
            node = document.documentElement,
            delegateCallback = getCallbackForFactory(factory);
        for(i = 0, len = factory.eventTypeList.length; i < len; i++) {
            factory.eventRegistry.add(node, factory.eventTypeList[i], delegateCallback);
        }
        return delegateCallback;
    }
    
    function removeAllDelegates() {
        var df = this.delegateFactory,
            i, len, target,
            node = document.documentElement;
        for(i = 0, len = df.eventTypeList.length; i < len; i++) {
            df.eventRegistry.remove(node, df.eventTypeList[i], node, df.delegateCallback);
        }
        delete df.delegateCallback;
    }
    
    function removeDelegateFor(matchedId) {
        if(typeof matchedId.id === "string") {
            matchedId = matchedId.id;
        }
        removeFromCbMap(this.delegateFactory, matchedId);
    }
    
    function removeFromCbMap(df, matchedId) {
        delete df.cbMap[matchedId];
        if(isEmpty(df.cbMap)) {
            df.factory.removeAllDelegates();
            delete df.delegateCallback;
        }
    }
    
    function isEmpty(obj) {
        return (isEmpty = APE.__count__ ? function(obj) {
            return obj.__count__ === 0;
        } : typeof Object.keys === "function" ? function(obj) {
                return typeof obj === "object" && Object.keys(obj).length === 0;
        } : function(obj) {
                if(typeof obj === "object") {
                    for(var p in obj) return true;
                }
                return false;
        })(obj);
    }
    
    function addDelegateFor(id, config) {
        var df = this.delegateFactory;
        df.cbMap[id] = config ? {id:id, config:config} : id;
        if(!df.delegateCallback) {
            df.delegateCallback = createDelegateCallback(df);
        }
    }
    
    function getCallbackForFactory(delegateFactory) {
        return function(ev) {
            callback(ev, delegateFactory);
        };
    }
    
    function callback(ev, df) {
        var target = APE.dom.Event.getTarget(ev),
            matchedId = df.getMatch(ev, target),
            config,
            method = "getByNode";
         if(matchedId) {
             if(typeof matchedId === "string") {
                 method = "getById";
                 config = (df.cbMap[matchedId]||0).config;
             } 
             df.factory[method]( matchedId, config && config);
             removeFromCbMap(df, matchedId);
        }
    }
};