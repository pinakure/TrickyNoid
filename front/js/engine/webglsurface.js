function WebGlSurface(width, height, image, contextIndex){
	this.width = width;
	this.height = height;	
	this.img = image;
	
	this.tex = false;
	this.vloc = false;
	this.tloc = false;
	this.vertexBuff = false;
	this.texBuff = false;
	this.progObj = false;
	
	var canvas = document.getElementById('gl');
    
	this.context = canvas.getContext('webgl'); 
    if(!this.context)this.context = canvas.getContext('experimental-webgl');
    if(!this.context)this.context = canvas.getContext('webkit-3d');
    if(!this.context)this.context = canvas.getContext('moz-webg');
    if(!this.context)this.context = canvas.getContext('3d');
	if(!this.context){
		console.log("Cannot capture a valid 3D Context:");
		console.log(canvas);
	} else this.initShaders();
}

WebGlSurface.prototype.initShaders = function(){
	var vertexShaderSrc =	"attribute vec2 aVertex;" +
							"attribute vec2 aUV;" + 
							"varying vec2 vTex;" +
							"void main(void) {" +
							"  gl_Position = vec4(aVertex, 0.0, 1.0);" +
							"  vTex = aUV;" +
							"}";
    var fragmentShaderSrc =	"precision highp float;" +
							"varying vec2 vTex;" +
							"uniform sampler2D sampler0;" +
							"void main(void){" +
							"  gl_FragColor = texture2D(sampler0, vTex);"+
							"}";
    
    var vertShaderObj = this.context.createShader(this.context.VERTEX_SHADER);
    var fragShaderObj = this.context.createShader(this.context.FRAGMENT_SHADER);
    this.context.shaderSource(vertShaderObj, vertexShaderSrc);
    this.context.shaderSource(fragShaderObj, fragmentShaderSrc);
    this.context.compileShader(vertShaderObj);
    this.context.compileShader(fragShaderObj);
    
    this.progObj = this.context.createProgram();
    this.context.attachShader(this.progObj, vertShaderObj);
    this.context.attachShader(this.progObj, fragShaderObj);
    
    this.context.linkProgram(this.progObj);
    this.context.useProgram(this.progObj);
	
    this.context.viewport(0, 0, 320, 240);

	this.vertexBuff = this.context.createBuffer();
    this.context.bindBuffer(this.context.ARRAY_BUFFER, this.vertexBuff);
    this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array([-1/8, 1/6, -1/8, -1/6, 1/8, -1/6, 1/8, 1/6]), this.context.STATIC_DRAW);
    
    this.texBuff = this.context.createBuffer();
    this.context.bindBuffer(this.context.ARRAY_BUFFER, this.texBuff);
    this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array([0, 1, 0, 0, 1, 0, 1, 1]), this.context.STATIC_DRAW);
    
    this.vloc = this.context.getAttribLocation(this.progObj, "aVertex"); 
    this.tloc = this.context.getAttribLocation(this.progObj, "aUV");
	
	//load image data
	this.tex = this.context.createTexture();
	this.context.bindTexture(this.context.TEXTURE_2D, this.tex);
	this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MIN_FILTER, this.context.NEAREST);
	this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MAG_FILTER, this.context.NEAREST);
	// Bind image data to texture
	//this.context.generateMipmap(this.context.TEXTURE_2D);
	this.context.texImage2D(this.context.TEXTURE_2D, 0,  this.context.RGBA,  this.context.RGBA, this.context.UNSIGNED_BYTE, this.img);

	this.context.enableVertexAttribArray(this.vloc);
	this.context.bindBuffer(this.context.ARRAY_BUFFER, this.vertexBuff);
	this.context.vertexAttribPointer(this.vloc, 2, this.context.FLOAT, false, 0, 0);

	this.context.enableVertexAttribArray(this.tloc);
	this.context.bindBuffer(this.context.ARRAY_BUFFER, this.texBuff);
	this.context.bindTexture(this.context.TEXTURE_2D, this.tex);
	this.context.vertexAttribPointer(this.tloc, 2, this.context.FLOAT, false, 0, 0);
}

WebGlSurface.prototype.draw = function(x,y){
	this.context.drawArrays(this.context.TRIANGLE_FAN, x, y);
}
