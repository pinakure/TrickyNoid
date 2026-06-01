function File(name){
	this.name = name;/* If this is a file, wait for open, if not, list directories */
	this.fileList = [];
}

File.prototype.list = function(){
	return this.fileList;
}