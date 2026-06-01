function Inventory(game){
	info('INVENTORY', 'Initializing');

    this.ammo = 0;//50;
    this.grow = 0;//50;
    this.shrink = 0;//50;
    this.subdivide = 0;//1;
    this.commodin = 0;//1;
    this.shield = 0;//1;
    this.stickyball = 0;//1;
    this.ultraball = 0;//1;
    this.explosive = 0;//1;
    this.missile = 0;//1;
    
    // Instantaneos
    this.divide = false; 
    this.inverted = false; 
    this.onedown = false; 
    this.oneup = false; 
    this.halfscore = false;
    this.doublescore = false;
    
    this.game = game;
	
	this.snap = new Snapshot(	'i____',
								[],
								[this.ammo, this.grow, this.shrink, this.subdivide, this.commodin, this.shield, this.stickyball, this.ultraball,this.explosive, this.missile],
								[this.divide, this.inverted, this.onedown, this.oneup, this.halfscore, this.doublescore]);
}

Inventory.prototype.playback = function(s){
	if(!s)return;
	
	this.ammo 		= s.i[0];
    this.grow 		= s.i[1];
    this.shrink 	= s.i[2];
    this.subdivide 	= s.i[3];
    this.commodin 	= s.i[4];
    this.shield 	= s.i[5];
    this.stickyball	= s.i[6];
    this.ultraball 	= s.i[7];
    this.explosive 	= s.i[8];
    this.missile 	= s.i[9];
    
	this.divide 	= s.b[0];
    this.inverted 	= s.b[1];
    this.onedown 	= s.b[2];
    this.oneup 		= s.b[3];
    this.halfscore 	= s.b[4];
    this.doublescore= s.b[5];
}

Inventory.prototype.snapshot = function(){
	return this.snap.update(	[],
								[this.ammo,this.grow,this.shrink,this.subdivide,this.commodin,this.shield, this.stickyball,this.ultraball,this.explosive,this.missile],
								[this.divide,this.inverted,this.onedown,this.oneup,this.halfscore,this.doublescore]);
}

Inventory.prototype.test = function(){
	this.game.cheats = true;
	this.ammo = 999;
    this.grow = 999;
    this.shrink = 999;
    this.subdivide = 999;
    this.commodin = 999;//1;
    this.shield = 999;//1;
    this.stickyball = 999;//1;
    this.ultraball = 999;//1;
    this.explosive = 999;//1;
    this.missile = 999;//1;
}

Inventory.prototype.getNextPowerup = function(choices, currentItemIndex, backwards){
	var optionsExplored = 0;
	var optionsLimit = choices.length; 
	var index;
	
	for(var	i = (backwards?optionsLimit:0); 
			 (backwards ? i > 0	: i < optionsLimit); 
			 (backwards ? i--	: i++)){	
			 
		index = (i + currentItemIndex) % optionsLimit;
		
		if(!this.isEmpty(choices[index])) return index +(backwards?-1:1);
	}
	
	return +((currentItemIndex +(backwards?-1:1) ) % optionsLimit);
}

Inventory.prototype.reset = function(){
	this.ammo = 0;//50;
    this.grow = 0;//50;
    this.shrink = 0;//50;
    this.subdivide = 0;//1;
    this.commodin = 0;//1;
    this.shield = 0;//1;
    this.stickyball = 0;//1;
    this.ultraball = 0;//1;
    this.explosive = 0;//1;
    this.missile = 0;//1;
    
    // Instantaneos
    this.divide = false; 
    this.inverted = false; 
    this.onedown = false; 
    this.oneup = false; 
    this.halfscore = false;
    this.doublescore = false;    
	this.snapshot();
}	

Inventory.prototype.isEmpty = function(tokenType){
	switch(tokenType){
		case TOKEN_GROW:		return this.grow == 0;
		case TOKEN_SHRINK:		return this.shrink == 0;
		case TOKEN_SUBDIVIDE:	return this.subdivide == 0;
		case TOKEN_DIVIDE:		return this.divide == 0;
		case TOKEN_SHOOT:		return this.ammo == 0;
		case TOKEN_MISSILE:		return this.missile == 0;
		case TOKEN_EXPLOSIVE:	return this.explosive== 0;
		case TOKEN_ONEUP:		return this.oneup == 0;
		case TOKEN_ONEDOWN:		return this.onedown == 0;
		case TOKEN_ULTRABALL:	return this.ultraball== 0;
		case TOKEN_STICKBALL:	return this.stickyball== 0;
		case TOKEN_SHIELD:		return this.shield== 0;
		case TOKEN_COMMODIN:	return this.commodin== 0;
		case TOKEN_DELTASWAP:	return this.inverted == 0;
		case TOKEN_HALFSCORE:	return this.halfscore == 0;
		case TOKEN_DOUBLESCORE:	return this.doublescore == 0;
	}
	return false;
}

	
Inventory.prototype.inheritToken = function(tokenType){
	/* Set this as active powerup in case there wasn't any item before */
	var allEmpty = true;	
	for(var i=0; i< tokenNames.length; i++){
		if(!this.game.inventory.isEmpty(i)){
			allEmpty = false;
			break;
		}
	}
	if(allEmpty)this.game.setPowerupType(tokenType);
	
	switch(tokenType){
		case TOKEN_GROW:
			this.grow += 10;
			if(this.grow > 999) this.grow = 999;
			break;
			
		case TOKEN_SHRINK:
			this.shrink += 10;
			if(this.shrink > 999) this.shrink = 999;
			break;
			
		case TOKEN_SUBDIVIDE:
			this.subdivide++;
			if(this.subdivide > 999) this.subdivide = 999;			
			break;
			
		case TOKEN_DIVIDE:
			this.divide = true;
			if(this.divide > 999) this.divide = 999;			
			break;
			
		case TOKEN_SHOOT:
			this.ammo += 50;
			if(this.ammo > 999) this.ammo = 999;			
			break;
			
		case TOKEN_MISSILE:
			this.missile += 2;
			if(this.missile > 999) this.missile = 999;			
			break;
			
		case TOKEN_EXPLOSIVE:
			this.explosive++;
			if(this.explosive > 999) this.explosive = 999;			
			break;
			
		case TOKEN_ONEUP:
			this.oneup = true;
			break;
			
		case TOKEN_ONEDOWN:
			this.onedown = true;
			break;
			
		case TOKEN_ULTRABALL:
			this.ultraball++;
			if(this.ultraball > 999) this.ultraball = 999;			
			break;
			
		case TOKEN_STICKBALL:
			this.stickyball++;
			if(this.stickyball > 999) this.stickyball = 999;			
			break;
			
		case TOKEN_SHIELD:
			this.shield++;
			if(this.shield > 999) this.shield = 999;			
			break;
			
		case TOKEN_COMMODIN:
			this.commodin++;
			if(this.commodin > 999) this.commodin = 999;			
			break;
			
		case TOKEN_DELTASWAP:
			this.inverted = true;
			break;
			
		case TOKEN_HALFSCORE:
			this.halfscore = true;
			break;
			
		case TOKEN_DOUBLESCORE:
			this.doublescore = true;
			break;
	}
	
	this.update();
}

Inventory.prototype.update = function() {
	
	if(this.divide) {
		this.game.applyEffect(TOKEN_DIVIDE);
		this.divide = false;
	}
	if(this.inverted) {
		this.game.applyEffect(TOKEN_DELTASWAP);
		this.inverted = false;
	}
	if(this.oneup) {
		this.game.applyEffect(TOKEN_ONEUP);
		this.oneup = false;
	}
	if(this.onedown) {
		this.game.applyEffect(TOKEN_ONEDOWN);
		this.onedown = false;
	}        
	if(this.doublescore) {
		this.game.applyEffect(TOKEN_DOUBLESCORE);
		this.doublescore = false;
	}
	if(this.halfscore) {
		this.game.applyEffect(TOKEN_HALFSCORE);
		this.halfscore = false;
	}
}