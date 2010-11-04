APE.test.NativeConstraints = {
    isTrue : function(value, msg) {
        return value === true ? "" : 
            "found " + value + " (" + (typeof value)  
                + "), expected true";
    }
};