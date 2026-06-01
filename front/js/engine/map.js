function Map(filename, context){
	info('MAP', 'Initializing');

	this.map = false;
	this.filename = filename;
    this.game = context; 
    this.loadMap(this.filename);
	
	
	this.awards = [false, false, false];
	this.records= [60, 180, 360];
	
}

Map.prototype.set = function(x, y, layer, value){
	this.map.setTileId(x, y, layer, value);
}

Map.prototype.get = function(x, y, layer){
	return this.map.getTileId(x, y, layer);
}
    
Map.prototype.loadMap = function(filename) {
	this.filename = filename;
	cout("^8Loading map ^7"+filename);
	if(this.map){
		this.map.load('data/map/'+filename+'.tmx');
	} else {
		try {        
			this.map = new TiledMap("data/map/"+ filename + ".tmx", "data/gfx");
		} catch(e) {
			complaint('MAP', 'Failed to load map ^2' + filename, e);		
			this.map = false;
		}
		game.game.bricks.loadBricks(this.map);
		
	}
	
}

Map.prototype.render = function(g) {
	g.setDrawMode(g.MODE_ALPHA_MAP);        
	this.map.render(3, 3, 1);        // Damage
	
	g.setDrawMode(g.MODE_ALPHA_BLEND);
	this.map.render(5, 5, 3);        // Shadow
	
	g.setDrawMode(g.MODE_ALPHA_BLEND);
   // map.render(3, 3, 0);        // Bricks
	
	g.setDrawMode(g.MODE_NORMAL);    
}
    
    
Map.prototype.test = function(x, y) {
	
	if(x <  0 )return false;
	if(y <  0 )return false;
	if(x > 220)return false;
	if(y > 208)return false;	
	
	return this.map.getTileId((x/16), (y/8), 0) > 0x00;    
}