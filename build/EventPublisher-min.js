(function(){var APE=self.APE,Registry={},isMaybeLeak
/*@cc_on=(@_jscript_version<5.7)@*/
;function EventPublisher(src,type){this.src=src;this._callStack=[];this.type=type}APE.EventPublisher=APE.createMixin(EventPublisher,{get:get,add:add,remove:remove,fire:fire,cleanUp:cleanUp,prototype:{add:function(fp,thisArg){this._callStack.push([fp,thisArg||this.src]);return this},addBefore:function(f,thisArg){return add(this,"beforeFire",f,thisArg||this.src)},addAfter:function(f,thisArg){return add(this,"afterFire",f,thisArg||this.src)},getEvent:function(type){return get(this,type)},remove:function(fp,thisArg){var cs=this._callStack,i,call;thisArg=thisArg||this.src;for(i=0;i<cs.length;i++){call=cs[i];if(call[0]===fp&&call[1]===thisArg){cs.splice(i,1)}}return this},removeBefore:function(fp,thisArg){return get(this,"beforeFire").remove(fp,thisArg||this.src)},removeAfter:function(fp,thisArg){return get(this,"afterFire").remove(fp,thisArg||this.src)},fire:function(payload){return fire(this)(payload)},toString:function(){return"APE.EventPublisher: {src="+this.src+", type="+this.type+", length="+this._callStack.length+"}"}}});function cleanUp(){var type,publisherList,publisher,i,len;for(type in Registry){publisherList=Registry[type];for(i=0,len=publisherList.length;i<len;i++){publisher=publisherList[i];publisher.src[publisher.type]=null}}Registry={}}function add(src,sEvent,fp,thisArg){return get(src,sEvent).add(fp,thisArg)}function remove(src,sEvent,fp,thisArg){return get(src,sEvent).remove(fp,thisArg)}function fire(publisher){return fireEvent;function fireEvent(e){var preventDefault=false,i,cs=publisher._callStack,csi;if(typeof publisher.beforeFire=="function"){try{if(publisher.beforeFire(e)==false){preventDefault=true}}catch(ex){deferError(ex)}}for(i=0;i<cs.length;i++){csi=cs[i];try{if(csi[0].call(csi[1],e)==false){preventDefault=true}}catch(ex){deferError(ex)}}if(typeof publisher.afterFire=="function"){if(publisher.afterFire(e)==false){preventDefault=true}}return !preventDefault}}function deferError(error){self.setTimeout(function(){throw error},1)}function get(src,sEvent){var publisherList=Registry[sEvent]||(Registry[sEvent]=[]),i,len,publisher;for(i=0,len=publisherList.length;i<len;i++){publisher=publisherList[i];if(publisher.src===src){return publisher}}publisher=new EventPublisher(src,sEvent);if(src[sEvent]){publisher.add(src[sEvent],src)}src[sEvent]=fire(publisher);publisherList[len]=publisher;return publisher}if(isMaybeLeak){get(window,"onunload").addAfter(cleanUp,EventPublisher)}})();