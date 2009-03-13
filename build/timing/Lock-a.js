/** Locking aspect. 
 * @author Garrett Smith
 * <p>
 * Aspect that can be used for AsyncRequest, Animation, or anything that 
 * involves setTimeout or setInterval.
 * </p>
 * Adds an <code>__ape_lock_has_lock</code> property to the object it locks on. Just ignore this.
 * 
 * @aspect
 * @scope {Object} Anything. APE.lock has no use independently - 
 * it is purely a locking mechanism.
 * @class
 */
APE.Lock = {
	getLock : function() {
		if(this.__ape_lock_has_lock) return false;
		return this.__ape_lock_has_lock = true;
	},
	releaseLock : function() {
		this.__ape_lock_has_lock = false;
	},
	isLocked : function() {
		return (true === this.__ape_lock_has_lock);
	}
};
