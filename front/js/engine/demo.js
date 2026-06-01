function Demo(game){	
	this.game = game;
	
	this.snapshots = [];
	
	this.currentFrame = 0;
	this.count = 0;
	this.record = false;
	this.playback = false;
	this.reset();
	this.compressed = "";

	this.targets = {'i____'	: this.game.inventory,
					'p____' : this.game.paddle,
					'in___': this.game.input,
					'g____'	: this.game,
					'bs___': this.game.balls};
	
}

Demo.prototype.compile = function(){
	var buffer = new ArrayBuffer(65535);
	var compiled = new Uint8Array(buffer);
	var pos = 0;
	
	for(var m=0, snap, s, li, bs, bl, kl, ks, ts, i, o, lo, fv, iv, mi=this.snapshots.length; 
		m<mi; 
		m++){
		snap = this.snapshots[m];
		
		//Dump keyboard
		for(ks=0, kl = snap[0].length; ks<kl; ks++){
			compiled[pos++] = snap[0][ks].charCodeAt(0);	
		}
		//Dump buttons
		for(bs=0, bl=snap[1].length; bs<bl; bs++){
			compiled[pos++] = snap[1][bs].charCodeAt(0);	
		}		
		
		for(i=0, li=snap[2].length; i<li; i++){
			s = snap[2][i];		
			
			//Dump target
			for(ts=0; ts<5; ts++){
				compiled[pos++] = s.t[ts].charCodeAt(0);
			}
			
			// Dump member sizes
			compiled[pos++] = s.f.length;
			compiled[pos++] = s.b.length;
			compiled[pos++] = s.i.length;
			
			// Dump member values
			for(o = 0, lo=s.f.length; o<lo; o++){
				fv = Fenc(s.f[o]); 
				compiled[pos++] = fv[0];
				compiled[pos++] = fv[1];
				compiled[pos++] = fv[2];
				compiled[pos++] = fv[3];
			}
			
			for(o = 0, lo=s.b.length; o<lo; o++){
				compiled[pos++] = s.b[o]? 1 : 0;
			}
			
			for(o = 0, lo=s.i.length; o<lo; o++){
				iv = Ienc(s.i[o]); 
				compiled[pos++] = iv[0];
				compiled[pos++] = iv[1];
			}
		}
	}
	var finalBuffer = new ArrayBuffer(pos);
	var finalData = new Uint8Array(finalBuffer);	
	var asciiData = "";
	for(var i=0; i<pos; i++){
		asciiData += String.fromCharCode(compiled[i]);
		finalData[i] = compiled[i];
	}
	return [asciiData];
	return finalData;
}
Demo.prototype.send = function(){
		//Send snapshot buffer to server
}

Demo.prototype.playStored = function(){
	if(gameDemo){
		cout('^3gameDemo starting...');
		this.snapshots = gameDemo;
		this.count = this.snapshots.length;	
		this.togglePlayback();
	} else {
		cout('^1gameDemo does not exist');
		this.snapshots = [];
		this.count = 0;
	}
}

Demo.prototype.nextFrame = function(){
	if(!this.playback) return false;
	var s = this.snapshots[this.currentFrame++];
	if(this.currentFrame > this.count){
		this.currentFrame = 0;
		this.playback = 0;
		this.game.input.install(this.game.input);
		cout("^5Demo Playback Finished");
		return false;
	}
	return s;
}

Demo.prototype.snapshot = function(){
	var f = this.count;
	var g = this.game;
	
	var s;
	
	// Since we need always these being sync, we'll always pass them first to ensure things 
	this.snapshots[f] = [];
	
	// this.snapshots[f][0] = g.input.keys;
	// this.snapshots[f][1] = g.input.buttons;
	this.snapshots[f][0] = encodeBooleanArray(g.input.keys);
	this.snapshots[f][1] = encodeBooleanArray(g.input.buttons);
	this.snapshots[f][2] = [];
	
	if(s = g.snapshot()) 			this.snapshots[f][2].push(s);
	if(s = g.balls.snapshot()) 		this.snapshots[f][2].push(s);
	if(s = g.paddle.snapshot()) 	this.snapshots[f][2].push(s);
	if(s = g.inventory.snapshot()) 	this.snapshots[f][2].push(s);
	if(s = g.input.snapshot()) 		this.snapshots[f][2].push(s);
	
	
	for(var i=0; i<MAX_BALLS; i++){
		if(s = g.balls.balls[i].snapshot()) this.snapshots[f][2].push(s);
	}
	
	this.count++;
}


Demo.prototype.play = function(){
	var f = this.nextFrame();
	var g = this.game;
	if(!f)return false;
	
	g.input.keys 	= decodeBooleanArray(f[0]);
	g.input.buttons = decodeBooleanArray(f[1]);
	// g.input.keys 	= f[0];
	// g.input.buttons = f[1];

	for(var i=0, li=f[2].length; i<li; i++){
		var s = f[2][i];
		this.targets[s.t].playback(s);
	}
	return true;
}

Demo.prototype.togglePlayback = function(){
	this.playback ^=1;
	return this.playback;
}


Demo.prototype.toggleRecord = function(){
	this.record ^=1;
	if(this.record){
		this.reset();
	}
	return this.record;
}

Demo.prototype.encode = function(string){
	for(var i = 0; i < string.length; i++){
		var bytes = [];
		for (var j = 0; j < string[i].length; ++j)       
			bytes.push(string[i].charCodeAt(j));
		this.compressed.push(bytes);
	}	
}

function onInitFs(){
}

function errorHandler(){
}

Demo.prototype.store = function(){
	cout('^5Dumping demo...');
		
	navigator.webkitPersistentStorage.requestQuota(1024*1024*5, 
	  function(gB){
	  window.webkitRequestFileSystem(PERSISTENT, gB, onInitFs, errorHandler);
	}, function(e){
	  console.log('Error', e);
	})
	
	var fileName = 'demo_'+this.game.level+'_'+parseInt(Math.random() * 65535)+'.txt';
	
	var blob = new Blob(this.compile(), {type: "application/octet-stream"});
	saveAs(blob, fileName);

	//var rawdata = this.compile();
	//window.open('data:application/octet-stream;charset=utf-16le;,' + encodeURIComponent(rawdata));
	//download(fileName, rawdata);	
}

Demo.prototype.reset = function(){
	this.snapshots = [];
	this.playback = false;
	this.count = 0;
	this.currentFrame = 0;
}

/* ------------------------------------------------------------------------------------------------- */
/*											HELPERS 												 */
/* ------------------------------------------------------------------------------------------------- */
function Ienc(I){
	var b = new ArrayBuffer(4);
	var i = new Int16Array(b);
	var a = new Uint8Array(b);
	
	i[0] = I;
	
	return	a.buffer;
}
function Idec(I){
	var b = new ArrayBuffer(4);
	var i = new Int16Array(b, 0, 2);
	var a = new Uint8Array(b, 0, 4);
	
	a[0] = I.charCodeAt(0);
	a[1] = I.charCodeAt(1);
	a[2] = I.charCodeAt(0);
	a[3] = I.charCodeAt(1);
	
	return	i[0];
}
function Benc(I){
	return I?'true':'nono';
}
function Bdec(I){
	return I=='true'?true:false;
}

function Fenc(F){	
	var b = new ArrayBuffer(4);
	var f = new Float32Array(b);
	var a = new Uint8Array(b);
	
	f[0] = F;
	return a.buffer;
}
function Fdec(F){
	if(F.length==0)return 0.0;
	var b = new ArrayBuffer(4);
	var f = new Float32Array(b);
	var a = new Uint8Array(b);
	
	a[0] = F[0].charCodeAt(0);
	a[1] = F[1].charCodeAt(0);
	a[2] = F[2].charCodeAt(0);
	a[3] = F[3].charCodeAt(0);
	
	return	f[0];
}

function decodeBooleanArray(eArray){
	var bArr = [];
	
	for(var sym = 0, i=0, li=eArray.length, o=0; i<li; i++){
		sym = eArray[i].charCodeAt(0);
		bArr[o++] 	=  sym & 0xfe;
		bArr[o++] 	= (sym & 0xfd) >> 1;
		bArr[o++] 	= (sym & 0xfb) >> 2;
		bArr[o++] 	= (sym & 0xf7) >> 3;
		bArr[o++] 	= (sym & 0xef) >> 4;
		bArr[o++] 	= (sym & 0xdf) >> 5;
		bArr[o++] 	= (sym & 0xbf) >> 6;
		bArr[o++] 	= (sym & 0x7f) >> 7;
	}
	
	return bArr;
}

function encodeBooleanArray(bArray){
	var bytesNeeded = bArray.length/8;
	var enc = "";
	for(var i=0, li=bArray.length, o=0; i<li; i+=8){
		enc += String.fromCharCode(	  (bArray[o++] ? 1 : 0) 		|
									( (bArray[o++] ? 1 : 0) << 1)	|
									( (bArray[o++] ? 1 : 0) << 2)	|
									( (bArray[o++] ? 1 : 0) << 3)	|
									( (bArray[o++] ? 1 : 0) << 4)	|
									( (bArray[o++] ? 1 : 0) << 5)	|
									( (bArray[o++] ? 1 : 0) << 6)	|
									( (bArray[o++] ? 1 : 0)	<< 7)	);
	}
	return enc;
}

/* Divides a string into an array of sliced fixed specified size strings */
function divide(string, size){
	var parts = [];
	
	var o = 0;
	for(var i=0; i<string.length; i+=size){
		parts[o++] = string.substring(i, size);
	}
	return parts;
}


function download(filename, text) {
  
	
	var element = document.createElement('a');
	element.setAttribute('target', 'blank');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

function getAsString(array, notFirst){
	var ret = "";
	for(var i in array){			
		if(Object.prototype.toString.call(array[i]) === '[object Array]' ) {
			ret += (notFirst?',':'') + getAsString(array[i], false);
		} else {
			ret += (notFirst?',':'') + array[i];
		}
		notFirst = true;
	}
	return ret;
}
