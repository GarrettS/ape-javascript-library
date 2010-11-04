APE.namespace("APE.test").mixin(new function() {
    
    this.Assert = that;
    this.fail = fail;
    
    function that(actualValue, constraint, message) {
        var errorMessage;
        try {
            errorMessage = constraint(actualValue);
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
});