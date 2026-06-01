function Keyboard(game){
	info('KEYBOARD', 'Initializing');
	
	this.self = this;
	this.game = game;
	this.keys = [];
	/*
	onkeydown = function(e){
		e = e || event;
		this.keys[e.keyCode] = true;
		e.preventDefault();
	}
	onkeyup = function(e){
		e = e || event;
		this.keys[e.keyCode] = false;
		e.preventDefault();
	}*/
	
	/* global switch keys are placed here, notice these won't keyrepeat */
}

Keyboard.prototype.dispatchKeyPresses = function(){
	for(i=0; i<256; i++){
		if(this.keys[i]){
			switch(i){
				case  68: thePlayer.right(); break;					
				case  65: thePlayer.left();  break;
				case  87: thePlayer.thrust();break;
				case  83: thePlayer.brake(); break;//skidmark
				case  32: break;
				default:  console.log("Unbinded: "+i); break;
			}
			//this.keys[i] = false;
		}
	}
}
