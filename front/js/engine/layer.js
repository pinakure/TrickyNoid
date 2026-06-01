function Layer(name, width, height, encoding, compression, visible, rawdata){
	info('LAYER', 'Creating layer');
	
	this.rawdata = rawdata;
	this.name = name;
	this.width = width;
	this.height = height;
	this.visible = visible;
	this.encoding = encoding;
	this.compression = compression;
	this.data = 0;
	
	info('LAYER', 'Analyzing Layer data');
	
	this.parseData();
	
}

Layer.prototype.parseData = function(){
	
	switch(this.encoding){
		case 'base64':
			//info('LAYER', 'Data is Base64 Encoded');
			this.data = atob(this.rawdata);
			// Decode base64 (convert ascii to binary)
			// Convert binary string to character-number array
			this.rawdata    = this.data.split('').map(function(x){return x.charCodeAt(0);});
			this.data = 0;
			break;
			
		default: 
			break;
	}
	
	switch(this.compression){
		
		case 'gzip':
			//info('LAYER', 'Data is GZIP Compressed');
			// Turn number array into byte-array
			this.data     = new Uint8Array(this.rawdata);
			
			// Pako magic
			this.rawdata = pako.inflate(this.data);

			// Convert gunzipped byteArray back to ascii string:
			//this.data = String.fromCharCode.apply(null, new Uint16Array(this.rawdata));
			var i;
			this.data = [];
			for(i=0; i<this.rawdata.length; i+=4){
				this.data[this.data.length] = this.rawdata[i];
			}
			this.rawdata = false;
			break;

		default:		
			this.data = this.rawdata;
			this.rawdata = false;
			break;
		
		case 'bzip':
			//info('LAYER', 'BZIP ^1Compression is not supported');
			return;
	}
}

Layer.prototype.get = function(x,y){
	if(this.data == 0)return 0;
	if( (x >= this.width ) || (x < 0) ) return 0;
	if( (y >= this.height) || (y < 0) ) return 0;
	return this.data[(y * (this.width)) + x];
}

Layer.prototype.set = function(x,y,value){
	if(this.data == 0)return;
	if( (x >= this.width ) || (x < 0) ) return;
	if( (y >= this.height) || (y < 0) ) return;
	this.data[(y * (this.width)) + x] = value;
}