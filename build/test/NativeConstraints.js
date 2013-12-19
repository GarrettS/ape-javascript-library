APE.test.NativeConstraints = {
    isTrue : function(value, message) {
        return function() {
        	return value === true ? "" : 
	            "found " + value + " (" + (typeof value)  
	                + "), expected true. " + (message || "");
        };
    },
    
    isFalse : function(value, message) {
        return function() {
            return value === false ? "" : 
                "found " + value + " (" + (typeof value)  
                    + "), expected false. " + (message || "");
        };        
    },
    
    areSame : function(a, b, message) {
    	return function() {
    		var ret = "";
	    	if(a !== b) {
	    		ret = "Actual " + a + " (" + typeof a + ")"
	    			+ " was not " + b + " (" + typeof b + "). " 
	    			+ (message || "");
	    		a = b = null;
	    	}
	    	return ret;
    	};
    }
	
};