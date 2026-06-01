var ACTION_DEBUG_GROW = false;
var ACTION_DEBUG_SHRINK = false;
var ACTION_DEBUG_MULTIPLY = false;
var ACTION_DEBUG_TEST_INVENTORY = false;
var ACTION_DEBUG_ERASE_SONG = false;
var ACTION_DEBUG_NEXT_SONG = false;
var ACTION_DEBUG_HIGLIGHT_BALL = false;
var ACTION_DEBUG_ABORT = false;
var ACTION_DEBUG_FULLSCREEN = false;
var ACTION_DEBUG_TIMESCALE_DOUBLE = false;
var ACTION_BALLTIME = false;
var ACTION_TILT_UP = false;
var ACTION_TILT_DOWN = false;
var ACTION_TILT_LEFT = false;
var ACTION_TILT_RIGHT = false;
var ACTION_FORCE_TILT = false;
var ACTION_ACTIVATE = false;
var ACTION_NEXT_POWERUP = false;
var ACTION_PREV_POWERUP = false;
var ACTION_MOVE_LEFT = false;
var ACTION_MOVE_RIGHT = false;
var ACTION_MOVE_UP = false;
var ACTION_MOVE_DOWN = false;
var ACTION_CANCEL = false;
var ACTION_PAUSE = false;

function main(){
	info('TrickyNoid', 'Initializing');
	
	game = new TrickyNoid(320, 240);
}

function TrickyNoid(w, h){
	this.me = this;
	
	this.nextPowerup = [ TOKEN_SHRINK, 
                        TOKEN_SUBDIVIDE,                                         
                        TOKEN_SHOOT,
                        TOKEN_MISSILE,
                        TOKEN_EXPLOSIVE,
                        TOKEN_ULTRABALL,
                        TOKEN_STICKBALL,
                        TOKEN_SHIELD,
                        TOKEN_COMMODIN,
                        TOKEN_GROW ];
    
	this.prevPowerup = [ TOKEN_COMMODIN,
                        TOKEN_GROW,     //shrink
                        TOKEN_SHRINK,   //sub
                        TOKEN_SUBDIVIDE,//shot                                         
                        TOKEN_SHOOT,    //missile
                        TOKEN_MISSILE,  //explosive
                        TOKEN_EXPLOSIVE,//ultra 
                        TOKEN_ULTRABALL,//stick
                        TOKEN_STICKBALL,//shield
                        TOKEN_SHIELD];  //commo
    
    BrickProperties = new BrickPropertySet();
	BrickProperties.initialize();
	
	this.graphics = new Graphics(w, h);
	this.loadGraphics();
	this.game = new Game(w, h, true, 1, this.graphics);	
}

TrickyNoid.prototype.start = function(){
	cout('^7----------------------- SYNC -------------------------');
	clearInterval(update);
	this.game.New();
}

var PendingBitmaps = 0;
var LoadedBitmaps = 0;

TrickyNoid.prototype.continueLoad = function(){
	
	if(PendingBitmaps > LoadedBitmaps) {
		clearInterval(update);
		return;
	} else {
		if(PendingBitmaps > 0){
			game.start();
		}
	}
	PendingBitmaps = 0;
	LoadedBitmaps = 0;
	cout('^7----------------------- ASYNC ------------------------');
	
	try {
		setTimeout(update, 15);
		info('TrickyNoid', 'Installed update callback');
	} catch (e){
		complaint('TrickyNoid', 'EXCEPTION RAISED', e);
	}
}

TrickyNoid.prototype.render = function(){
	this.game.render();
}

var timeoutLimit = 20;

TrickyNoid.prototype.update = function(delta){
	// Create temporal alias
	var paddle = this.game.paddle;
	var balls = this.game.balls;
	var theBall = this.game.balls.theBall;
	var timescale = this.game.timeScale;

	
	// Poll input devices
	if(!this.game.demo.playback){
		this.resetInput();   //Clear status vars
		this.game.input.update();
		this.readKeyboard();
	}
			
	// HANDLE DEBUGGING COMMAND KEYS
	if( ACTION_DEBUG_ABORT			) { this.game.setMode(this.game.MODE_EXIT); } else 
	if( ACTION_DEBUG_MULTIPLY		) { balls.subdivide(); } else 
	
	// Handle Debugging keys for Music player
	if( ACTION_DEBUG_NEXT_SONG		) {	this.game.musicplayer.nextTrack(); this.game.backdrop.setSpeed(this.game.musicplayer.getTempo()); } else 
	if( ACTION_DEBUG_ERASE_SONG	) { this.game.musicplayer.deleteSong(); } 

	// Update common elements

	// Update musicplayer
	this.game.musicplayer.update(delta);
	
	// TODO: see if this can be moved to game class!
	this.game.backdrop.update(delta, this.game.musicplayer, timescale);
	
	TokenGfx[this.game.powerupType].update(parseInt(delta * timescale));
	
	// Update elements depending on which mode the game is
	if(this.game.demo.playback) this.game.demo.play(); else
	if(this.game.demo.record) this.game.demo.snapshot();
			
	switch(this.game.mode){
		case this.game.MODE_EXIT:
			//TODO: Redirect to other web? 			
			break;
		
		case this.game.MODE_GAME_ARCADE:
		case this.game.MODE_GAME_TIMEATTACK:
		case this.game.MODE_GAME_PUZZLE:
		case this.game.MODE_GAME_VERSUS:
			if(ACTION_CANCEL) {
				this.game.setMode(this.game.MODE_MENU);
				this.game.menu.setStatus(this.game.menu.MENU_STATUS_GROW);
			} 
			
			// Mode Paddle, brake it if not moving
			if(ACTION_MOVE_LEFT) this.game.moveLeft();
			else if(ACTION_MOVE_RIGHT) this.game.moveRight();
			else if(!ACTION_MOVE_LEFT) this.game.brake();

			// Handle powerup navigation keys
			var pow;
			if(ACTION_NEXT_POWERUP) {
				pow = this.game.inventory.getNextPowerup(this.nextPowerup, this.game.powerupType, false);
				if(pow > this.nextPowerup.length-1) pow = this.nextPowerup[this.nextPowerup.length-1];
				this.game.setPowerupType(pow);
				if(!this.game.inventory.isEmpty(pow)) this.game.paddle.tokenChange = 0.75;
				ACTION_NEXT_POWERUP=false;
			} else if(ACTION_PREV_POWERUP) {
				pow = this.game.inventory.getNextPowerup(this.prevPowerup, this.game.powerupType, true);
				if(pow < 0)pow = this.prevPowerup[0];
				this.game.setPowerupType(pow);
				if(!this.game.inventory.isEmpty(pow)) this.game.paddle.tokenChange = 0.75;
				ACTION_PREV_POWERUP=false;
			}
			
			if(ACTION_DEBUG_TEST_INVENTORY) {
				this.game.inventory.test();
				ACTION_DEBUG_TEST_INVENTORY = false;
			}
			
			// Handle timescale
			if(ACTION_DEBUG_TIMESCALE_DOUBLE) {
				this.game.setTimeScale(2.0);
			} else {
				// Handle bullet time
				if((ACTION_BALLTIME) && ( this.game.bulletTime > 0.0000)) {
					this.game.setTimeScale(0.125);
					this.game.setBulletTime( this.game.bulletTime -0.0025);

					if(ACTION_FORCE_TILT){
						if(ACTION_TILT_LEFT ) {	balls.alter( -.1, 0);} else 
						if(ACTION_TILT_RIGHT) {	balls.alter( .1, 0);	}
						if(ACTION_TILT_UP   ) {	balls.alter(0, -.1);	} else
						if(ACTION_TILT_DOWN ) {	balls.alter(0, .1);  }
						ACTION_FORCE_TILT = false;
						ACTION_BALLTIME = false;
					} else if(this.game.bulletTime > 0.02) {
						var v = this.game.bulletTime;
						
						if(ACTION_TILT_LEFT ) {	balls.alter( -.1, 0);} else 
						if(ACTION_TILT_RIGHT) {	balls.alter( .1, 0);	}
						if(ACTION_TILT_UP   ) {	balls.alter(0, -.1);	} else
						if(ACTION_TILT_DOWN ) {	balls.alter(0, .1);  }
					}

				} else {                 
					this.game.setTimeScale(1.0);

					// Regenerate bullet Time
					
					if(this.game.bulletTime < 1.000) this.game.bulletTime += 0.0012;
					else this.game.bulletTime = 1.0000;

					//this.game.setBulletTime(bulletTime);
				}
			}
			
			// Handle action button
			this.game.paddle.update(1);
				
			this.game.update(delta);			 
			break;
			
		case this.game.MODE_CURTAIN_ROUNDCLEAR:
		case this.game.MODE_CURTAIN_ENTERLEVEL:
		case this.game.MODE_CURTAIN_GAMEOVER:
		case this.game.MODE_CURTAIN_BONUSCOINS:
			this.game.particles.update(delta);
			
			
			if(this.game.bigDisplay.isActive()) {
				
				switch(this.game.mode){
					case this.game.MODE_CURTAIN_ROUNDCLEAR:
						if(this.game.demo.record)this.game.demo.toggleRecord();
						if(this.game.timeout < timeoutLimit){ 
							this.game.timeout += 1; break;
						} else {
							this.game.timeout = 0;
							this.game.bigDisplay.dispose();
							this.game.setMode(this.game.MODE_CURTAIN_BONUSCOINS);
							this.game.bigDisplay.setText("TIMER", "BONUS");
						}
						break;
					
					case this.game.MODE_CURTAIN_BONUSCOINS:
						
						if(this.game.playTime > 0){
							this.game.bonusTime();
							break;
						}
						
						if(this.game.timeout < timeoutLimit){ 
							this.game.timeout += 1; break;
						} else {
							this.game.timeout = 0;						
							this.game.bigDisplay.dispose();
							this.game.nextMap();
							this.game.setMode(this.game.MODE_CURTAIN_ENTERLEVEL);//sets status and timeout back to 0
							this.game.bigDisplay.setText("LEVEL", ("00000"+(this.game.level+1).toString(10)).substr(-5));
						}
						break;
						
					case this.game.MODE_CURTAIN_ENTERLEVEL:
						
						if(this.game.timeout < timeoutLimit){ 
							this.game.timeout += 1; break;
						} else {
							//this.game.curtain.action();
							this.game.bigDisplay.dispose();
							this.game.bigDisplay.setText("ROUND", "CLEAR");
							this.game.curtain.reset();
							this.game.curtain.action();
							this.game.setMode(this.game.gamemode);//sets status and timeout back to 0
						}
						break;
				}
				
				if(ACTION_ACTIVATE) { this.game.bigDisplay.dispose();}
				
			} 
							
			this.game.curtain.update(1);
			this.game.bigDisplay.update(1);                
			break;
			
		case this.game.MODE_MENU:
			var menu = this.game.menu;
			
			if(ACTION_CANCEL) {
				if(menu.back() == menu){
					// Root menu level, shrink!
					menu.setStatus(menu.MENU_STATUS_SHRINK);
				}                    
			} 
			
			menu.update(1);
			
			if(menu.isCollapsed()) {                        
				menu.setStatus(menu.MENU_STATUS_CLOSED);
				this.game.setMode(this.game.gamemode);       //Return to game
			}
			break;
	}

	if(!this.game.demo.playback){
		ACTION_ACTIVATE = false;
		ACTION_CANCEL = false;
	}

	this.game.hud.update();

	if(this.game.gameOver){
		// Restart game 
		this.game.level = 0;		
		this.start();
		this.game.musicplayer.play();
	}
}

TrickyNoid.prototype.resetInput = function(){ 
	ACTION_DEBUG_GROW = false;
	ACTION_DEBUG_SHRINK = false;
	ACTION_DEBUG_HIGLIGHT_BALL = false;
	ACTION_DEBUG_MULTIPLY = false;
	ACTION_DEBUG_ERASE_SONG = false;
	ACTION_DEBUG_ABORT = false;
	ACTION_DEBUG_FULLSCREEN = false;
	ACTION_DEBUG_NEXT_SONG = false;
	ACTION_DEBUG_TIMESCALE_DOUBLE = false;
	ACTION_CANCEL = false;
	ACTION_PAUSE = false;        
}

TrickyNoid.prototype.readKeyboard = function(){
	if(this.game.demo.playback)return;
	var input = this.game.input;
	/* WORKING */
	
	if(input.keyPress[input.KEY_H] ) ACTION_DEBUG_HIGLIGHT_BALL = true;
	
	// Handle movement
	if(input.keyPress[input.KEY_A]) this.game.moveLeft();	else 
	if(input.keyPress[input.KEY_D]) this.game.moveRight();
	
	if(input.keyDown[input.KEY_Q]) ACTION_PREV_POWERUP = true;
	if(input.keyDown[input.KEY_E]) ACTION_NEXT_POWERUP = true;
	
	if(input.keyDown[input.KEY_1]		) this.game.setMode(this.game.MODE_GAME_ARCADE);		else 
	if(input.keyDown[input.KEY_2]		) this.game.setMode(this.game.MODE_GAME_TIMEATTACK); 	else 
	if(input.keyDown[input.KEY_3]		) this.game.setMode(this.game.MODE_GAME_PUZZLE); 		else 
	if(input.keyDown[input.KEY_4]		) this.game.setMode(this.game.MODE_GAME_VERSUS); 		else
	if(input.keyDown[input.KEY_5]		) this.game.roundClear(); else
	if(input.keyDown[input.KEY_G]		) this.game.setMode(this.game.MODE_CURTAIN_GAMEOVER);	else 
	if(input.keyDown[input.KEY_M]		) this.game.setMode(this.game.MODE_MENU);				else 
	if(input.keyDown[input.KEY_END]		) ACTION_DEBUG_ABORT = true;
	
	if(input.keyDown[input.KEY_F1] 		) ACTION_DEBUG_SHRINK 			= true;
	if(input.keyDown[input.KEY_F2] 		) ACTION_DEBUG_GROW   			= true;
	if(input.keyDown[input.KEY_ADD]		) ACTION_DEBUG_TIMESCALE_DOUBLE = true;
	if(input.keyDown[input.KEY_F4]  	) ACTION_DEBUG_MULTIPLY   		= true;
	if(input.keyDown[input.KEY_F11] 	) ACTION_DEBUG_FULLSCREEN 		= true;
	if(input.keyDown[input.KEY_N]    	) ACTION_DEBUG_NEXT_SONG  		= true;
	if(input.keyDown[input.KEY_DELETE]	) ACTION_DEBUG_ERASE_SONG 		= true;


	if(input.keyDown[input.KEY_P]) {
		if(!this.game.demo.record) {
			if(this.game.demo.togglePlayback()){
				this.game.input.uninstall();
				this.start();
			} 
		}
		return;
	}
	
	if(input.keyDown[input.KEY_X]) {		
		this.game.demo.playStored();
	}
	
	if(input.keyDown[input.KEY_L]) {		
		if(!this.game.demo.record){
			this.game.demo.store();
		}			
	}
	
	if(input.keyDown[input.KEY_R]) {
		if(!this.game.demo.playback) {
			if(!this.game.demo.toggleRecord()) cout('^5Stopped recording demo');
			else cout('^5Started recording demo');
		}		
	}
	if(input.keyDown[input.KEY_K]) this.game.applyEffect(TOKEN_ONEDOWN);
	if(input.keyDown[input.KEY_C]) ACTION_DEBUG_TEST_INVENTORY = true;
	
	if(input.keyDown[input.KEY_RIGHT]){	ACTION_BALLTIME 	= true; 
										ACTION_FORCE_TILT 	= true; 
										ACTION_TILT_RIGHT 	= true; } else
	if(input.keyDown[input.KEY_LEFT] ){	ACTION_BALLTIME 	= true; 
										ACTION_FORCE_TILT 	= true; 
										ACTION_TILT_LEFT  	= true; }	
	if(input.keyDown[input.KEY_DOWN] ){	ACTION_BALLTIME 	= true; 
										ACTION_FORCE_TILT 	= true; 
										ACTION_TILT_DOWN 	= true; } else
	if(input.keyDown[input.KEY_UP]   ){	ACTION_BALLTIME 	= true; 
										ACTION_FORCE_TILT 	= true; 
										ACTION_TILT_UP   	= true; }
	
	if(input.keyDown[input.KEY_SPACE] ) ACTION_ACTIVATE = true;
	if(input.keyDown[input.KEY_ESCAPE]) ACTION_CANCEL   = true;
}

TrickyNoid.prototype.loadGraphics = function(){
	new Menu().loadGraphics();
	new Curtain().loadGraphics();
	new BrickSystem().loadGraphics();
	new Backdrop(140).loadGraphics();
	new BallSystem().loadGraphics();
	new Paddle().loadGraphics();
	new ExplosionSystem().loadGraphics();
	new TokenSystem().loadGraphics();
	new ParticleSystem().loadGraphics();
	new ProjectileSystem().loadGraphics();
	new BigDisplay().loadGraphics();
	
	for(var i=0; i<FONT_FILES.length; i++){
		new Display(0,0,0,0,i).loadGraphics();
	}
}
