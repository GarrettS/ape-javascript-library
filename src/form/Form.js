APE.namespace("APE.form");

APE.form.Form = function(form) {
    this.form = form;
};

APE.form.Form.prototype = {

    /**
     * Serializes the form according to HTML 4.01
     * http://www.w3.org/TR/html401/interact/forms.html#successful-controls
     *
     * @param {HTMLInputElement} submit an input that needs to be included in 
     * the successful controls.
     * @return {Object} An object who's property names are element names and 
     * values are arrays.
     */
    toObject : function(submit) {
        var form = this.form,
           elements = form.elements, i, len, 
           element, type, name, ontype = /^(?:rad|che)/,
           json = {},
           options,
           option,
           j, jlen,
           p, plen,
            // Although no browsers actually include "image" 
            // in elements collection.
           submitTypeExp = /^(?:submit|image)$/;

        if(!elements) {
            form = document.createElement('form').
                appendChild(form.cloneNode(true)).parentNode;
            elements = form.elements;
        }

        for(i = 0, len = elements.length; i < len; i++) {
            element = elements[i];
            type = element.type;
            name = element.name;
          
            
            if(!name || element.disabled || type == "reset" 
              || type == "button" || submitTypeExp.test(type) // only on event.
              || (ontype.test(type) && !element.checked)
              || (element.tagName == "OBJECT" && element.declare) 
              || element.type == "select-multiple" && !element.value) continue;
          
            p = json[name];

            if(!p) json[name] = p = [];
            plen = p.length;

            options = element.options;
            if(options) {
                if(element.type == "select-multiple") {
                for(j = 0, jlen = options.length; j < jlen; j++) {
                    option = options[j];
                    if(option.selected) {
                      p[plen] = option.value || option.text;
                    }
                }
            }
            else {
                option = options[element.selectedIndex];
                if(!option.disabled)
                    p[plen] = option.value || option.text;
            }
        }

          // https://bugzilla.mozilla.org/show_bug.cgi?id=371432
          // http://www.w3.org/TR/file-upload/
          //
          // Just take the first file.
        else if(element.type == "file") { 
            var files = element.files; 
            if(files && files[0]) {
              p[plen] = files[0];
            }
        }
        else {
            p[plen] = element.value;
          }
        }
        if(submit && submit.name) {
            if(!json[submit.name]) p = json[submit.name] = [];
            p[p.length] = submit.value;
        }
        return json;
    },

    /**
    * @return {Array} array of strings for successful data.
    */
    getMultipartFormData : function(e) {
    // Doesn't encode data.
    // http://groups.google.com/group/comp.lang.javascript/browse_thread/thread/eada69993b5ae08a/5943a32b5ecca6e6?lnk=gst&q=encodeURIComponent+post+xhr#5943a32b5ecca6e6
    // http://www.devx.com/Java/Article/17679/1954
    var json = this.toObject(e), prop, value, file, i, len, result = [],
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

    /** 
     * @return {String} the query string, including the "?".
     */
    getQueryString : function(e) {
        var json = this.toObject(e), prop, i, value, encodedProp, result = [], ws = /%20/g;
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
};