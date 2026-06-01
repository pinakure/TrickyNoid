function BigChar(direction, index, x, y, distance, delay){
	this.index = index;
	this.direction = direction;
	this.x = x;
	this.y = y;
	this.delay = delay;
	this.distance = distance;
	this.status = CHAR_OUT;
        
	switch(this.direction){
		case CHAR_DIRECTION_UP:
			this.dx = -0.0;
			this.dy = -1.0;
			break;
			
		case CHAR_DIRECTION_DOWN:
			this.dx = 0.0;
			this.dy = 1.0;
			break;
		
		case CHAR_DIRECTION_LEFT:
			this.dy = 0.0;
			this.dx = -1.0;
			break;
			
		case CHAR_DIRECTION_RIGHT:
			this.dy = 0.0;
			this.dx = 1.0;
			break;
	}
}

BigChar.prototype.getIndex = function(){		return this.index;		}
BigChar.prototype.setStatus = function(status) {	this.status = status;	}
BigChar.prototype.getX = function() { return this.x; }
BigChar.prototype.getY = function() {	return this.y; }

BigChar.prototype.opposite = function(){        
	if(this.direction == CHAR_DIRECTION_DOWN)return CHAR_DIRECTION_UP;
	if(this.direction == CHAR_DIRECTION_UP  )return CHAR_DIRECTION_DOWN;
	if(this.direction == CHAR_DIRECTION_LEFT)return CHAR_DIRECTION_RIGHT;
	return CHAR_DIRECTION_LEFT;
}

BigChar.prototype.update = function(Delta) {
	var cx=0.0;
	var cy=0.0;
	
	if(this.delay > 0.0){
		this.delay -= 0.5;
		return;
	}
	
	this.x += this.dx;
	this.y += this.dy;
	
	if(this.x > 320.0) this.x = 320.0;
	if(this.y > 240.0) this.y = 240.0;
	if(this.x < -32.0) this.x = -32.0;
	if(this.y < -32.0) this.y = -32.0;
	
	if(this.status != CHAR_LEAVING)
	switch(this.direction){
		case CHAR_DIRECTION_UP:
			if(this.distance > 0.0) {
				this.distance += this.dy;
			} else this.status = CHAR_ENTERING;
			cy = -this.dy;
			cx = 0.0;
			break;
			
		case CHAR_DIRECTION_DOWN:
			if(this.distance > 0.0) {
				this.distance -= this.dy;
			} else this.status = CHAR_ENTERING;
			cy = this.dy;
			cx = 0.0;
			break;
			
		case CHAR_DIRECTION_LEFT:
			if(distance > 0.0) {
				this.distance -= this.dy;
			} else this.status = CHAR_ENTERING;
			cx = -this.dx;
			cy = 0.0;
			break;
			
		case CHAR_DIRECTION_RIGHT:
			if(this.distance > 0.0) {
				this.distance -= this.dy;
			} else this.status = CHAR_ENTERING;
			cy = this.dx;
			cy = 0.0;
			break;
	}
	
	switch( this.status ){
		case CHAR_OUT:
			if(cx > 0.0) this.dx *= 1.05;
			if(cy > 0.0) this.dy *= 1.05;
			break;
			
		case CHAR_ENTERING:
			if( cx > 0.00) this.dx *= 0.8;
			if( cy > 0.00) this.dy *= 0.8;
			if( cx < 0.00) this.dx *= 0.8;
			if( cy < 0.00) this.dy *= 0.8;
			
			if((parseInt(cx) == 0)&&(parseInt(cy) == 0)) this.status = CHAR_IN;			
			break;
			
		case CHAR_IN:
			count("^CHAR ^3:^1Im in");
			break;
			
		case CHAR_LEAVING:
			switch( this.direction){
				case CHAR_DIRECTION_UP: 
					this.dy += 0.1;
					this.dy *= 1.05;
					if(this.y > 240.0) this.status = CHAR_DEAD;
					break;
				
				case CHAR_DIRECTION_DOWN: 
					this.dy -= 0.1;
					this.dy *= 1.05;
					if(this.y < 0.0) this.status = CHAR_DEAD;
					break;
					
				case CHAR_DIRECTION_LEFT: 
					this.dx -= 0.1;
					this.dx *= 1.05;
					if(this.x < -32.0) this.status = CHAR_DEAD;
					break;
				
				case CHAR_DIRECTION_RIGHT: 
					this.dx += 0.1;
					this.dx *= 1.05;
					if(this.x > 320.0) this.status = CHAR_DEAD;
					break;
			}
			break;
		
	}
}
