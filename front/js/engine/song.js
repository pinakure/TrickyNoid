function Song( filename, title, author, speed) {
	this.filename = filename;
    this.title = title;
    this.author = author;
    this.speed = speed;
}

Song.prototype.getFilename = function() {
	return this.filename;
}

Song.prototype.setFilename = function(filename) {
	this.filename = filename;
}

Song.prototype.getTitle = function() {
	return this.title;
}

Song.prototype.setTitle = function(title) {
	this.title = title;
}

Song.prototype.getAuthor = function() {
	return this.author;
}

Song.prototype.setAuthor = function(author) {
	this.author = author;
}

Song.prototype.getSpeed = function() {
	return this.speed;
}

Song.prototype.setSpeed = function(speed) {
	this.speed = speed;
}

