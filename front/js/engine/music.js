function Music(filename){
	this.listeners = [];
	this.loop = false;
	this.fileName = filename;
	this.play = false;
}

Music.prototype.addListener = function(musicListener){
	this.listeners[this.listeners.length] = musicListener;
}

/*TODO READ DOC ABOUT THESE*/
Music.prototype.fade = function(percent, step, boolval){
	
}

Music.prototype.playing = function(){
	return this.play;
}

Music.prototype.loop = function(){
	this.loop = loop;
}