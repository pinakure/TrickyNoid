/* MENU ENUMERATIONS */
var MENU_MAIN = 0;
var MENU_GAME = 10;
var CMD_ARCADE = 11;
var CMD_TIMEATTACK = 12;
var CMD_VERSUS = 13;
var CMD_PUZZLE = 14;
var MENU_OPTIONS = 20;
var MENU_OPTIONS_VIDEO = 30;
var MENU_OPTIONS_CONTROL = 40;
var MENU_OPTIONS_AUDIO = 50;
var MENU_PROFILE = 60;
var MENU_PROFILE_ACHIEVEMENTS = 70;
var MENU_PROFILE_EDIT = 80;
var MENU_PROFILE_PROGRESS = 90;
var MENU_PROFILE_GHOSTRESET = 100;
var CMD_PROFILE_GHOSTRESET_YES = 101;
var CMD_PROFILE_GHOSTRESET_NO = 102;
var CMD_QUIT = 999;

var MENU_STATUS_CLOSED = 0;
var MENU_STATUS_GROW = 1;
var MENU_STATUS_OPEN = 2;
var MENU_STATUS_SHRINK = 3;

var MenuGfx = false;

function Menu(game, id){
	this.self = this;
	
    this.commands = [];
    this.menus = [];
    this.back = false;
    
    this.width = 0;
    this.height = 0;
    this.finalWidth = 162;
    this.finalHeight = 122;
    
	this.status = MENU_STATUS_CLOSED;
    this.status;
    this.id = id;
	this.game = game;
	
	this.spriteSheet = false;
}

Menu.prototype.processGraphics = function(me){
	info("MENU", "Received Background Image");
	game.continueLoad();
}

Menu.prototype.loadGraphics = function(){
	info("MENU", "Requesting Background Image");
	
	try {
		MenuGfx = new Bitmap("gfx/hud/mapinfo.png", 1, this.finalWidth, this.finalHeight, this.processGraphics, this);
	} catch(e) {
		cout("MENU > Failed to load graphics : "+e.message);
		MenuGfx = false;
	}
}

Menu.prototype.isCollapsed = function(){
	return ((this.width == 0)&&(this.height == 0));        
}
    
Menu.prototype.back = function() {
	if(this.back != false)return this.back;
	return this;
}

Menu.prototype.openDegree = function(){
	var finalTotal = finalWidth + finalHeight;
	var total = this.width + this.height;
	return total / finalTotal;
}

Menu.prototype.update = function(Delta){
	switch(this.status){
		
		case MENU_STATUS_OPEN:
			if(ACTION_CANCEL) this.status = MENU_STATUS_SHRINK;
			break;    
			
		case MENU_STATUS_GROW:
			if(this.width < this.finalWidth) this.width += Delta/2.0;
			else this.width = this.finalWidth;
			if(this.height < this.finalHeight) this.height += Delta/2.0;
			else this.height = this.finalHeight;

			if(( this.height == this.finalHeight) && ( this.width == this.finalWidth)) this.status = MENU_STATUS_OPEN;
			break;
			
		case MENU_STATUS_SHRINK:
			if(this.width > 0.0) this.width -= Delta / 2.0;
				else this.width = 0.0;
			if(this.height > 0.0) this.height -= Delta / 2.0;
				else this.height = 0.0;

			if(( this.height==0) && ( this.width==0)) this.status = MENU_STATUS_CLOSED;
			break;
	}
}


Menu.prototype.render = function(g){
	// Display menu backdrop
	var x, y;
	var fade = parseInt(8 * this.openDegree() );
	//Preprocess background
	g.setDrawMode(g.MODE_ADD);
	for(y=0; y<240; y+=2) {
		for(x=0; x<320; x+=2) {                
			g.drawGradientLine(x, 
							   y, 
							   new Color(Math.sin(x/320)*8,Math.sin(x/320)*8,Math.sin(x/320) * 8), 
							   (160+(Math.random()*10)), 
							   (120+(Math.random()*10)), 
							   new Color(fade, fade, fade));
		}
	}
	g.setDrawMode(g.MODE_COLOR_MULTIPLY);
	
	x = parseInt(160 - (this.width/2));
	y = parseInt(120 - (this.height/2));
	
	MenuGfx.draw(x, y, this.width, this.height);
	g.setDrawMode(g.MODE_ADD);
	MenuGfx.draw(x, y, this.width, this.height);
	
	var hud = this.game.hud;
	
	// Show entries
	
	g.setDrawMode(g.MODE_NORMAL);
	if(this.status == MENU_STATUS_OPEN) hud.getMap().render(-1, 0, 4);
	
	// Clean menu area
	for(y=8; y<22;y++){
		for(x=17; x<47;x++){
			hud.getMap().setTileId(x, y, 4, hud.FONT_WHITE-0x20);
		}
	}
		
	var i,m;
	for(i=0; i<this.menus.length; i++){
		m = this.menus[i];
		hud.getMap().setTileId(0,0, 1, 0x64);
		hud.getMap().setTileId(0,0, 1, 0x64);
		hud.getMap().setTileId(0,0, 1, 0x64);
		hud.getMap().setTileId(0,0, 1, 0x64);
	}
	for(i=0; i<this.commands.length; i++){
		m = this.commands[i];
	}
}

Menu.prototype.getStatus = function() {
	return this.status;
}

Menu.prototype.setStatus= function(status) {
	this.status = status;
}
