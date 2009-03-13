/**
 *
 * @fileoverview
 * @requires APE.anim.Animation, APE.dom.StyleSheetAdapter
 */
/**
 * @constructor
 * @param {string} id table element id
 * @param {number} duration milliseconds 
 */
function TableAccordian(id, duration){
    this.id = id;
    this.duration = (duration||300)/1000;
    this.rows = [];
    this.sheet = new APE.dom.StyleSheetAdapter(this.id + "Sheet");
}
TableAccordian.getById = APE.getById;
TableAccordian.prototype = {

    getRow : function(i) {
        var table, row = this.rows[i];
        if(!row){
            table = document.getElementById(this.id);
            row = TableAccordian.Row.getByNode(table.rows[i], this);
            this.rows[i] = row;
        }
        return row;
    },
    
    toggleRow : function(i) {
        this.getRow(i).toggle();
    },

    openRow : function(i) {
        this.getRow(i).open();
    },

    closeRow : function(i) {
        this.getRow(i).close();
    }
};

/**
 * @config   
 * @param row
 * @param tableAccordian
 * @extends APE.anim.Animation
 */
TableAccordian.Row = function(row, tableAccordian){
    // call thr superclass.
    APE.anim.Animation.call(this, tableAccordian.duration);
    this.transition = APE.anim.Transitions.accel;
    this.id = row.id;
    var selectorText = "#" + tableAccordian.id + " #" + row.id + " .tableAccordian";
    var rule = tableAccordian.sheet.getRule(selectorText);
    if(!rule) {
        rule = tableAccordian.sheet.addRule(selectorText);
    }
    this.style = rule.style;
    this.isExpanded = row.offsetHeight != 0;
    this.maxHeight = this.getRowHeight(row);
    this.isReversed = this.isExpanded;
    rule.style.height = "0";
    row.style.display = "";
};
TableAccordian.Row.name = "TableAccordianRow";

TableAccordian.Row.getByNode = APE.getByNode;

APE.extend(TableAccordian.Row, APE.anim.Animation, {

    run : function(rationalValue) {

        var newValue = 1- rationalValue;
        if ('opacity' in this.style) {
            this.style.opacity = String(newValue);
        } else {
            this.style.filter = "alpha(opacity=" + (0 | newValue * 100) + ")";
        }
        this.style.height = newValue * this.maxHeight + "px";
    },

    onstart : function() {
        this.isExpanded = !this.isExpanded;
    },
    
    toggle : function(){
        if(this.isExpanded) {
            this.seekTo(1);
        } else {
            this.seekTo(0);
        }
    },

    open : function() {
        if(this.isExpanded) {
            this.seekTo(0);
        }
    },

    close : function() {
        if(this.isExpanded) {
            this.seekTo(1);
        }
    },

    /**
     * Used internally.
     * displays the cell in the row and calculates the
     * height of its content area.
     */
    getRowHeight : function(){
        var row = document.getElementById(this.id),
            cell = row.cells[0],
            cStyle = cell.style,
            rStyle = row.style,
            pStyle = row.parentNode.style,
            cCssText = cStyle.cssText,
            rCssText = rStyle.cssText,
            pCssText = pStyle.cssText,
                // IE <= 7 cannot handle table css.
            b = cell.currentStyle ? "display: block;" : "",
            cHeight;
        cStyle.cssText = b + "display: table-cell";
        rStyle.cssText = b + "display: table-row;";
        pStyle.cssText = b + "display: table-row-group";
        cStyle.height = rStyle.height = pStyle.height = "auto";

        // Grab the displayed row's clientHeight.
        cHeight = cell.clientHeight;
        // get the height of the content area of the cell.
        cStyle.height = cHeight + "px";
        var dh = cell.clientHeight - cHeight;

        // Put it all back.
        cStyle.cssText = cCssText;
        rStyle.cssText = rCssText;
        pStyle.cssText = pCssText;

        return cHeight - dh;
    }
});

