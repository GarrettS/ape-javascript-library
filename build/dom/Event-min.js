APE.namespace("APE.dom").Event=(function(){var HAS_EVENT_TARGET="addEventListener" in this,TARGET=HAS_EVENT_TARGET?"target":"srcElement",FOCUS_DELEGATED=HAS_EVENT_TARGET?"focus":"focusin",BLUR_DELEGATED=HAS_EVENT_TARGET?"blur":"focusout",Registry={},isMaybeLeak
/*@cc_on=(@_jscript_version<5.7)@*/
,useCaptureMap={focus:FOCUS_DELEGATED,blur:BLUR_DELEGATED},Event={get:get,getTarget:getTarget,add:addCallback,addCallback:addCallback,remove:removeCallback,removeCallback:removeCallback,preventDefault:preventDefault,stopPropagation:stopPropagation,toString:function(){return"APE.dom.Event"}};function get(src,sEvent){get=Event.get=_get;function DomEventPublisher(src,type){if(!src.addEventListener&&!src.attachEvent){throw TypeError(src+" is not a compatible object.")}this.src=src;this.type=type;this._callStack=[]}DomEventPublisher.prototype={add:function(callback){this.add=add;return this.add(callback);function add(callback){var o=this.src,captureAdapterType=useCaptureMap[this.type],type=captureAdapterType||this.type;if(HAS_EVENT_TARGET){o.addEventListener(type,callback,!!captureAdapterType)}else{callback=getBoundCallback(o,callback);o.attachEvent("on"+type,callback)}this._callStack.push(callback);return this}function getBoundCallback(o,cb){if(o===window){return cb}function bound(ev){bound.original.call(bound.context,ev)}bound.original=cb;bound.context=o;cb=o=null;return bound}},remove:function(callback){this.remove=remove;this.remove(callback);function remove(callback){callback=removeFromCallStack(this._callStack,callback);if(callback){if(HAS_EVENT_TARGET){this.src.removeEventListener(this.type,callback,this.type in useCaptureMap)}else{this.src.detachEvent("on"+this.type,callback)}}return this}function removeFromCallStack(callStack,callback){var cb,i,len;for(i=0,len=callStack.length;i<len;i++){cb=callStack[i];if((cb.original||cb)===callback){delete cb.original;delete cb.context;return callStack.splice(i,1)[0]}}return null}},toString:function(){return"DomEventPublisher: src: "+this.src+", type: "+this.type}};function _get(src,sEvent){var publisherList=Registry[sEvent]||(Registry[sEvent]=[]),i,len,publisher;for(i=0,len=publisherList.length;i<len;i++){publisher=publisherList[i];if(publisher.src===src){return publisher}}publisher=new DomEventPublisher(src,sEvent);publisherList[len]=publisher;if(isMaybeLeak){get(window,"unload").add(cleanUp);isMaybeLeak=false}return publisher}return get(src,sEvent)}function getTarget(ev){ev=ev||window.event;if(!ev){return null}var t=(ev||window.event)[TARGET];if(t&&t.nodeName==="#text"){t=t.parentNode}return t}function addCallback(o,type,cb){get(o,type).add(cb)}function removeCallback(o,type,bound,useCapture){var p=get(o,type);p.remove(bound)}function preventDefault(ev){ev=ev||window.event;if("preventDefault" in ev){ev.preventDefault()}else{if("returnValue" in ev){ev.returnValue=false}}}function stopPropagation(ev){if(HAS_EVENT_TARGET){ev.stopPropagation()}else{(window.event||ev).cancelBubble=true}}function cleanUp(){var sEvent,publisherList,i,len,publisher;for(sEvent in Registry){publisherList=Registry[sEvent];for(i=0,len=publisherList.length;i<len;i++){publisher=publisherList[i];if(publisher.src!=publisher.src.window){unbindCallstack(publisher)}}delete Registry[sEvent]}removeCallback(window,"onunload",cleanup);function unbindCallstack(publisher){var callStack=publisher._callStack,i,len,bound;for(i=0,len=callstack.length;i<len;i++){bound=callstack[i];publisher.remove(bound)}delete publisher._callStack}}return Event})();