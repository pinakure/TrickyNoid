function SpriteSheet(source, tileWidth, tileHeight, rgb, caller){
	if(!caller)console.log(this);
	this.caller = caller;
	this.isLoaded = false;
	
	this.frames = [];
	this.rgb = rgb;
	
	this.tileWidth = tileWidth;
	this.tileHeight = tileHeight;
	
	this.source = source;
	this.image = false;
	this.imageWidth = 100;
	this.imageHeight = 100;
	
	this.load();
}

SpriteSheet.prototype.load = function(){
	this.image = new Bitmap(this.source, 1, this.imageWidth, this.imageHeight, this.continueLoad, this);
}

/*	-----------------------------------------------------------------------
	This funcion needs a self reference, so dont use 'this' but 'me' inside 
	since this belongs to the instance which LAST calls the callback. 
    -----------------------------------------------------------------------  */
SpriteSheet.prototype.continueLoad = function(me){
	me.imageWidth  = me.image.width;
	me.imageHeight = me.image.height;
	
	me.isLoaded = true;
	if(me.caller)
	me.caller.processGraphics(me.caller);
}