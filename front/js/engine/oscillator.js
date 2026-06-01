function Oscillator(begin, end, direction){
	this.begin = begin;
	this.end = end;
	this.current = begin;
	this.direction = begin > end? -direction : direction;
}

Oscillator.prototype.update = function(){
	this.current += this.direction;
	if(this.current >= this.end){
		this.current = this.end;
		this.direction *= -1;
	} else {
		if(this.current <= this.begin){
			this.current = this.begin;
			this.direction *= -1;
		}
	}
}