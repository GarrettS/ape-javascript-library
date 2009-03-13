/**
 * XXX: IE Fix for getElementById returning elements by name.
 */
(function(){
    var d = document, x = d.body, c,
        g = 'getElementById',
        orig = document[g];

    if(!x) return setTimeout(arguments.callee,50);

    try {
        c = d.createElement("<A NAME=0>");
        x.insertBefore(c, x.firstChild);
        if(d[g]('0')){
            x.removeChild(c);
            d[g] = getElementById;
        }
    } catch(x){}
    function getElementById(id) {
        var el = Function.prototype.call.call(orig, this, id), els, i;

        if(el.id == id) return el;
        els = this.getElementsByName(id);

        for(i = 0; i < els.length; i++)
            if(els[i].id === id) return els[i];
        return null;
    };
})();
