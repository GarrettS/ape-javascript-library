/**
 * @fileoverview AOP methods useful for testing.
 * @author Garrett Smith
 */
 APE.namespace("APE.aop");

 APE.aop.Advice = {
	/** 
	 * Wraps o's method with advice.
	 * If the advice returns false, o's method won't fire.
	 *
	 * @param {Object} o the object that has the method.
	 * @param {string} funcName o's named method.
	 * @param {Function} advice to wrap. 
	 * @return 
	 * If returning false, o's method won't fire;
	 * If returning an array, the array is passed to apply to o's method call.
	 * Otherwise, just call o with the original arguments it was called with (default).
	 */
	addBefore : function(o, funcName, advice) {
		var m = o[funcName];
		o[funcName] = function beforeAdvice() {
			var proceed = advice.apply(o, arguments);
			// Call o's method.
			if(proceed !== false) {

				// Default: use arguments that o[funcName] was called with.
				var argsToApply = arguments;
				// Did we get other arguments?
				if(APE.aop.Advice.isArray(proceed)) {
					argsToApply = proceed;
				}
				// Allow host method to be called.
				return Function.prototype.apply.call(m, o, argsToApply);
			}
		}
	},

	/** 
	 * @param {Object} o The object whose method is to be advised.
	 * @param {string} funcName o's named method.
	 * @param {Function} advice to call after o[funcName] is called.
	 *
	 * @return the returnValue of the main function for argument [0],
	 * plus the arguments to the original function.
	 * 
	 */
	addAfter : function(o, funcName, advice) {
		var m = o[funcName];
		o[funcName] = function afterAdvice() {
			var returnValue = Function.prototype.apply.call(m, o, arguments);

			// First argument is the return value from the method.
			var args = [returnValue];
			args = args.concat.apply(args, arguments);
			return advice.apply(o, args);
		}
	},
	
	/** 
	 * Can't rely on the constructor property across frames.
	 * @return {boolean}
	 */
	isArray: function(o) { 
        if (o) {
           return typeof o.length == "number" && (typeof o.splice == "function");
        }
        return false;
    }
};