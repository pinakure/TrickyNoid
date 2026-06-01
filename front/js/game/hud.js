function Hud(game){
	info('HUD', 'Initializing');
	this.self = this;
	this.spriteSheet = false;
	this.game = game;
	
	/* Create General Displays */
	this.displayTitle = new Display(48,	16, 14,	' ', FONT_LCD);
	this.displayTitle.setString('No title');
	
	this.displayLives = new Display(54,	14,  3,	'0', FONT_LCD);
	
	this.displayBricksLeft =		new Display(59,	17,	 3,	' ', FONT_LCD);
	this.displayLabelBricksLeft = 	new Display(48,	17,	 6,	'Bricks', FONT_LCD);
	
	this.displayLevel = 			new Display(59,	18,	 3,	' ', FONT_LCD);
	this.displayLabelLevel =		new Display(48,	18,	 5,	'Level', FONT_LCD);
	
	this.displayScore = 			new Display(54,	19,	 8,	' ', FONT_LCD);
	this.displayLabelScore =		new Display(48,	19,	 5,	'Score', FONT_LCD);
	this.displayHiScore = 			new Display(54,	20,	 8,	' ', FONT_LCD);
	this.displayLabelHiScore =		new Display(48,	20,	 3,	'Top', FONT_LCD);
	
	/* Create play time displays */
	
	this.displayPlayTime =  [];
	this.displayPlayTime[0] = new Display(57, 3, 2,'0', FONT_LCD);
	this.displayPlayTime[1] = new Display(60, 3, 2,'0', FONT_LCD);
	this.displayPlayTimeLabel = new Display(48, 3, 12,'Playtime   :', FONT_LCD);
	
	/* Create bullet time displays */	
	this.displayBulletTime 		= new Display(48,23, 14,'              ', FONT_LCD);
	this.displayBulletTime.isString = true;
	this.displayBulletTimeLabel	= new Display(48,22, 12,'Bullet Time:', FONT_LCD);
	
	/* Create inventory displays */
	var n =[this.game.inventory.grow,
			this.game.inventory.shrink,
			this.game.inventory.subdivide,
			this.game.inventory.ammo,
			this.game.inventory.missile,
			this.game.inventory.explosive,
			this.game.inventory.ultraball,
			this.game.inventory.stickyball,
			this.game.inventory.shield,
			this.game.inventory.commodin,
			this.game.lives];
			
	this.displayInventory = [];
	for(var i=0; i< 5; i++){
		this.displayInventory[ i ] = new Display(51, 6+i, 3, ' ', ((i == this.game.getPowerupType()) ? FONT_GREEN : FONT_WHITE ));
		this.displayInventory[i+5] = new Display(59, 6+i, 3, ' ', ((i == this.game.getPowerupType()-5) ? FONT_GREEN : FONT_WHITE));
		
		this.displayInventory[ i ].setNumber(n[ i ]);
		this.displayInventory[i+5].setNumber(n[i+5]);
	}
	this.displayInventory[10] = new Display(48,12, 14, ' ', FONT_GREEN);
	this.displayInventory[10].setString('');
	
	this.hudBlink = 0;
}

Hud.prototype.requestLabelRedraw = function() {
	this.displayLabelBricksLeft.redraw = true;
	this.displayLabelLevel.redraw = true;
	this.displayLabelScore.redraw = true;
	this.displayLabelHiScore.redraw = true;
	this.displayBulletTimeLabel.redraw = true;
	this.displayPlayTimeLabel.redraw = true;
}

Hud.prototype.render = function(g) {
	g.context[g.defaultContext].clearRect(244,203, 4,4);
	BallGfx[BALL_HUDLIGHT].frame = 0;
	BallGfx[BALL_HUDLIGHT].draw(244,203);
	
	g.context[g.defaultContext].clearRect(244,211, 4,4);
	BallGfx[BALL_HUDLIGHT].frame = 0;
	BallGfx[BALL_HUDLIGHT].draw(244,211);
	
	g.context[g.defaultContext].clearRect(244,219, 4,4);
	BallGfx[BALL_HUDLIGHT].frame = 0;
	BallGfx[BALL_HUDLIGHT].draw(244,219);
	
	/*Draw Labels*/
	this.displayLabelBricksLeft.render(g);
	this.displayLabelLevel.render(g);
	this.displayLabelScore.render(g);
	this.displayLabelHiScore.render(g);
	this.displayBulletTimeLabel.render(g);
	this.displayPlayTimeLabel.render(g);
	
	/* Render game status displays */
	this.game.musicplayer.render(g);
	this.displayTitle.render(g);
	this.displayLives.render(g);
	this.displayBricksLeft.render(g);
	this.displayLevel.render(g);
	this.displayScore.render(g);
	this.displayHiScore.render(g);
	
	/* Render Bullet Time*/
	this.displayBulletTime.render(g);
	
	/* Render Play Time*/
	this.displayPlayTime[0].render(g);
	this.displayPlayTime[1].render(g);
	
	/* Render Inventory */
	for(var i=0; i< 5; i++){
		this.displayInventory[ i ].currentFontIndex = this.game.inventory.isEmpty( i )?FONT_RED:this.displayInventory[ i ].currentFontIndex;
		this.displayInventory[ i ].render(g);
		this.displayInventory[i+5].currentFontIndex = this.game.inventory.isEmpty(i+5)?FONT_RED:this.displayInventory[i+5].currentFontIndex;
		this.displayInventory[i+5].render(g);
	}
	
	if(!this.game.inventory.isEmpty(this.game.getPowerupType())){
		this.displayInventory[10].render(g);
	}
	
	/* Display blinking lights zone */
	if(this.hudBlink > -1) {
		// this.map.render(234, 200, 2 + this.hudBlink);
		//this.map.render(234, 167, 2 + this.hudBlink);
		this.hudBlink = -1;
	} 
}

Hud.prototype.getBulletTimeString = function(){
	/*TODO: Sort this balltime issue */
	var char100 = 0x5f;
	var char50 = 0x5e;
	var char0 = 0x00;
	
	var x;
	var l = parseInt(this.game.bulletTime * 28);
	var t = parseInt(l/2);
	
	// Draw balltime progress bar
	var ret = "";
	for(x=0; x <  t; x++){	ret+= String.fromCharCode(char100+32); };
	for(x=t; x < 14; x++){	ret+= String.fromCharCode(char0 + 32); };
	
	//TODO: Learn why this line is not executing well
	if((l % 2) == 1) ret[t] = String.fromCharCode(char50 + 32);
	
	
	return ret;
}

Hud.prototype.updateInventory = function(){
	// Draw inventory stock numbers	
	var n =[this.game.inventory.grow,
			this.game.inventory.shrink,
			this.game.inventory.subdivide,
			this.game.inventory.ammo,
			this.game.inventory.missile,
			this.game.inventory.explosive,
			this.game.inventory.ultraball,
			this.game.inventory.stickyball,
			this.game.inventory.shield,
			this.game.inventory.commodin,
			this.game.lives];

	for(var i=0; i< 5; i++){
		this.displayInventory[ i ].currentFontIndex = ( i  == this.game.getPowerupType()) ? FONT_GREEN : FONT_WHITE;
		this.displayInventory[i+5].currentFontIndex = (i+5 == this.game.getPowerupType()) ? FONT_GREEN : FONT_WHITE;
		
		this.displayInventory[ i ].setNumber(n[ i ]);
		this.displayInventory[i+5].setNumber(n[i+5]);
	}	
	// Current Active Powerup name
	this.displayInventory[10].set(tokenNames[this.game.getPowerupType()]);
}

Hud.prototype.update = function(){

	this.updateInventory();
	
	/* Update LCD Screens */
	this.displayTitle.set(this.game.map.map.name);
	this.displayBricksLeft.set(this.game.bricks.bricksLeft);
	this.displayLevel.set(this.game.level+1);
	this.displayLives.set(this.game.lives);
	this.displayScore.set(this.game.score);
	this.displayHiScore.set(this.game.hiScore);
	
	/* Update Bullet Time monitor */
	this.displayBulletTime.set(this.getBulletTimeString());
	
	/*TODO: Format as time format!*/ 
	var secs = parseInt(this.game.playTime/5);
	this.displayPlayTime[0].set(parseInt(secs/60));
	this.displayPlayTime[1].set(secs%60);
}

