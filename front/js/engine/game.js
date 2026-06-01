$(function(){	try { main(); } catch(e) { console.log(e); cout(e.message) } });

var tokenNoStockColor = new Color(40,20,10);
var tokenStockColor = new Color(128,128,128);

var game = false;
	
var updateDelay = 15;
var updateDelta = 1 / updateDelay;
	
function update(){
	game.update(updateDelta);
	game.render();
	
	setTimeout(update, updateDelay);
}

function Game(width, height, fullScreen, scale, graphics){
	
	info("ENGINE", "Initializing");

	this.name = "Game";
    this.serialVersionUID = 8799656478674700001;
	
	this.cheats = false;
	this.timeout = 0;
	    
	this.MODE_GAME_ARCADE = 10;
    this.MODE_GAME_TIMEATTACK = 11;
    this.MODE_GAME_VERSUS = 12;
    this.MODE_GAME_PUZZLE = 13;
    this.MODE_CURTAIN_ROUNDCLEAR = 20;
    this.MODE_CURTAIN_BONUSCOINS = 21;
    this.MODE_CURTAIN_ENTERLEVEL = 22;
    this.MODE_CURTAIN_GAMEOVER = 23;
    this.MODE_MENU = 0;
    this.MODE_EXIT = 100;
	
	// These should be private...
    this.map = false;					/*Map*/
	this.menu = false;					/*Menu*/
    this.balls = false;				/*BallSystem*/
    this.shots = false; 				/*ProjectileSystem*/
    this.bricks = false;				/*BrickSystem*/
    this.curtain = false; 				/*Curtain*/
    this.reaction = false;				/*HitReaction*/
    this.particles = false;			/*ParticleSystem*/
    this.inventory = false;			/*Inventory*/
    this.explosions = [];	 			/*ExplosionSystem*/
    this.bigDisplay = false; 			/*BigDisplay*/
    this.tokenSystem = false; 			/*TokenSystem*/
    this.scheduledExplosions = [];	 	/*ExplosionSystem*/
	
    this.mode = 0;	
    this.lives = 0;
    this.level = 0;
    this.score = 0;
    this.status = 0;
	this.hiScore = 0;
    this.gamemode = 0;
    this.timeScale = 0;
    this.bulletTime = 0;
    this.powerupType = 0;
    this.gameOver = false;

    this.time = 0;
    this.Delta = 0; // Game delta
    this.playTime = 0;
    this.scoreMultiplier = 1;
    
    this.accel = 0.0;
    this.maxAccel = 1.5;
   
	this.width = width;
	this.height = height;
	this.graphics = graphics;
    
	this.fullScreen = fullScreen;
	this.scale = scale;
	
	this.backdrop = new Backdrop(140);
	this.input = new InputManager(this);	
	
	this.map = false;
	
	this.inventory = new Inventory(this);
    this.reaction = new HitReaction(this);
    this.bricks = false;
    this.shots = false;
    this.mode = this.MODE_GAME_ARCADE;
    this.gamemode = this.mode;
	
	// this.menu = new Menu(this, Menu.MENU_MAIN);
    this.menu = new Menu(this, 0);

	this.paddle = new Paddle(false, this);
	
	this.hud = new Hud(this);
	this.musicplayer = new MusicPlayer(this);

	this.explosions = new ExplosionSystem(this);
	this.curtain = new Curtain(this);
	this.bigDisplay = new BigDisplay(this);
	this.inventory = new Inventory(this);
	this.balls = new BallSystem(this);
	this.tokenSystem = new TokenSystem(this);
	this.bricks = new BrickSystem(this);
	this.scheduledExplosions = new ExplosionSystem(this);
	this.shots = new ProjectileSystem(this);
	this.particles = new ParticleSystem(this);
	this.paddle.reset();
	
	this.demo = new Demo(this);
    
	this.backdrop = new Backdrop(this.musicplayer.getTempo());
	
	cout('Engine initialized');
	
	this.snap = new Snapshot(	'g____',
								[this.timeScale, this.bulletTime, this.time, this.Delta],
								[this.mode, this.gamemode, this.lives, this.level, this.score, this.status, this.powerupType],
								[ACTION_PREV_POWERUP, ACTION_NEXT_POWERUP, ACTION_ACTIVATE, ACTION_CANCEL, ACTION_BALLTIME, ACTION_FORCE_TILT, ACTION_TILT_UP , ACTION_TILT_DOWN , ACTION_TILT_LEFT , ACTION_TILT_RIGHT]);
}
     
Game.prototype.snapshot = function() {
	return this.snap.update(	[this.timeScale, this.bulletTime, this.time, this.Delta],
								[this.mode, this.gamemode, this.lives, this.level, this.score, this.status, this.powerupType],
								[ACTION_PREV_POWERUP, ACTION_NEXT_POWERUP, ACTION_ACTIVATE, ACTION_CANCEL, ACTION_BALLTIME, ACTION_FORCE_TILT, ACTION_TILT_UP, ACTION_TILT_DOWN, ACTION_TILT_LEFT, ACTION_TILT_RIGHT]);
}

Game.prototype.playback = function(s) {	
	if(!s)return;
	
	this.timeScale 		= 	s.f[0];
	this.bulletTime 	= 	s.f[1];
	this.time 			=	s.f[2];
	this.Delta 			=	s.f[3];
	
	this.mode 			= 	s.i[0];
	this.gamemode 		= 	s.i[1];
	this.lives 			= 	s.i[2];
	this.level 			= 	s.i[3];
	this.score 			= 	s.i[4];
	this.status 		= 	s.i[5];
	this.powerupType 	=	s.i[6];
	
	ACTION_PREV_POWERUP = 	s.b[0];
	ACTION_NEXT_POWERUP = 	s.b[1];
	ACTION_ACTIVATE 	= 	s.b[2];
	ACTION_CANCEL 		= 	s.b[3];
	ACTION_BALLTIME 	= 	s.b[4];
	ACTION_FORCE_TILT 	= 	s.b[5];
	ACTION_TILT_UP 		= 	s.b[6];
	ACTION_TILT_DOWN 	= 	s.b[7];
	ACTION_TILT_LEFT 	= 	s.b[8];
	ACTION_TILT_RIGHT	= 	s.b[9];
}
    
Game.prototype.resetSystems = function(){
	
	this.bigDisplay.reset();
	this.balls.reset();
	this.paddle.reset();	
	this.balls.reset();	
	this.tokenSystem.reset();
	this.particles.reset();
	this.shots.reset();	
	this.explosions.reset();
	this.scheduledExplosions.reset();	
	this.bricks.reset();	
}

Game.prototype.New = function() {
	cout("^6------------------- Starting new game --------------------");
	
	if(this.hud == null) {
		complaint("GAME", "Hud is not loaded", {message:'You need to load it prior to this call.'});
		return;
	}

	this.score = 0;
	this.lives = 5;
	this.gameOver = false;
	this.timeScale = 1.0;        
	this.powerupType = 0x00;
	this.level = 0;    
	this.score = 0;
	
        
	// TODO: Get hi-score from the server's scoreboard
	this.hiScore = 800000;
	this.bulletTime = 1.0;
	this.playTime = 0;

	this.curtain.reset();
	this.inventory.reset();
	this.resetSystems();

	/* Load map (must be done after creating bricksystem */
	if(this.map == false){
		this.map = new Map(MAP_LIST[this.level], this);        
	} else {
		this.map.loadMap(MAP_LIST[this.level]);
	}

	//this.musicplayer.load();
	this.musicplayer.nextTrack();    
	this.paddle.position = 110;
	this.snapshot();
	cout("New game started");	
}    
	
Game.prototype.nextMap = function(){
	this.resetSystems();
	this.setLevel(this.level + 1);
	this.map.loadMap(MAP_LIST[this.level % MAP_LIST.length]);	
	this.paddle.position = 110;
	
	// TODO: Unmute this if roundclear fanfare is finally inbetween the process
	//musicplayer.NextSong();  

	//Reset timer
	if(this.gamemode == this.MODE_GAME_TIMEATTACK | this.gamemode == this.MODE_GAME_VERSUS){
		// Load new timer
		this.playTime = 600;
	} else {
		this.playTime = 0;
	}
}

Game.prototype.renderInventary = function(){
	var lastContext = this.graphics.defaultContext;
	this.graphics.defaultContext = this.graphics.context.length - 1;
	
	//TODO: Remove when HUD Backdrop is drawing
	this.graphics.context[this.graphics.defaultContext].clearRect(241,48, 13, 43);
	this.graphics.context[this.graphics.defaultContext].clearRect(281,48, 13, 43);
	
	this.graphics.setDrawMode(this.graphics.MODE_ALPHA_BLEND);
	
	this.graphics.setColor(this.inventory.grow > 0 ? tokenStockColor : tokenNoStockColor);
	this.graphics.fillRect(244,49, 10,8);
	this.tokenSystem.drawToken(241,  48, TOKEN_GROW);
	
	this.graphics.setColor(this.inventory.shrink > 0 ? tokenStockColor : tokenNoStockColor);
	this.graphics.fillRect(244,57, 10,8);
	this.tokenSystem.drawToken(241,  56, TOKEN_SHRINK);
	
	this.graphics.setColor(this.inventory.subdivide > 0 ? tokenStockColor : tokenNoStockColor);
	this.graphics.fillRect(244,65, 10,8);	
	this.tokenSystem.drawToken(241,  64, TOKEN_SUBDIVIDE);
	
	this.graphics.setColor(this.inventory.ammo > 0 ? tokenStockColor : tokenNoStockColor);
	this.graphics.fillRect(244,73, 10,8);	
	this.tokenSystem.drawToken(241,  72, TOKEN_SHOOT);
	
	this.graphics.setColor(this.inventory.missile > 0 ? tokenStockColor : tokenNoStockColor);
	this.graphics.fillRect(244,81, 10,9);	
	this.tokenSystem.drawToken(241,  80, TOKEN_MISSILE);
	
	this.graphics.setColor(this.inventory.explosive > 0 ? tokenStockColor : tokenNoStockColor);
	this.graphics.fillRect(284,49, 10,8);
	this.tokenSystem.drawToken(281,  48, TOKEN_EXPLOSIVE);
	
	this.graphics.setColor(this.inventory.ultraball> 0 ? tokenStockColor : tokenNoStockColor);
	this.graphics.fillRect(284,57, 10,8);
	this.tokenSystem.drawToken(281,  56, TOKEN_ULTRABALL);
	
	this.graphics.setColor(this.inventory.stickyball > 0 ? tokenStockColor : tokenNoStockColor);
	this.graphics.fillRect(284,65, 10,8);	
	this.tokenSystem.drawToken(281,  64, TOKEN_STICKBALL);
	
	this.graphics.setColor(this.inventory.shield > 0 ? tokenStockColor : tokenNoStockColor);
	this.graphics.fillRect(284,73, 10,9);	
	this.tokenSystem.drawToken(281,  72, TOKEN_SHIELD);
	
	this.graphics.setColor(this.inventory.commodin > 0 ? tokenStockColor : tokenNoStockColor);
	this.graphics.fillRect(288,81, 2,9);	
	this.tokenSystem.drawToken(281,  80, TOKEN_COMMODIN);

	if(!this.inventory.isEmpty(this.powerupType)){
		this.graphics.context[this.graphics.defaultContext].clearRect(269,86, 15, 12);
		this.graphics.setDrawMode(this.graphics.MODE_NORMAL);
		TokenGfx[this.powerupType].frame = 0;
		TokenGfx[this.powerupType].draw(269, 86);
	}
	
	this.graphics.defaultContext = lastContext;
}
    

Game.prototype.Over = function() {
	/* Game over process */
	this.gameOver = true;
	this.level = 0;
}

Game.prototype.addScore = function(point){
	this.score += point;
}

Game.prototype.addToken = function(type, x, y){
	this.tokenSystem.add(type, x, y);
}

Game.prototype.oneUp = function(lives){
	this.lives += lives;        
}

Game.prototype.roundClear = function(){
	for(var i=0; i < 256; i++){
		this.particles.generate(i%16, 
								120 + parseInt((-1 + Math.atan( i / 50) )*8) ,
								120 + parseInt((-1 + Math.cos( i / 50) )*8) );
		this.particles.generate(i%16, 
								120 + parseInt((-1 + Math.sin( i / 50) )*8) ,
								120 + parseInt((-1 + Math.tan( i / 50) )*8) );
	}
	
	this.setMode(this.MODE_CURTAIN_ROUNDCLEAR);
}
Game.prototype.setMode = function(mode){
	this.mode = mode;
	this.status = 0;
	this.timeout = 0;
}

Game.prototype.oneDown = function(lives){
	this.lives -= lives;
	if( this.lives <= 0 ) {
		this.lives = 0;
		this.Over();
	}
}

Game.prototype.ready = function(){
	this.balls.reset();	
	this.paddle.reset();
	
	this.bulletTime = 1.0;
	
	this.musicplayer.quiet();
}

Game.prototype.brake = function() {
	this.paddle.setDelta(this.accel);
	if(this.accel < 0.0) this.accel += 0.6;
	if(this.accel > 0.0) this.accel -= 0.6;
	if(this.accel < 0.7 & this.accel > -0.7) this.accel = 0.0;
}

Game.prototype.moveLeft = function() {
	if(this.accel < 0.0) this.accel =- (this.accel / 2);
	this.paddle.setDelta(this.accel + 1.0);
	this.accel += 0.2;
	if(this.accel > this.maxAccel)this.accel = this.accel * 0.75;
}

Game.prototype.moveRight = function() {
	if(this.accel > 0.0 ) this.accel =- ( this.accel / 2 );
	this.paddle.setDelta(this.accel - 1.0);
	this.accel -= 0.2;
	if(this.accel < -this.maxAccel) this.accel = this.accel * 0.5;
}
   
Game.prototype.getMenu = function() {
	return this.menu;
}
    
Game.prototype.update = function(delta) {	
	this.Delta = delta; 
	
	this.updateMap();
	this.tokenSystem.update(this.Delta);
		
	PaddleGfx[ this.paddle.status ].update( parseInt( this.Delta * this.timeScale ));
	
	this.updatePaddle();
	this.balls.update(this.Delta);
	this.shots.update(this.Delta);
	this.particles.update(this.Delta);
	this.bricks.update(this.Delta);
	this.explosions.update(this.Delta);

	this.inventory.update();
	
	/* Increase or decrease game timer */
	switch(this.mode){
		case this.MODE_GAME_ARCADE:
		case this.MODE_GAME_PUZZLE:
			if(this.paddle.status != PADDLE_READY) {
				this.playTime += this.Delta * this.timeScale;
			}
			break;
			
		case this.MODE_GAME_TIMEATTACK:
		case this.MODE_GAME_VERSUS:
			if(this.paddle.status != PADDLE_READY) {
				if(this.playTime > 0) this.playTime -= this.Delta * this.timeScale;
				else {
					this.playTime = 0;
					// TODO: Gameover
					this.Over();
				}
			}
			break;
	}
}

var displayLayerIsDirty = false;

Game.prototype.render = function() {

	this.graphics.setContext(0);
	this.backdrop.render(this.graphics);
	
	this.graphics.setContext(1);			
	this.bricks.render(this.graphics);

	/* Apply Motion blur on bullet time mode */
	this.graphics.setContext(2);
	if(ACTION_BALLTIME){				
		this.graphics.motionblur();
		this.graphics.setContext(this.graphics.lastContext);
	} else this.graphics.clear(2);	
	
	switch(this.mode){
		case this.MODE_CURTAIN_ROUNDCLEAR:
		case this.MODE_CURTAIN_GAMEOVER:
		case this.MODE_CURTAIN_BONUSCOINS:
		case this.MODE_CURTAIN_ENTERLEVEL:
			displayLayerIsDirty = true;
		
			this.graphics.setContext(3);
			this.graphics.context[3].clearRect(0,0,230,240);
			this.curtain.render(this.graphics);
			this.particles.render(this.graphics);
			
			this.graphics.setContext(4);
			this.graphics.motionblur();
			this.bigDisplay.render(this.graphics);
			
			break;
			
		case this.MODE_GAME_ARCADE:
		case this.MODE_GAME_VERSUS:
		case this.MODE_GAME_TIMEATTACK:
		case this.MODE_GAME_PUZZLE:
			if(displayLayerIsDirty){
				displayLayerIsDirty=false;
				this.hud.requestLabelRedraw();
				this.graphics.context[4].clearRect(0,0,230,240);
				this.graphics.context[3].clearRect(0,0,230,240);
			}
		
			this.graphics.setContext(2);
			this.paddle.render(this.graphics);
			this.balls.render(this.graphics);
			this.tokenSystem.render(this.graphics);
			this.shots.render(this.graphics);
			this.graphics.setAlpha(0.75);
			this.explosions.render(this.graphics);			
			this.graphics.setAlpha(1);
			
			this.graphics.setContext(3);
			this.graphics.context[3].clearRect(0,0,230,240);
			this.particles.render(this.graphics);
			break;
	}
	
	this.graphics.setContext(4);		
	this.hud.render(this.graphics);
	this.renderInventary(this.graphics);
	
	if(this.mode == this.MODE_MENU) this.getMenu().render(this.graphics);
}
    
Game.prototype.doubleScore = function() {
	if(this.scoreMultiplier < 32) {
		this.scoreMultiplier *= 2;
	}
}

Game.prototype.halfScore = function() {
	if(this.scoreMultiplier > 1) {
		this.scoreMultiplier /= 2;
	}
}

Game.prototype.disableShield = function() {
	for(var i = 0; i<14; i++) {
		this.bricks.bricks[363 - i].type = BRICK_NONE;
	}	
}

Game.prototype.isFullShield = function() {
	for(var i = 0; i<14; i++) {
		if(this.bricks.bricks[363 - i].damage > 0) return false;
		else if(this.bricks.bricks[363 - i].type == BRICK_NONE) return false;
	}
	return true;
}

Game.prototype.enableShield = function() {
	//Enables game shield
	for(var i = 0; i<14; i++) {
		// this.bricks.shield[i].reset(i, 26, (BRICK_STONE * 0x10) -1, TOKEN_NONE);
		this.bricks.bricks[363 - i].reset(13-i, 25, (BRICK_STONE * 0x10) -1, TOKEN_NONE);
	}	
	this.bricks.redraw = true;
	console.log(this.bricks.bricks);
}
    
Game.prototype.applyEffect = function(effectIndex) {
	
	this.balls.setStatus(BALL_NORMAL);
	this.paddle.status = PADDLE_PLAYING;
	
	switch(effectIndex){
		case TOKEN_SUBDIVIDE:
			this.balls.subdivide();
			break;
			
		case TOKEN_DIVIDE:
			this.balls.divide();
			break;
			
		case TOKEN_SHOOT:
			this.shots.add(parseInt(this.paddle.position), parseInt(this.paddle.y), 
							-this.paddle.delta, -2.0, 
							parseInt((-this.paddle.delta) * 10), false);
			break;
			
		case TOKEN_MISSILE:
			this.shots.add(parseInt(this.paddle.position), parseInt(this.paddle.y), 
							-this.paddle.delta, -2.75, 
							parseInt((-this.paddle.delta) * 10), true);
			break;
			
		case TOKEN_EXPLOSIVE:
			this.balls.setStatus(BALL_EXPLOSIVE);
			break;
			
		case TOKEN_ONEUP:
			this.oneUp(1);
			break;
			
		case TOKEN_ONEDOWN:
			this.oneDown(1);
			break;
			
		case TOKEN_ULTRABALL:
			this.balls.setStatus(BALL_ULTRA);
			break;
			
		case TOKEN_STICKBALL:
			this.balls.setStatus(BALL_STICKY);
			this.paddle.status = PADDLE_STICKY;
			break;
		
		case TOKEN_COMMODIN:
			this.balls.setStatus(BALL_MAGIC);
			break;
		
		case TOKEN_SHIELD:
			this.enableShield();
			break;
			
		case TOKEN_HALFSCORE:
			this.halfScore();
			break;
			
		case TOKEN_DOUBLESCORE:
			this.doubleScore();
			break;
			
		default:
			break;
	}
	
	if(effectIndex == TOKEN_DELTASWAP){
		//this.paddle.setInverted(true);
	} else {
		//this.paddle.setInverted(false);
	}
			
}

Game.prototype.updateMap = function() {
	var x, y, i;
	var b;
	
	i=0;
	
	for(y = 0; y < 26; y++) { 
		for(x = 0; x < 14; x++) {
			b = this.bricks[i];
			if(!b)continue;
			if(b.type != BRICK_NONE) {
				// Put shadow
				this.map.set(x, y, 3, 0x91);
				
				if(b.damage > 8){
					this.bricks.hit(x*16, y*8);
					this.map.set(x, y, 1, 0x00); // Remove damage picture
				} else {
					// Set damage graphic
					this.map.set(x, y, 1, 0x91 + (b.damage*4));
				}
			} else {
				this.map.set(x, y, 3, 0x00);
				this.map.set(x, y, 1, 0x00); // Remove damage picture                    
			}
			
			this.map.set(x, y, 0, b.getGraph());
			
			i++;
		}
	}
}

Game.prototype.updatePaddle = function() {	
	      
}    
    

// /* GETTERS AND SETTERS */
Game.prototype.getTokenSystem = function() {
	return this.tokenSystem;
}

Game.prototype.getBigDisplay = function() {
	return this.bigDisplay;
}

Game.prototype.getInventory = function(){
	return this.inventory;
}

Game.prototype.getShots = function() {
	return this.shots;
}

Game.prototype.getHud = function() {
	return this.hud;
}

Game.prototype.setHud = function(hud){
	this.hud = hud;
}

Game.prototype.isGameOver = function() {
	return this.gameOver;
}

Game.prototype.setGameOver = function(gameOver) {
	this.gameOver = gameOver;
}

Game.prototype.getHiScore = function() {
	return this.hiScore;
}

Game.prototype.getScore = function() {
	return this.score;
}

Game.prototype.setScore = function(score) {
	this.score = score;
}

Game.prototype.getLives = function() {
	return this.lives;
}

Game.prototype.setLives = function(lives) {
	this.lives = lives;
}

Game.prototype.getGamemode = function() {
	return this.gamemode;
}

Game.prototype.getLevel = function() {
	return this.level;
}

Game.prototype.setLevel = function(level) {
	this.level = level;
}

Game.prototype.getPowerupType = function() {
	return this.powerupType;
}

Game.prototype.setPowerupType = function(powerupType) {
	this.powerupType = powerupType;
}

Game.prototype.getTimeScale = function() {
	return this.timeScale;
}

Game.prototype.setTimeScale = function(timeScale) {
	this.timeScale = timeScale;
	
	this.balls.timeScale = timeScale;
	this.shots.timeScale = timeScale;
	this.explosions.timeScale = timeScale;        
}

Game.prototype.getBulletTime = function() {
	return this.bulletTime;
}

Game.prototype.setBulletTime = function(bulletTime) {
	this.bulletTime = bulletTime;
}

Game.prototype.setBackdrop = function(backdrop) {
	this.backdrop = backdrop;
}

Game.prototype.getBackdrop = function() {
	return this.backdrop;
}

Game.prototype.setMusicplayer = function(musicplayer) {
	this.musicplayer = musicplayer;
}

Game.prototype.getSerialVersionUID = function() {
	return this.serialVersionUID;
}

Game.prototype.getTheBall = function() {
	return this.balls.theBall;
}

Game.prototype.bonusTime = function(){
	if(this.playTime > 600)this.playTime-=600;
	else this.playTime = 0;
	this.score += 5;
}

Game.prototype.getTime = function() {
	return this.time;
}

Game.prototype.getTokens = function() {
	return this.tokenSystem.getTokens();
}

Game.prototype.getBalls = function() {
	return this.balls;
}

Game.prototype.getExplosions = function() {
	return this.explosions;
}

Game.prototype.getScheduledExplosions = function() {
	return this.scheduledExplosions;
}

Game.prototype.addScheduledExplosions = function(){
	this.explosions.add(false, this.scheduledExplosions);
	
	this.scheduledExplosions = new ExplosionSystem(this);
}

Game.prototype.getParticles = function() {
	return this.particles;
}    

Game.prototype.randInt = function(min, max) {        
	return parseInt(Math.random() * (((max - min) + 1) + min));
}    

Game.prototype.setBricksLeft = function(bricksLeft) {
	if(bricksLeft == 0){
		//if(this.tokenSystem.tokens.length == 0){
			this.roundClear();
		//}
	}

	this.bricks.setBricksLeft(bricksLeft);
}

Game.prototype.getPlaytime = function() {
	return playTime;
}  

