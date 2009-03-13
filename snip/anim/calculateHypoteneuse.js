
/** 
 * Calculates the distance between two points.
 * @param {x:int, y:int} start coords
 * @param {x:int, y:int} end coords
 * @return {uint} distance from start to end.
 * @static
 */
APE.anim.Animation.calculateHypoteneuse = function(start, end) {
    return Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));
};