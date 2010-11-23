APE.test.NativeConstraints = {
    isTrue : function(value) {
        return value === true ? "" : 
            "found " + value + " (" + (typeof value)  
                + "), expected true";
    }
};