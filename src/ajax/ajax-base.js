APE.namespace("APE.ajax").mixin({
    appendToURI : function(baseUri, queryParams) {
        var ch = baseUri ? baseUri.indexOf("?") !== -1 ? "&" : "?" : "";
        return (baseUri || "") + ch + queryParams;
    },
    jsonp : function(data) { return data; }
});