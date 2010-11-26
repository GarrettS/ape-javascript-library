APE.namespace("APE.test").Assert = new function() {
    
    this.that = that;
    this.fail = fail;
    
    function that(constraint, message) {
        var errorMessage;
        try {
            errorMessage = constraint();
        } catch(ex) {
            throw new Error("constraint could not complete. ");
        }
        if(errorMessage) {
            throw new AssertionError(errorMessage, message);
        }
    }
    
    // TODO: Move to a "test" message.
    function fail(message) {
        throw new AssertionError(message || "Test force-failed.");
    }
    
    function AssertionError(defaultMessage, customMessage){
        this.message = defaultMessage + 
            (customMessage ? "; " + customMessage : "");
        this.name = "AssertionError";
    }
};