var COLOR_CYAN = 0;
var COLOR_DARKCYAN = 1;
var COLOR_BLUE = 2;
var COLOR_LYLA = 3;
var COLOR_DARKPINK = 4;
var COLOR_PINK = 5;
var COLOR_MAGENTA = 6;
var COLOR_RED = 7;
var COLOR_ORANGE = 8;
var COLOR_GOLDEN = 9;
var COLOR_LEMON = 10;
var COLOR_LIMA = 11;
var COLOR_GREEN = 12;
var COLOR_SKY = 13;
var COLOR_WHITE = 14;
var COLOR_GRAY = 15;
var COLOR_DARKGRAY = 16;

var COLORS = [ new Color(  0,252,248),
				new Color(  0,200,248),
				new Color(  0, 24,255),
				new Color(248,  0,200),
				new Color(128, 24,255),
				new Color(192,  0,248),
				new Color(255,  0,255),
				new Color(255, 0,  0),
				new Color(248,24,  0),
				new Color(248,196,  0),
				new Color(200,248,  0),
				new Color( 96,248,  0),
				new Color(  0,248,  0),
				new Color(  8,250,204),
				new Color(200,200,216),
				new Color(192,212,216),
				new Color(64,74,84)];
				
function Graphics(width, height){
	info('GRAPHICS', 'Initializing');
	
	this.MODE_NORMAL 			=  0;
	this.MODE_SOURCE_ATOP		=  1;
	this.MODE_SOURCE_IN			=  2;
	this.MODE_SOURCE_OUT		=  3;
	this.MODE_DESTINATION_ATOP	=  4;
	this.MODE_DESTINATION_OVER	=  5;
	this.MODE_DESTINATION_IN	=  6;
	this.MODE_DESTINATION_OUT	=  7;
	this.MODE_COPY				=  8;
	this.MODE_LIGHTER 			=  9;
	this.MODE_XOR	 			= 10;
	this.MODE_SCREEN 			= 11;
	this.MODE_ADD 				= 12;
	this.MODE_ALPHA_BLEND 		= 13;
	this.MODE_ALPHA_MAP 		= 7;//alias for dest-out
	this.MODE_COLOR_MULTIPLY 	= 14;
	this.MODE_DARKER		 	= 15;
	
	this.COLORS = COLORS;	
	
	this.DRAW_MODES =[	'source-over',
						'source-atop',
						'source-in',
						'source-out',
						'destination-atop',
						'destination-over',
						'destination-in',
						'destination-out',
						'copy',
						'lighter',						
						'xor',
						'screen',
						'add',
						'overlay',
						'multiply',
						'darker'];
	
	this.width = width;
	this.height = height;
	this.fullScreen = false;
	this.scale = 1.0;
	this.drawMode = this.MODE_NORMAL;
	
	this.lineWidth = 1;
	this.color = new Color(255,0,0);
	
	this.defaultContext = 0;
	
	this.context = [ 	document.getElementById('layer-1').getContext('2d'),
						document.getElementById('layer-2').getContext('2d'),
						document.getElementById('layer-3').getContext('2d'),
						document.getElementById('layer-4').getContext('2d'),
						document.getElementById('layer-5').getContext('2d')];
						
	this.lastContext = this.defaultContext;
}

Graphics.prototype.setAlpha = function(newAlpha){
	this.context[this.defaultContext].globalAlpha = newAlpha;
}

Graphics.prototype.setContext = function(newContext){
	this.lastContext = this.defaultContext;	
	this.defaultContext = newContext;
}

Graphics.prototype.drawGradientLine = function(cx, cy, c, dx, dy, d){
	
	var grd =this.context[this.defaultContext].createLinearGradient(0,0,0,this.height);
	grd.addColorStop(0, c);
	grd.addColorStop(1, d);

	this.context[this.defaultContext].fillStyle=grd;
	this.context[this.defaultContext].fillRect(cx,cy,dx,dy);
}

Graphics.prototype.copy = function(image, x, y, index){
	//if(image)return;
	this.context[index].drawImage(image, x, y);
}

Graphics.prototype.rotate = function(xCenter, yCenter, angle){
	/*this.context[this.defaultContext].translate(xCenter, yCenter);
	this.context[this.defaultContext].rotate(angle);	*/
}	

var fastBlur = 0;	
Graphics.prototype.motionblur = function(){	
	var imageData = (this.context[this.defaultContext]).getImageData(0,0,230,this.height);
	for(var i=fastBlur; i < imageData.data.length; i+=4){
		imageData.data[i] = imageData.data[i] * 0.8;		
	}
	this.context[this.defaultContext].putImageData(imageData, 0,0);   
	fastBlur++;
	fastBlur %= 4;
}

Graphics.prototype.clear = function(i){
	
	if(i==undefined) i= this.defaultContext;
	
	this.context[i].clearRect(0, 0, this.width, this.height);
}

Graphics.prototype.fillRect = function(x, y, dx, dy){
	this.context[this.defaultContext].strokeWidth = this.lineWidth;
	this.context[this.defaultContext].strokeStyle = this.color.getHex(1);
	this.context[this.defaultContext].fillStyle = this.color.getHex(1);
	this.context[this.defaultContext].fillRect(x,y,dx,dy)
}

Graphics.prototype.setLineWidth = function(lineWidth){
	this.lineWidth = lineWidth;
}

Graphics.prototype.setColor = function(color){
	this.color = color;
}


Graphics.prototype.setDrawMode = function(mode){
	this.context[this.defaultContext].globalCompositeOperation = this.DRAW_MODES[mode];	
}
