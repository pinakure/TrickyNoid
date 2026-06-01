var Bitmaps = [];

function Bitmap(source, trans, width, height, doneCallback, doneCallbackTarget){
	var i=0;
	
	this.id = this.generateId();
	this.source = 'data/' + source;
	this.trans = trans;
	this.width = width;
	this.doneCallback = doneCallback;
	this.doneCallbackTarget = doneCallbackTarget;
	this.height = height;
	this.data = 0;/*will hold rgba array*/	
	this.image = 0;/*will hold pointer to img element*/	
	this.isloaded = false;
	
	this.gl = false;
	
	for(i=0; i<Bitmaps.length; i++){
		if(Bitmaps[i].source == source){
			this.id = Bitmaps[i].id;
			this.source = Bitmaps[i].source;
			this.trans = Bitmaps[i].trans;
			this.width = Bitmaps[i].width;
			this.height = Bitmaps[i].height;
			this.doneCallback = Bitmaps[i].doneCallback;
			this.doneCallbackTarget = Bitmaps[i].doneCallbackTarget;
			this.height = Bitmaps[i].height;
			this.data = Bitmaps[i].data;
			this.image = Bitmaps[i].image;
			this.isLoaded = Bitmaps[i].isLoaded;
			
			if(this.doneCallback) this.doneCallback(this.doneCallbackTarget);
			if(game)game.continueLoad();
			return;
		}
	}
	
	this.load();
}


Bitmap.prototype.generateId = function() {
	// Create unique identifier
	var id = "";
	do{
		id = 'image-' + parseInt(Math.random()*65535);
	} while($('#'+id) == undefined);
	return id;
}


Bitmap.prototype.fastblit = function(layer, x,y,dx,dy) {
	game.graphics.context[layer].drawImage(this.image, x, y, this.width, this.height, dx, dy, this.width, this.height);
}

Bitmap.prototype.blit = function(layer, x,y,dx,dy,w,h) {
	game.graphics.context[layer].drawImage(this.image, x, y, w, h, dx, dy, w, h);
}
	
Bitmap.prototype.load = function() {
	var me = this;	
	
	cout('^7"' + me.source+'"');
	
	var bitmapData = '';
	var xhr = new XMLHttpRequest(), blob;	
	/* Create temporal image dom node to hold data */
	$('#resources').append('<img title="'+me.source+'" id="'+me.id+'" class="bitmap" >');
	
	PendingBitmaps++;
	
    xhr.responseType = 'arraybuffer';
    xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
			me.data = new Uint8Array(xhr.response),
            blob = new Blob([me.data], {'type': 'image\/jpeg'}),
			
			me.image = document.getElementById(me.id);
			
			me.image.src = window.URL.createObjectURL(blob);;
			
			$('#resources').append(me.image);
			
			me.image.onload = function() {
				/* Get image data from image node, suitable to be mannipulated by a canvas object */
				var image = document.getElementById(me.id);
				
				var vout = game.graphics.context[0];
				game.graphics.clear(0);
				
				game.graphics.copy(image, 0, 0, 0);
				
				me.width = $('#'+me.id).width();
				me.height = $('#'+me.id).height();
				
				me.data = vout.getImageData(0,0, me.width, me.height);
				game.graphics.clear(0);
				
				LoadedBitmaps++;
				Bitmaps[Bitmaps.length] = me;
				
				//me.gl = new WebGlSurface(me.width, me.height, this, 1);
				
				if(me.doneCallback != undefined) me.doneCallback(me.doneCallbackTarget);
			};
		}
		
    }, false);
	xhr.open('GET', me.source, true);
	xhr.send(true);	
}