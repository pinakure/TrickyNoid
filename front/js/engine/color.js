function Color(r,g,b){
	this.r = r;
	this.g = g;
	this.b = b;
	
	this.initialR = r;
	this.initialG = g;
	this.initialB = b;
}

Color.prototype.darker = function(percent){
	this.gamma(percent);
}

Color.prototype.lighter = function(percent){
	this.gamma(percent);
}

Color.prototype.scaleCopy = function(percent){
	this.gamma(percent);
	return new Color(this.r, this.g, this.b);
}

Color.prototype.gamma = function(percent){
	this.r = this.initialR * percent;
	this.g = this.initialG * percent;
	this.b = this.initialB * percent;
	this.clamp();
}

Color.prototype.getHexScaled = function(scale){
	return "#"+	("00" + (+parseInt(this.r*scale)).toString(16)).substr(-2)+
				("00" + (+parseInt(this.g*scale)).toString(16)).substr(-2)+
				("00" + (+parseInt(this.b*scale)).toString(16)).substr(-2);
}


Color.prototype.getHex = function(){
	return "#"  +	("00" + (+this.r).toString(16)).substr(-2)+
					("00" + (+this.g).toString(16)).substr(-2)+
					("00" + (+this.b).toString(16)).substr(-2);
}

Color.prototype.clamp = function(){
	this.r = this.r >= 0 ? this.r : 0;
	this.g = this.g >= 0 ? this.g : 0;
	this.b = this.b >= 0 ? this.b : 0;	
	this.r = this.r <= 255 ? this.r : 255;	
	this.g = this.g <= 255 ? this.g : 255;	
	this.b = this.b <= 255 ? this.b : 255;	
}