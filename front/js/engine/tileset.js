function Tileset(	firstgid, 	name, 
					imageWidth, imageHeight, 
					tileWidth, 	tileHeight, 
					margin, 	spacing,
					xOffset, 	yOffset, 
					source, 	globalTileset) {
	this.isLoaded = false;
	this.name     = name;
	
	this.tileWidth  = parseInt(tileWidth);
	this.tileHeight = parseInt(tileHeight);
	this.firstgid   = parseInt(firstgid);
	this.tileCount  = 0;

	this.source     = source;
	this.image      = false;
	this.imageWidth = parseInt(imageWidth);
	this.imageHeight= parseInt(imageHeight);
	
	this.globalTileset = globalTileset;
	
	this.spacing = spacing == undefined?0:parseInt(spacing);
	this.xOffset = xOffset == undefined?0:parseInt(xOffset);
	this.yOffset = yOffset == undefined?0:parseInt(yOffset);
	this.margin  = margin  == undefined?0:parseInt(margin);
	
	this.load();
}

Tileset.prototype.load = function(){
	this.image = new Bitmap(this.source, 1, this.imageWidth, this.imageHeight, this.continueLoad, this);
}

/*	-----------------------------------------------------------------------
	This funcion needs a self reference, so dont use this, use me inside 
	it, since this belongs to the instance which LAST calls the callback 
    -----------------------------------------------------------------------  */
Tileset.prototype.continueLoad = function(me){
	
	me.imageWidth = parseInt(me.image.width);
	me.imageHeight = parseInt(me.image.height);

	cout('^8Processing ^3'+me.imageWidth+'^8x^3'+me.imageHeight+'^8 tileset (^3'+me.tileWidth+'^8x^3'+me.tileHeight+'^8px tiles)');
	
	me.tileCount=0;
	var x = 0, y = 0;
	
	for(y=me.margin; y < me.imageHeight; y += me.tileHeight + me.spacing){
		for(x=me.margin; x < me.imageWidth; x+= me.tileWidth + me.spacing){
			me.globalTileset[me.globalTileset.length] = new Tile(me.image, x, y, me.tileWidth, me.tileHeight, me.firstgid + me.tileCount);
			me.tileCount++;
		}
	}
	
	cout('^3'+me.tileCount+' tiles extracted, from #'+me.firstgid+' to #'+(me.tileCount+me.firstgid));
	
	me.isLoaded = true;
	game.continueLoad();
}

