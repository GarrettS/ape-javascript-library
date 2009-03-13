APE.namespace("APE.anim.effect");

/**
 * @broken - under experimentation.
 */
APE.anim.effect.Blind = function(){};

APE.anim.effect.Blind.prototype = {
	className : "blind",
	
	_created : false,

	_atStart : false,

	/** Start the effect, all you need */
	start : function() {
		if(!this._created)
			this.createHTML();
	},

	reverse : function() {
		this._run();
	},

	init : function(appendTo, duration, numBlinds, isHorizontal) {
		this.id = appendTo;
		this.anim = new APE.anim.Timer(duration);
		this.anim.run = this._run;
		this.numBlinds = numBlinds;
		if(isHorizontal)
		this.createHTML(numBlinds, 1);
		this.createHTML(1, numBlinds);
	},

	/** Builds the HTML TABLE for the blinds.
	 * @protected -- make pkg function?
	 */
	createHTML : function(numCols, numRows) {
		var blindsDiv = document.getElementById(this.id);
        var s = "<table class='"+this.className+"'><tbody>";
        var e = "</tbody></table>";
        var join = Array.prototype.join;
        var td = join.call({length:numCols+1}, "<td><b class='"+this.className+"'></b></td>");
        var trs = join.call({length:(numRows||0)+1}, "<tr>"+td+"</tr>\n")        
        var html = s + trs + e;
        blindsDiv.innerHTML = html;
    },

	_run : function(rationalValue) {
        T = APE.anim.Transitions;
        var newValue;
        if(!!this.atStart) {
            rationalValue = 1-rationalValue;
            newValue = T.accel(rationalValue)
        } else {
            newValue = T.decel(rationalValue);
        }
        // Apply a transition.
	}
};

APE.anim.HorizontalBlind = function(appendTo, duration, numBlinds) {
	this.init(appendTo, duration, numBlinds);
};

APE.extend(APE.anim.effect.HorizontalBlind, APE.anim.effect.Blind);

APE.anim.effect.HorizontalBlind.prototype.run = function(rationalValue) {
	APE.anim.effect.Blind.run.call(this, rationalValue);
	var bs = blindTransition.style;
	bs.width = Math.ceil((rationalValue ) * ( blindsDiv.clientWidth / cellsPerRow  )) + "px";
};

APE.anim.effect.VerticalBlind = function(appendTo, duration) {
	this.init(appendTo, duration, numBlinds);
};

APE.extend(APE.anim.effect.HorizontalBlind, APE.anim.effect.Blind);

APE.anim.effect.VerticalBlind.prototype.run = function(rationalValue) {
	var bs = blindTransition.style;
	bs.height = Math.ceil((rationalValue ) * ( blindsDiv.clientHeight / numRows )) + "px";
};