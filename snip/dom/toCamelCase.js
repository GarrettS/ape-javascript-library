	// faster toCamelCase.
	var toCamelCaseExp = /-([a-z])/;
	function toCamelCase(s) {
		var R = RegExp;
		for(var exp = toCamelCaseExp; exp.test(s); s = s.replace(exp, R.$1.toUpperCase()));
		return s;
	}
