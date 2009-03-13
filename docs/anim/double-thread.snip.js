// Double threading sounds attractive, but in reality, the timers collide too much
// instead of weaving.

if(this.isDoubleThreaded) {
	// Weave two timers. 
	delay = delay*1.5<<0;
	setTimeout(startBackgroundThread, 70);
	this.intervalId = window.setInterval(run, delay);
}
else {
	this.intervalId = window.setInterval(run, delay);
}

var self = this;
function startBackgroundThread() {
	self.intervalId2 = window.setInterval(run, delay);
}
