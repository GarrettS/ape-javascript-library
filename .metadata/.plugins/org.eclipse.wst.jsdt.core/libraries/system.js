/*******************************************************************************
 * Copyright (c) 2008 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 ******************************************************************************
* Please see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
*/

/**
  * Object Object()
  * @constructor
  * @memberOf Object
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
 */
function Object(){}
 /**
  * function toString() 
  * @type    String
  * @memberOf   Object
  * @returns {String}
  * @throws  DOMException
  * @see     Object
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
 */  
Object.prototype.toString = function( ){return "";};
 /**
  * function toLocaleString() 
  * @type    String
  * @memberOf   Object
  * @returns {String}
  * @throws  DOMException
  * @see     Object
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
 */  
Object.prototype.toLocaleString  = function( ){return "";};
 /**
  * function valueOf() 
  * @type    Object
  * @memberOf   Object
  * @returns {Object}
  * @throws  DOMException
  * @see     Object
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
 */  
Object.prototype.valueOf = function( ){;};
 /**
  * function hasOwnProperty(V) 
  * @type    Boolean
  * @memberOf   Object
  * @param   {Object} V
  * @returns {Boolean}
  * @throws  DOMException
  * @see     Object
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
 */  
Object.prototype.hasOwnProperty  = function (V){return true;};
 /**
  * function isPrototypeOf(V) 
  * @type    Boolean
  * @memberOf   Object
  * @param   {Object} V
  * @returns {Boolean}
  * @throws  DOMException
  * @see     Object
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
 */  
Object.prototype.isPrototypeOf  = function (V){return true;};
 /**
  * function propertyIsEnumerable(V) 
  * @type    String
  * @memberOf   Object
  * @param   {Object} V
  * @returns {String}
  * @throws  DOMException
  * @see     Object
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
 */  
Object.prototype.propertyIsEnumerable  = function(V){return "";};
/**
  * Property constructor
  * @type  String
  * @memberOf Object
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
 */ 
Object.prototype.constructor="";

/**
  * Property Class
  * @type  String
  * @memberOf Object
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
 */ 
Object.prototype.Class="";
/**
  * Property Value
  * @memberOf Object
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
 */ 
Object.prototype.Value=0;
/**
  * function Get(property)
  * @memberOf Object
  * @type Object
  * @returns {Object}
  * @param {String} property
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
 */ 
Object.prototype.Get=function(property){};
/**
  * function Put(property, value)
  * @memberOf Object
  * @param {String} property
  * @param {String} value
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
 */ 
Object.prototype.Put=function(property, value){};
/**
  * function CanPut(property)
  * @memberOf Object
  * @param {String} property
  * @type Boolean
  * @returns {Boolean}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
 */ 
Object.prototype.CanPut=function(property){};
/**
  * function HasProperty(property)
  * @memberOf Object
  * @param {String} property
  * @type Boolean
  * @returns {Boolean}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
 */ 
Object.prototype.HasProperty=function(property){};
/**
  * function Delete(property)
  * @memberOf Object
  * @param {String} property
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
 */ 
Object.prototype.Delete=function(property){};
/**
  * function DefaultValue()
  * @memberOf Object
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
 */ 
Object.prototype.DefaultValue=function(){};
/**
  * function Match(value,index)
  * @memberOf Object
  * @param {String} value
  * @param {String} index
  * @type Object
  * @returns {Object}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
 */ 
Object.prototype.Match=function(value,index){};
/**
  * Object String()
  * @super Object
  * @type  constructor
  * @memberOf String
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
 */

function String(){}
String.prototype = new Object();

/**
  * static function fromCharCode(chars)
  * @type    String
  * @returns {String}
  * @param {Array} chars
  * @memberOf   String
  * @see     String
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
 */  
String.fromCharCode=function(chars){};
/**
  * Property length
  * @type    Number
  * @memberOf   String
  * @see     String
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
 */  
String.prototype.length =1;
 /**
  * function charAt(pos) 
  * @type    String
  * @memberOf   String
  * @param   {Number} pos
  * @returns {String}
  * @throws  DOMException
  * @see     String
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
 */  
String.prototype.charAt = function(pos){return "";};
 /**
  * function charCodeAt(pos) 
  * @type    String
  * @memberOf   String
  * @param   {Number} pos
  * @returns {String}
  * @throws  DOMException
  * @see     String
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
 */  
String.prototype.charCodeAt= function(pos){return "";};
 /**
  * function concat() 
  * @type    String
  * @memberOf   String
  * @returns {String}
  * @throws  DOMException
  * @see     String
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
 */  
String.prototype.concat= function(){return "";};
 /**
  * function indexOf(searchString, position) 
  * @type    Number
  * @memberOf   String
  * @param   {String} searchString
  * @param   {Number} position
  * @returns {Number}
  * @throws  DOMException
  * @see     String
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
 */  
String.prototype.indexOf = function(searchString, position){return 1;};
 /**
  * function lastIndexOf(pos) 
  * @type    Number
  * @memberOf   String
  * @param   {String} searchString
  * @param   {Number} position
  * @returns {Number}
  * @throws  DOMException
  * @see     String
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
 */  
String.prototype.lastIndexOf = function(searchString, position){return 1;};
 /**
  * function localeCompare(that) 
  * @type    Boolean
  * @memberOf   String
  * @param   {String} that
  * @returns {Boolean}
  * @throws  DOMException
  * @see     String
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
 */  
String.prototype.localeCompare = function(that){return true;};
 /**
  * function match(regexp) 
  * @type    Boolean
  * @memberOf   String
  * @param   {String} regexp
  * @returns {Boolean}
  * @throws  DOMException
  * @see     String
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
 */  
String.prototype.match = function(regexp){return true;};
 /**
  * function replace(searchValue, replaceValue) 
  * @type    String
  * @memberOf   String
  * @param   {String} searchValue
  * @param   {String} replaceValue
  * @returns {String}
  * @throws  DOMException
  * @see     String
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
 */  
String.prototype.replace = function(searchValue, replaceValue){return "";};
 /**
  * function search(regexp) 
  * @type    Number
  * @memberOf   String
  * @param   {String} regexp
  * @returns {Number}
  * @throws  DOMException
  * @see     String
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
 */  
String.prototype.search = function(regexp){return 1;};
 /**
  * function slice(start, end) 
  * @type    String
  * @memberOf   String
  * @param   {Number} start
  * @param   {Number} end
  * @returns {String}
  * @throws  DOMException
  * @see     String
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
 */  
String.prototype.slice = function(start, end){return "";};
 /**
  * function split(separator, limit) 
  * @type    Array
  * @memberOf   String
  * @param   {String} separator
  * @param   {Number} limit
  * @returns {Array}
  * @throws  DOMException
  * @see     String
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
 */  
String.prototype.split = function(separator, limit){return [];};
 /**
  * function substring(start, end) 
  * @type    String
  * @memberOf   String
  * @param   {Number} start
  * @param   {Number} end
  * @returns {String}
  * @throws  DOMException
  * @see     String
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
 */  
String.prototype.substring = function(start, end){return "";};
 /**
  * function toLowerCase() 
  * @type    String
  * @memberOf   String
  * @returns {String}
  * @throws  DOMException
  * @see     String
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
 */  
String.prototype.toLowerCase = function( ){return "";};
 /**
  * function toLocaleLowerCase() 
  * @type    String
  * @memberOf   String
  * @returns {String}
  * @throws  DOMException
  * @see     String
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
 */  
String.prototype.toLocaleLowerCase = function( ){return "";};
 /**
  * function toUpperCase() 
  * @type    String
  * @memberOf   String
  * @returns {String}
  * @throws  DOMException
  * @see     String
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
 */  
String.prototype.toUpperCase= function ( ){return "";};
 /**
  * function toLocaleUpperCase() 
  * @type    String
  * @memberOf   String
  * @returns {String}
  * @throws  DOMException
  * @see     String
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
 */  
String.prototype.toLocaleUpperCase = function( ){return "";};

/**
  * Object Number()
  * @super Object
  * @constructor
  * @memberOf Number
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
 */
function Number(){}
Number.prototype = new Object();
/**
  * property MIN_VALUE
  * @type Number
  * @memberOf Number
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Number.MIN_VALUE=0;
/**
  * property MAX_VALUE
  * @type Number
  * @memberOf Number
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Number.MAX_VALUE=0;
/**
  * property NaN
  * @type Number
  * @memberOf Number
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Number.NaN=0;
/**
  * property NEGATIVE_INFINITY
  * @type Number
  * @memberOf Number
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Number.NEGATIVE_INFINITY=0;
/**
  * property POSITIVE_INFINITY
  * @type Number
  * @memberOf Number
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Number.POSITIVE_INFINITY=0;
/**
  * function toFixed(fractionDigits)
  * @type Number
  * @memberOf Number
  * @param {Number} fractionDigits
  * @type Number
  * @returns {Number}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Number.prototype.toFixed=function(fractionDigits){};
/**
  * function toExponential(fractionDigits)
  * @type Number
  * @memberOf Number
  * @param {Number} fractionDigits
  * @type Number
  * @returns {Number}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Number.prototype.toExponential=function(fractionDigits){};
/**
  * function toPrecision(precision)
  * @type Number
  * @memberOf Number
  * @param {Number} precision
  * @type Number
  * @returns {Number}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Number.prototype.toPrecision=function(fractionDigits){};
/**
  * Object Boolean()
  * @super Object
  * @constructor
  * @memberOf Boolean
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
function Boolean(){};
Boolean.prototype = new Object();
/**
  * Object Array()
  * @super Object
  * @constructor
  * @memberOf Array
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
function Array(){};
Array.prototype = new Object();

/**
  * Property length
  * @type    Number
  * @memberOf   Array
  * @see     Array
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */  
Array.prototype.length = 1;
/**
  * function concat(args)
  * @param {Array} args
  * @type    Array
  * @returns {Array}
  * @memberOf   Array
  * @see     Array
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */  
Array.prototype.concat = function(args){};
/**
  * function join(seperator)
  * @param {String} seperator
  * @type    Array
  * @returns {Array}
  * @memberOf   Array
  * @see     Array
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */  
Array.prototype.join = function(seperator){};
/**
  * function pop()
  * @type    Object
  * @returns {Object}
  * @memberOf   Array
  * @see     Array
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */  
Array.prototype.pop = function(){};
/**
  * function push(args)
  * @param {Array} args
  * @memberOf   Array
  * @see     Array
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */  
Array.prototype.push = function(args){};
/**
  * function reverse()
  * @type    Array
  * @returns {Array}
  * @memberOf   Array
  * @see     Array
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */  
Array.prototype.reverse = function(){};
/**
  * function shift()
  * @type    Object
  * @returns {Object}
  * @memberOf   Array
  * @see     Array
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */  
Array.prototype.shift = function(){};
/**
  * function slice(start, end)
  * @type    Array
  * @returns {Array}
  * @param {Number} start
  * @param {Number} end
  * @memberOf   Array
  * @see     Array
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */  
Array.prototype.slice = function(start, end){};
/**
  * function sort(funct)
  * @type    Array
  * @returns {Array}
  * @param {Function} funct
  * @memberOf   Array
  * @see     Array
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */  
Array.prototype.sort = function(funct){};
/**
  * function splice(start, deletecount, items)
  * @type    Array
  * @returns {Array}
  * @param {Number} start
  * @param {Number} deletecount
  * @param {Array} items
  * @memberOf   Array
  * @see     Array
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */  
Array.prototype.splice = function(start, deletecount, items){};
/**
  * function unshift(items)
  * @type    Array
  * @returns {Array}
  * @param {Array} items
  * @memberOf   Array
  * @see     Array
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */  
Array.prototype.unshift = function(start){};
/**
  * Object Function()
  * @super Object
  * @constructor
  * @memberOf Function
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
 
function Function(){};
Function.prototype = new Object();

/**
  * function apply (thisArg, argArray)
  * @param {Object} thisArg
  * @param {Array} argArray
  * @type Object
  * @returns {Object}
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */ 
Function.prototype.apply=function(thisArg, argArray){};
/**
  * function call (thisArg, argArray)

  * @param {Object} thisArg
  * @param {Object} args
  * @type Object
  * @returns {Object}
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */ 
Function.prototype.call=function(thisArg, args){};
/**
  * property length
  * @type    Number
  * @returns {Number}
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */ 
Function.prototype.length=0;
/**
  * function HasInstance()
  * @type    Boolean
  * @returns {Boolean}
  * @memberOf   Function
  * @see     Array
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */ 
Function.prototype.HasInstance=function(){};

/**
  * Object Date(s)
  * @super Object
  * @constructor
  * @memberOf Date
  * @param {String} s
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */

function Date(s){};
Date.prototype = new Object();
/**
  * function MakeTime(hour, min, sec, ms)
  * @memberOf Date
  * @param {Number} hour
  * @param {Number} min
  * @param {Number} sec
  * @param {Number} ms  
  * @type Number
  * @returns {Number}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.MakeTime =function(hour, min, sec, ms){};
/**
 * function UTC(hour, min, sec, ms)
 * @memberOf Date
 * @param {Number} hour
 * @param {Number} min
 * @param {Number} sec
 * @param {Number} ms  
 * @type Number
 * @returns {Number}
 * @since Standard ECMA-262 3rd. Edition
 * @since Level 2 Document Object Model Core Definition.
    
*/
Date.UTC =function(hour, min, sec, ms){};

/**
  * function MakeDay(year, month, date)
  * @memberOf Date
  * @param {Number} year
  * @param {Number} month
  * @param {Number} date
  * @type Number
  * @returns {Number}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.MakeDay =function(year, month, date){};
/**
  * function MakeDate(day,time)
  * @memberOf Date
  * @param {Number} day
  * @param {Number} time

  * @type Number
  * @returns {Number}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.MakeDate =function(day,time){};
/**
  * function TimeClip(time)
  * @memberOf Date
  * @param {Number} time
  * @type Number
  * @returns {Number}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.TimeClip =function(time){};

/**
  * function parse(string)
  * @memberOf Date
  * @param {Strig} string
  * @type Date
  * @returns {Date}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.parse=function(string){};
/**
  * function toDateString()
  * @memberOf Date
  * @type String
  * @returns {String}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.toDateString=function(){};

/**
  * function toTimeString()
  * @memberOf Date
  * @type String
  * @returns {String}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.toTimeString=function(){};
/**
  * function toLocaleString()
  * @memberOf Date
  * @type String
  * @returns {String}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.toLocaleString=function(){return "";};
/**
  * function toLocaleDateString()
  * @memberOf Date
  * @type String
  * @returns {String}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.toLocaleDateString=function(){};
/**
  * function toLocaleTimeString()
  * @memberOf Date
  * @type String
  * @returns {String}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.toLocaleTimeString=function(){};

/**
  * function valueOf()
  * @memberOf Date
  * @type Object
  * @returns {Object}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.valueOf=function(){};

/**
  * function getFullYear()
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.

 */
Date.prototype.getFullYear=function(){};
/**
  * function getTime()
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.getTime=function(){};
/**
  * function getUTCFullYear()
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.getUTCFullYear=function(){};
/**
  * function getMonth()
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.getMonth=function(){};
/**
  * function getUTCMonth()
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.getUTCMonth=function(){};
/**
  * function getDate()
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.getDate=function(){};
/**
  * function getUTCDate()
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.getUTCDate=function(){};
/**
  * function getDay()
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.getDay=function(){};
/**
  * function getUTCDay()
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.getUTCDay=function(){};
/**
  * function getHours()
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.getHours=function(){};
/**
  * function getUTCHours()
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.getUTCHours=function(){};
/**
  * function getMinutes()
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.getMinutes=function(){};
/**
  * function getUTCMinutes()
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.getUTCMinutes=function(){};
/**
  * function getSeconds()
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.getSeconds=function(){};
/**
  * function getUTCSeconds()
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.getUTCSeconds=function(){};

/**
  * function getMilliseconds()
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.getMilliseconds=function(){};
/**
  * function getUTCMilliseconds()
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.getUTCMilliseconds=function(){};
/**
  * function getTimezoneOffset()
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.getTimezoneOffset=function(){};
/**
  * function setTime(value)
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @param {Number} value
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.setTime=function(value){};

/**
  * function setMilliseconds(value)
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @param {Number} value
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.setMilliseconds=function(value){};
/**
  * function setUTCMilliseconds(value)
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @param {Number} ms
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.setUTCMilliseconds=function(ms){};
/**
  * function setSeconds(sec,ms)
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @param {Number} sec
  * @param {Number} ms
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.setSeconds=function(sec,ms){};
/**
  * function setUTCSeconds(sec,ms)
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @param {Number} sec
  * @param {Number} ms
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.setUTCSeconds=function(sec,ms){};
/**
  * function setMinutes(min,sec,ms)
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @param {Number} min
  * @param {Number} sec
  * @param {Number} ms
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.setMinutes=function(min,sec,ms){};
/**
  * function setUTCMinute(min,sec,ms)
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @param {Number} min
  * @param {Number} sec
  * @param {Number} ms
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.setUTCMinute=function(min,sec,ms){};
/**
  * function setHours(hour, min,sec,ms)
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @param {Number} hour
  * @param {Number} min
  * @param {Number} sec
  * @param {Number} ms
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.setHours=function(hour,min,sec,ms){};
/**
  * function setUTCHours(hour, min,sec,ms)
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @param {Number} hour
  * @param {Number} min
  * @param {Number} sec
  * @param {Number} ms
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.setUTCHours=function(hour,min,sec,ms){};

/**
  * function setDate(date)
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @param {Number} date
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.setDate=function(date){};

/**
  * function setUTCDate(date)
  * @memberOf Date
  * @type Number
  * @returns {Number}
  * @param {Number} date
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.setUTCDate=function(date){};

/**
  * function setMonth(month,date)
  * @memberOf Date
  * @type Date
  * @returns {Date}
  * @param {Number} date
  * @param {Number} month
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.setMonth=function(month,date){};
/**
  * function setUTCMonth(month,date)
  * @memberOf Date
  * @type Date
  * @returns {Date}
  * @param {Number} date
  * @param {Number} month
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.setUTCMonth=function(month,date){};
/**
  * function setFullYear(month,date)
  * @memberOf Date
  * @type Date
  * @returns {Date}
  * @param {Number} date
  * @param {Number} month
  * @param {Number} year
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.setFullYear=function(year, month,date){};
/**
  * function setUTCFullYear(month,date)
  * @memberOf Date
  * @type Date
  * @returns {Date}
  * @param {Number} date
  * @param {Number} month
  * @param {Number} year
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Date.prototype.setUTCFullYear=function(year, month,date){};
/**
 * function toUTCString()
 * @memberOf Date
 * @type Date
 * @returns {String}
 * @since Standard ECMA-262 3rd. Edition
 * @since Level 2 Document Object Model Core Definition.

*/
Date.prototype.toUTCString=function(){};
/**
  * Object Global
  * @super Object
  * @constructor
  * @memberOf Global
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
function Global(){};
Global.prototype=new Object();
/**
  * Property NaN
  * @memberOf Global
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Global.prototype.NaN=0;
/**
  * Property Infinity
  * @memberOf Global
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Global.prototype.Infinity=0;
/**
  * function eval(s)
  * @memberOf Global
  * @param {String} s
  * @type Object
  * @returns {Object}
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */

//@GINO: Bug 197987 (Temp Fix)
/**
  * Property debugger
  * @memberOf Global
  * @description Debugger keyword
 */
Global.prototype.debugger=null;

Global.prototype.eval=function(s){};
/**
  * function parseInt(s,radix)
  * @memberOf Global
  * @param {String} s
  * @param {Number} radix
  * @type Number
  * @returns {Number}
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Global.prototype.parseInt=function(s,radix){};
/**
  * function parseFloat(s)
  * @memberOf Global
  * @param {String} s
  * @type Number
  * @returns {Number}
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Global.prototype.parseFloat=function(s){};
/**
 * function escape(s)
 * @memberOf Global
 * @param {String} s
 * @type String
 * @returns {String}
 * @since   Standard ECMA-262 3rd. Edition 
 * @since   Level 2 Document Object Model Core Definition.
 * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
*/
Global.prototype.escape=function(s){};
/**
 * function unescape(s)
 * @memberOf Global
 * @param {String} s
 * @type String
 * @returns {String}
 * @since   Standard ECMA-262 3rd. Edition 
 * @since   Level 2 Document Object Model Core Definition.
 * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
*/
Global.prototype.unescape=function(s){};
/**
  * function isNaN(number)
  * @memberOf Global
  * @param {String} number
  * @type Boolean
  * @returns {Boolean}
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Global.prototype.isNaN=function(number){};
/**
  * function isFinite(number)
  * @memberOf Global
  * @param {String} number
  * @type Boolean
  * @returns {Boolean}
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Global.prototype.isFinite=function(number){};
/**
 * function decodeURI(encodedURI)
 * @memberOf Global
 * @param {String} encodedURI
 * @type String
 * @returns {String}
 * @since   Standard ECMA-262 3rd. Edition 
 * @since   Level 2 Document Object Model Core Definition.
 * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
*/
Global.prototype.decodeURI=function(encodedURI){};
/**
 * @memberOf Global
 * @param {String} uriComponent
 * @type String
 * @returns {String}
 * @since   Standard ECMA-262 3rd. Edition 
 * @since   Level 2 Document Object Model Core Definition.
 * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
*/
Global.prototype.decodeURIComponent=function(uriComponent){};
/**
 * function encodeURIComponent(uriComponent)
 * @memberOf Global
 * @param {String} uriComponent
 * @type String
 * @returns {String}
 * @since   Standard ECMA-262 3rd. Edition 
 * @since   Level 2 Document Object Model Core Definition.
 * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
*/
Global.prototype.encodeURIComponent=function(uriComponent){};

/**
 * function encodeURIComponent(URI)
 * @memberOf Global
 * @param {String} URI
 * @type String
 * @returns {String}
 * @since   Standard ECMA-262 3rd. Edition 
 * @since   Level 2 Document Object Model Core Definition.
 * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
*/
Global.prototype.encodeURI=function(URI){};

/**
  * Object Math(\s)
  * @super Object
  * @constructor
  * @memberOf Math
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
function Math(){};
Math.prototype=new Object();
/**
  * Property E
  * @memberOf Math
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Math.E=0;
/**
  * Property LN10
  * @memberOf Math
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Math.LN10=0;
/**
  * Property LN2
  * @memberOf Math
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Math.LN2=0;
/**
  * Property LOG2E
  * @memberOf Math
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Math.LOG2E=0;
/**
  * Property LOG10E
  * @memberOf Math
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Math.LOG10E=0;
/**
  * Property PI
  * @memberOf Math
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Math.PI=0;
/**
  * Property SQRT1_2
  * @memberOf Math
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Math.SQRT1_2=0;
/**
  * Property SQRT2
  * @memberOf Math
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Math.SQRT2=0;
/**
  * function abs(x)
  * @memberOf Math
  * @param {Number} x
  * @type Number
  * @returns {Number}
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Math.abs=function(x){};
/**
  * function acos(x)
  * @memberOf Math
  * @param {Number} x
  * @type Number
  * @returns {Number}
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Math.acos=function(x){};
/**
  * function asin(x)
  * @memberOf Math
  * @param {Number} x
  * @type Number
  * @returns {Number}
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Math.asin=function(x){};
/**
  * function atan(x)
  * @memberOf Math
  * @param {Number} x
  * @type Number
  * @returns {Number}
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Math.atan=function(x){};
/**
  * function atan2(x,y)
  * @memberOf Math
  * @param {Number} x
   * @param {Number} y
  * @type Number
  * @returns {Number}
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Math.atan2=function(x,y){};
/**
  * function ceil(x)
  * @memberOf Math
  * @param {Number} x
  * @type Number
  * @returns {Number}
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Math.ceil=function(x){};
/**
  * function cos(x)
  * @memberOf Math
  * @param {Number} x
  * @type Number
  * @returns {Number}
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Math.cos=function(x){};
/**
  * function exp(x)
  * @memberOf Math
  * @param {Number} x
  * @type Number
  * @returns {Number}
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Math.exp=function(x){};
/**
  * function floor(x)
  * @memberOf Math
  * @param {Number} x
  * @type Number
  * @returns {Number}
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Math.floor=function(x){};
/**
  * function log(x)
  * @memberOf Math
  * @param {Number} x
  * @type Number
  * @returns {Number}
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Math.log=function(x){};
/**
  * function max(arg)
  * @memberOf Math
  * @param {Array} arg
  * @type Number
  * @returns {Number}
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Math.max=function(arg){};
/**
  * function min(arg)
  * @memberOf Math
  * @param {Array} arg
  * @type Number
  * @returns {Number}
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Math.min=function(arg){};
/**
  * function pow(x,y)
  * @memberOf Math
  * @param {Number} x
  @ @param {Number} y
  * @type Number
  * @returns {Number}
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Math.pow=function(x,y){};
/**
  * function pow()
  * @memberOf Math
  * @type Number
  * @returns {Number}
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Math.random=function(){};
/**
  * function round(x)
  * @memberOf Math
  * @param {Number} x
  * @type Number
  * @returns {Number}
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Math.round=function(x){};
/**
  * function sin(x)
  * @memberOf Math
  * @param {Number} x
  * @type Number
  * @returns {Number}
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Math.sin=function(x){};
/**
  * function sqrt(x)
  * @memberOf Math
  * @param {Number} x
  * @type Number
  * @returns {Number}
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Math.sqrt=function(x){};
/**
  * function tan(x)
  * @memberOf Math
  * @param {Number} x
  * @type Number
  * @returns {Number}
  * @since   Standard ECMA-262 3rd. Edition 
  * @since   Level 2 Document Object Model Core Definition.
  * @see    http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html     
 */
Math.tan=function(x){};
/**
  * Object RegExp()
  * @super Object
  * @constructor
  * @memberOf RegExp
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
function RegExp(){};
RegExp.prototype=new Object();
/**
  * function exec(string)
  * @param {String} string
  * @returns {Array}
  * @type Array
  * @memberOf RegExp
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
RegExp.prototype.exec=function(string){};
/**
  * function test(string)
  * @param {String} string
  * @returns {Boolean}
  * @type Boolean
  * @memberOf RegExp
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
RegExp.prototype.test=function(string){};
/**
  * property source
  * @type String
  * @memberOf RegExp
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
RegExp.prototype.source="";
/**
  * property global
  * @type Boolean
  * @memberOf RegExp
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
RegExp.prototype.global=false;

/**
  * property ignoreCase
  * @type Boolean
  * @memberOf RegExp
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
RegExp.prototype.ignoreCase=false;
/**
  * property multiline
  * @type Boolean
  * @memberOf RegExp
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
RegExp.prototype.multiline=false;
/**
  * property lastIndex
  * @type Number
  * @memberOf RegExp
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
RegExp.prototype.lastIndex=0;
/**
  * Object Error(message)
  * @super Object
  * @constructor
  * @param {String} message
  * @memberOf Error
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
function Error(message){};
Error.prototype=new Object();
/**
  * property name
  * @type String
  * @memberOf Error
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Error.prototype.name="";
/**
  * property message
  * @type String
  * @memberOf Error
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
Error.prototype.message="";
/**
  * Object EvalError()
  * @super Error
  * @constructor

  * @memberOf EvalError
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
function EvalError(){};
EvalError.prototype=new Error("");
/**
  * Object RangeError()
  * @super Error
  * @constructor

  * @memberOf RangeError
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
function RangeError(){};
RangeError.prototype=new Error("");
/**
  * Object ReferenceError()
  * @super Error
  * @constructor

  * @memberOf ReferenceError
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
function ReferenceError(){};
ReferenceError.prototype=new Error("");
/**
  * Object SyntaxError()
  * @super Error
  * @constructor

  * @memberOf SyntaxError
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
function SyntaxError(){};
SyntaxError.prototype=new Error("");
/**
  * Object TypeError()
  * @super Error
  * @constructor

  * @memberOf TypeError
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
function TypeError(){};
TypeError.prototype=new Error("");
/**
  * Object URIError()
  * @super Error
  * @constructor

  * @memberOf URIError
  * @since Standard ECMA-262 3rd. Edition
  * @since Level 2 Document Object Model Core Definition.
     
 */
function URIError(){};
URIError.prototype=new Error("");

//support for debugger keyword
var debugger = null;