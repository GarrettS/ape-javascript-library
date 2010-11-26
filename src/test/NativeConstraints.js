APE.test.NativeConstraints = {
    isTrue : function(value) {
        return function() {
        	return value === true ? "" : 
	            "found " + value + " (" + (typeof value)  
	                + "), expected true";
        };
    },
    
    areSame : function(a, b) {
    	return function() {
    		var ret = "";
	    	if(a !== b) {
	    		ret = "a !== b";
	    		a = b = null;
	    	}
	    	return ret;
    	};
    }
};