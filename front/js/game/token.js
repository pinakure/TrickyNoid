function Token(type, x, y){
    this.type = type > 0xF ? parseInt(Math.random()*16) : type;
    this.frame = 0;    
	this.x = parseInt(x); 
    this.y = parseInt(y);
	this.isAlive = true;
}

Token.prototype.initialize = function(type, x, y) {
	this.type = type > 0xF ? parseInt(Math.random()*16) : type;
	this.frame = 0;
	this.x = parseInt(x); 
    this.y = parseInt(y);
	this.isAlive = true;
}

Token.prototype.getType = function() {
	return this.type;
}

Token.prototype.getY = function() {
	return parseInt(this.y);
}

Token.prototype.getX = function() {
	return parseInt(this.x);
}

Token.prototype.update = function(timeScale) {        
	this.y += 1 * timeScale;
	this.frame += 3 * timeScale;
	if(this.frame >= 19.00) this.frame = 0.00;
}

Token.prototype.collides = function(paddle) {
	var pWidth =  paddle.width / 2;
	var pLeft  =  parseInt(paddle.position) - (pWidth);
	var pRight =  parseInt(paddle.position) + (pWidth);
	var pTop   =  paddle.y - 8;
	var pBottom = pTop + 10;
	
	if(( this.y >= pTop )&&( this.y <= pBottom )) {
		if(( this.x >= pLeft -14 )&&( this.x <= pRight)) {
			return true;
		}
	}
	
	return false;
}

Token.prototype.getFrame = function(){
	return parseInt(this.frame);
}   