function Tile(image, x, y, width, height, guid){
	this.image = image;
	this.x = parseInt(x);
	this.y = parseInt(y);
	this.guid = parseInt(guid);
	this.width = parseInt(width);
	this.height = parseInt(height);
}

Tile.prototype.renderStretched = function(x,y, w,h,xOffset, yOffset, layer){
	if(!this.image) return;
	/*x *= this.width;
	y *= this.height;*/
	x += xOffset;
	y += yOffset;
	
	game.graphics.context[layer].drawImage(	this.image.image, 
											this.x, this.y, 
											this.width, this.height, 
											x, y, 
											w, h);
}

Tile.prototype.render = function(x,y, xOffset, yOffset, layer){
	if(!this.image) return;
	/*x *= this.width;
	y *= this.height;*/
	x += xOffset;
	y += yOffset;
	
	game.graphics.context[layer].drawImage(	this.image.image, 
											this.x, this.y, 
											this.width, this.height, 
											x, y, 
											this.width, this.height);
}
