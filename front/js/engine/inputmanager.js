/*---------------------------------------------------*/
/* VOLATILE */
/*---------------------------------------------------*/
var mouseX = 110;
var mouseY = 120;
function pollMouse(e) { 
	mouseX += e.movementX || e.mozMovementX || 0;
	mouseY += e.movementY || e.mozMovementY || 0;
	return 0;
}
/*---------------------------------------------------*/

var MAX_BUTTONS = 8;

function InputManager(game){
	this.self = this;
	this.game = game;    
	info('INPUTMANAGER', 'Initializing');	
	
	/* KEY CONSTANTS */
	this.KEY_0 = 48;
	this.KEY_1 = 49;
	this.KEY_2 = 50;
	this.KEY_3 = 51;
	this.KEY_4 = 52;
	this.KEY_5 = 53;
	this.KEY_6 = 54;
	this.KEY_7 = 55;
	this.KEY_8 = 56;
	this.KEY_9 = 57;
	
	this.KEY_A = 65;
	this.KEY_B = 66;
	this.KEY_C = 67;
	this.KEY_D = 68;
	this.KEY_E = 69;
	this.KEY_F = 70;
	this.KEY_G = 71;
	this.KEY_H = 72;
	this.KEY_I = 73;
	this.KEY_J = 74;
	this.KEY_K = 75;
	this.KEY_L = 76;
	this.KEY_M = 77;
	this.KEY_N = 78;
	this.KEY_O = 79;
	this.KEY_P = 80;
	this.KEY_Q = 81;
	this.KEY_R = 82;
	this.KEY_S = 83;
	this.KEY_T = 84;
	this.KEY_U = 85;
	this.KEY_V = 86;
	this.KEY_W = 87;
	this.KEY_X = 88;
	this.KEY_Y = 89;
	this.KEY_Z = 90;
	this.KEY_SPACE = 32;
	this.KEY_ESC = 27;
	this.KEY_UP = 38;
	this.KEY_ENTER = 13;
	this.KEY_DOWN = 40;
	this.KEY_LEFT = 37;
	this.KEY_RIGHT = 39;
	this.KEY_DELETE = 46;
	this.KEY_F1 = 112;/*Forbidden*/
	this.KEY_F2 = 113;
	this.KEY_F3 = 114;/*Forbidden*/
	this.KEY_F4 = 115;
	this.KEY_F5 = 116;/*Forbidden*/
	this.KEY_F6 = 117;
	this.KEY_F7 = 118;
	this.KEY_F8 = 119;
	this.KEY_F9 = 120;
	this.KEY_F10 =121;/*Forbidden (raises menu)*/
	this.KEY_F11 =122;/*Forbidden (goes fullscreen) */
	this.KEY_F12 =123;/*Forbidden*/
	this.KEY_ADD = 107;

	/* CLASS PROPERTIES */
	
	this.keys = [];
	this.keyUp = [];	
	this.keyDown = [];
	this.keyPress = [];
	
	this.buttons = [];
	this.buttonUp = [];
	this.buttonDown = [];
	this.buttonPress = [];

	this.dragging = 0;
	this.sensitivity = 0.05;	
	
    this.axisX = 0.0;
	this.axisY = 0.0;
    this.axisOldX = 0.0;
	this.axisOldY = 0.0;
    this.deltaX = 0.0;
    this.deltaY = 0.0;
	this.scaleX = 1.3;
	this.scaleY = 1.5;
    
	/* INITIALIZATION */
	
	this.snap = new Snapshot(	'in___',
								[this.deltaX, this.deltaY],
								[],
								[this.dragging]);
	this.reset();
	this.install(this);

}

InputManager.prototype.snapshot= function() {
	return this.snap.update(	[this.deltaX, this.deltaY],
								[],
								[this.dragging]);
}

InputManager.prototype.reset = function() {
	var i;	
	for(i=0; i<MAX_BUTTONS; i++){
		this.buttons[i] = 0;
		this.buttonUp[i] = 0;		
		this.buttonDown[i] = 0;
		this.buttonPress[i] = 0;
	}
	
	for(i=0; i<256; i++){
		this.keys[i] = 0;
		this.keyUp[i] = 0;
		this.keyDown[i] = 0;
		this.keyPress[i] = 0;
	}
	this.snapshot();
}

InputManager.prototype.playback = function(s) {
	if(!s)return;
	
	this.axisOldX 		= this.axisX;
	this.axisOldY 		= this.axisY;
	this.deltaX 		= s.f[0];
	this.deltaY 		= s.f[1];
	
	this.dragging 		= s.b[0];
}

InputManager.prototype.uninstall = function() {
	info('INPUTMANAGER', 'Disable input from mouse and keyboard');
	input = this.self;
	$('body')
		.mousewheel(function(e){ return false; })
		.mouseup(	function(e){ return false; })
		.mousedown(	function(e){ return false; })
		.keyup(		function(k){ return false; })
		.keydown(	function(k){ input.game.demo.playback = false; input.install(input);  });
	document.getElementsByTagName('body')[0].removeEventListener('mousemove', pollMouse);
}

InputManager.prototype.lock = function() { 
	if(document.getElementsByTagName('body')[0].requestPointerLock){ document.getElementsByTagName('body')[0].requestPointerLock();};
	var grabber = document.getElementsByTagName('body')[0];
	grabber.requestPointerLock = grabber.requestPointerLock || grabber.mozRequestPointerLock || grabber.webkitRequestPointerLock;
	grabber.requestPointerLock();
}
	

InputManager.prototype.install = function(input) { 
	info('INPUTMANAGER', 'Enable input from mouse and keyboard');
	input.lock();	
	
	$('body')
		.mousewheel(function(e){ if(Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) > 0) ACTION_NEXT_POWERUP = true; else ACTION_PREV_POWERUP = true; return false})
		.mouseup(	function(e){ input.buttons[e.button] = 0; return false;})
		.mousedown(	function(e){ input.buttons[e.button] = 1; input.lock(); return false;})
		.keydown(	function(k){ input.keys[k.which || k.keyCode] = 1; return 0; })
		.keyup(		function(k){ input.keys[k.which || k.keyCode] = 0; return 0});
	document.getElementsByTagName('body')[0].addEventListener('mousemove', pollMouse);
}
	
InputManager.prototype.move = function(){
	var x = (this.axisX - this.axisOldX) * 2;
	this.deltaX = x * this.sensitivity;	
}

InputManager.prototype.drag = function() { //oldx, oldy, newx, newy) {
	if(ACTION_BALLTIME){
		if(this.axisX > this.axisOldX) ACTION_TILT_RIGHT	= 1; else 
		if(this.axisX < this.axisOldX) ACTION_TILT_LEFT 	= 1;	
		if(this.axisY > this.axisOldY) ACTION_TILT_DOWN 	= 1; else 
		if(this.axisY < this.axisOldY) ACTION_TILT_UP 		= 1;
	}
}

InputManager.prototype.press = function(button){
	switch(button){
		case 0:	break;
		case 1:	break;
		case 2:	if(this.game.paddle.status != PADDLE_READY) ACTION_BALLTIME = 1; break;
	}
}

InputManager.prototype.up = function(button){
	switch(button){
		case 0: ACTION_ACTIVATE = 0; break;
		case 1:	break;
		case 2:	ACTION_BALLTIME = 0;
				ACTION_TILT_LEFT = 0;
				ACTION_TILT_RIGHT = 0;
				ACTION_TILT_UP = 0;
				ACTION_TILT_DOWN = 0;
				break;
	}
}

InputManager.prototype.down = function(button){
	switch(button){
		case 0:	ACTION_ACTIVATE = 1;	break;
		case 1:	break;
		case 2:	break;
	}	
}

InputManager.prototype.update = function(){
	var i;
	/* Update keyboard */ 
	
	for(i=0; i<256; i++){
		if(this.keys[i]){
			this.keyUp[i] = 0;
			if(!this.keyPress[i]) this.keyDown[i] = 1;
			else this.keyDown[i] = 0;
			this.keyPress[i] = 1;
		} else {
			this.keyDown[i] = 0;
			if(this.keyPress[i]) this.keyUp[i] = 1;
			else this.keyUp[i] = 0;
			this.keyPress[i] = 0;
		}
	}

	/* Update mouse */
	
	// Careful with these on demo play!
	if(!this.game.demo.playback){
		this.axisOldX = this.axisX;
		this.axisOldY = this.axisY;
		this.axisX = mouseX;
		this.axisY = mouseY;
	}
	
	this.dragging = 0;
	
	for(i=0; i<MAX_BUTTONS; i++){
		if(this.buttons[i]){
			this.buttonUp[i] = 0;
			if(!this.buttonPress[i]) this.buttonDown[i] = 1;
			else this.buttonDown[i] = 0;
			this.buttonPress[i] = 1;
		} else {
			this.buttonDown[i] = 0;
			if(this.buttonPress[i]) this.buttonUp[i] = 1;
			else this.buttonUp[i] = 0;
			this.buttonPress[i] = 0;
		}
		
		if(this.buttonDown[i]) {
			this.down(i);
		} else
		if(this.buttonUp[i]){
			this.up(i);			
		} else
		if(this.buttonPress[i]){
			this.dragging = 1;
			this.press(i);			
		} 
	}
	
	this.move();
	if(this.dragging)this.drag();
	
					
	this.game.paddle.setDelta( -this.deltaX);
	//this.game.paddle.update();
	this.deltaX = 0;
}
