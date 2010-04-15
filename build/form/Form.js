APE.namespace("APE.form").Form = function(form) {
    this.form = form;
};

APE.form.Form.prototype = function() {
    
    function addOptions(select, p) {
        var option, options = select.options, i, len;
        if(select.multiple) {
            for(i = 0, len = options.length; i < len; i++) {
                option = options[i];
                if(option.selected) {
                  p.push(option.value || option.text);
                }
            }
        } else {
            option = options[select.selectedIndex];
            if(!option.disabled) {
                p.push(option.value || option.text);
            }
        }
    }
    
    return{
    
        /**
         * Serializes the form according to HTML 4.01
         * http://www.w3.org/TR/html401/interact/forms.html#successful-controls
         *
         * @param {HTMLInputElement} submit an input that needs to be included in 
         * the successful controls.
         * @return {Object} An object whose property names are element names and 
         * values are arrays.
         */
        toObject : function(submit) {
            var form = this.form,
               elements = form.elements, i, len, 
               element, type, name, ontype = /^(?:rad|che)/,
               json = {},
               p,
               isFieldset,
               formTagName = form.tagName,
               toUpperCase = formTagName.indexOf("f") === 0 ? "toUpperCase" : "toString",
                // Although no browsers actually include "image" 
                // in elements collection.
               submitTypeExp = /^(?:submit|image)$/;
    
            if(!elements && formTagName[toUpperCase]() === "FIELDSET") {
                form = form.form;
                isFieldset = true;
                elements = form.elements;
            }
    
            for(i = 0, len = elements.length; i < len; i++) {
                
                if(isFieldset && !APE.dom.contains(form, elements[i])) {
                    continue;
                }
                
                element = elements[i];
                type = element.type;
                name = element.name;
                
                if(!name || element.disabled || type == "reset" 
                  || type == "button" || submitTypeExp.test(type) // only on event.
                  || (ontype.test(type) && !element.checked)
                  || (element.tagName[toUpperCase]() === "OBJECT" && element.declare)) continue;
              
                p = json[name];
    
                if(!p) json[name] = p = [];
                
                if(element.id == "back")
                    alert(element.options)
                if(element.options) {
                    if( !addOptions(element, p) && p.length == 0 ) {
                        delete json[name];
                    }
                } else if(element.type == "file") { 
                     // Ignore:
                     //   https://bugzilla.mozilla.org/show_bug.cgi?id=371432
                     //   http://www.w3.org/TR/file-upload/
                } else {
                    p[p.length] = element.value;
                }
            }
            if(submit && submit.name && !submit.disabled) {
                if(!json[submit.name]) p = json[submit.name] = [];
                p[p.length] = submit.value;
            }
            return json;
        },
    
        /**
        * @return {Array} array of strings for successful data.
        */
        getMultipartFormData : function(submitButton) {
        // Doesn't encode data.
        // http://groups.google.com/group/comp.lang.javascript/browse_thread/thread/eada69993b5ae08a/5943a32b5ecca6e6?lnk=gst&q=encodeURIComponent+post+xhr#5943a32b5ecca6e6
        // http://www.devx.com/Java/Article/17679/1954
        var json = this.toObject(submitButton), prop, value, file, i, len, result = [],
            nn = '\r\n\r\n';
            for(prop in json) {
                value = json[prop];
                for(i = 0, len = value.length; i < len; i++) {
                    file = value[i];
                    if(!file) continue;
                    result[result.length] = "Content-Disposition: form-data; " +
                      'name="'+prop +'";'
                      + (file.fileName && file.getAsBinary ? ' filename="'+file.fileName +'"'
                        + nn + file.getAsBinary() : nn + file);
                }
            }
            return result;
        },
    
        /** @return {String} the query string, including the "?".  */
        getQueryString : function(e) {
            var json = this.toObject(e), prop, i, value, 
                encodedProp, result = [], len, ws = /%20/g;
            for(prop in json) {
                value = json[prop];
                encodedProp = encodeURIComponent(prop);
                for(i = 0, len = value.length; i < len; i++) {
                    result[result.length] = encodedProp +
                      "=" + encodeURIComponent(value[i]).replace(ws,'+');
                }
            }
            return result.join("&");
        },
    
        serialize : function(e) {
            var method = this.form.method.toLowerCase();
            if(method == "get") {
                return this.form.action + "?" + this.getQueryString(e);  
            }
            if(method == "post") {
                if(this.form.enctype == "multipart/form-data")
                    return this.getMultipartFormData(e);
                return this.getQueryString(e);
            }
        }
    }
}();