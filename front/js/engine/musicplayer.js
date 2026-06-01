function MusicPlayer(game){
	info("MUSICPLAYER","Initializing");
	
	this.self = this;
	
	this.songTitleOffset = 0.0;
    this.songTitleDelta = 0.015;    
    this.maxSongs = 0;
    this.nextSong = false;
    this.playbackTime = 0;
    
	this.author = "NoAuthor";
    
	if(!game)return;
    this.game = game;

	this.songList = this.getSongList();

	this.displayTitle  = new Display(48, 1, 14, ' ', FONT_LCD);
	this.displayAuthor = new Display(48, 2, 14, ' ', FONT_LCD);
	this.displayTitle.setString("NoTitle");
	this.displayAuthor.setString("NoAuthor");
		
    this.music = false;//i guess this is useless!
    this.module = false;
	
	this.musicLibrary=[];
	this.currentModule='';
	this.defaultComposer='';
	this.oldpos = -1;
	this.timer = false;
	this.playlistPosition = 0;
	this.playlistActive = false;
	this.repeat = true;
	
    this.playbackLimit = 100000;
	
	this.initializeModulePlayer(this);
}

MusicPlayer.prototype.load = function(){
	var self = this;
	
	this.currentModule=this.musicLibrary[0].songs[this.playlistPosition].file;
	this.defaultComposer=this.musicLibrary[0].composer;
	this.displayAuthor.setString(this.defaultComposer);
	this.displayTitle.set(this.currentModule.split('.')[0]);
	this.playlistActive=false;
			
	info("MUSICPLAYER", "Loading ^7"+this.currentModule);
	
	this.module.setautostart(true);
	this.module.setrepeat(true);
	if (this.module.playing) {	this.module.stop();}
	this.module.stopaudio();
	
	var loadInterval=setInterval(function(){
		if (!self.module.delayload) {			
			self.module.load('data/music/'+self.defaultComposer+"/"+self.currentModule);			
			clearInterval(loadInterval);
		}
	}, 200);
	return false;
}
	
MusicPlayer.prototype.toggleRepeat = function(){
	this.repeat ^= 1;
	this.module.setrepeat(this.repeat);
	return false;
}

MusicPlayer.prototype.prevTrack = function(){
	this.playlistPosition = (this.playlistPosition-1) % this.musicLibrary[0].songs.length;
	this.load();
}

MusicPlayer.prototype.nextTrack = function(){
	if(!this.musicLibrary)return;
	this.playlistPosition = (this.playlistPosition+1) % this.musicLibrary[0].songs.length;
	this.load();
	return false;
}
MusicPlayer.prototype.forward = function(){
	this.module.jump(1);
}

MusicPlayer.prototype.back = function(){
	this.module.jump(-1);
}

MusicPlayer.prototype.pause = function(){
	this.module.pause();
}

MusicPlayer.prototype.play = function(){
	if (this.module.playing) {
		this.module.stop();
		return false;
	}
	this.module.play();
}
	
MusicPlayer.prototype.initializeModulePlayer = function(player){

	player.module = new Modplayer(player);
	var module = player.module;
	
	player.musicLibrary=[];
	player.currentModule='Necros/point_of_departure.s3m';
	player.defaultComposer='';
	
	player.oldpos=-1;
	player.playlistPosition=0;
	window.playlistActive=false;

	module.setrepeat(true);
	module.setseparation(0);
	//module.setamigamodel("1200");
	module.setamigamodel("500");

	module.onReady = function() { module.musicplayer.readyCallback(module);};	
	module.onPlay  = function() { module.musicplayer.playCallback(module); };		
	module.onStop  = function() { module.musicplayer.stopCallback(module); };	
		
	// all done, load the song library and default module
	var songString = "";				
	var request = new XMLHttpRequest();
	request.open("GET", "index.php?playlist=playlist", true);
	//request.responseType = "json";
	request.onload = function() {
			
		try{
			player.musicLibrary = JSON.parse(request.response);
			for(var i=0; i<player.musicLibrary.length; i++){
				
				console.log("-----------------------------------------------------");
				console.log("SONGS FROM COMPOSER "+player.musicLibrary[i].composer);
				console.log("-----------------------------------------------------");
				
				info("MUSICPLAYER", "Found songs: ^7"+player.musicLibrary[i].songs.length);
				
				songString = "";
				for(var o=0; o<player.musicLibrary[i].songs.length; o++){
					songString += player.musicLibrary[i].songs[o].file + " , ";
				}
				console.log(songString);
			}
		} catch(e){
			complaint('MUSICPLAYER', "Response is not a JSON Object", e);
			return;
		}

		//player.load();
	}
	request.send(true);
}

MusicPlayer.prototype.playCallback = function(player){
	info("MUSICPLAYER","Music is playing");	
}

MusicPlayer.prototype.stopCallback = function(player){
	info("MUSICPLAYER","Music is stopped");
	clearInterval(this.timer);
	if(this.module.endofsong){
		this.nextTrack();
	}
}

MusicPlayer.prototype.readyCallback = function(player){
	info("MUSICPLAYER","Music is ready");
}

MusicPlayer.prototype.getSongAuthor = function() {
	return this.defaultComposer;
}
	
MusicPlayer.prototype.render = function(g){
	this.displayTitle.render(g);
	this.displayAuthor.render(g);
}

MusicPlayer.prototype.update = function(Delta){
	this.displayTitle.update();
	this.displayAuthor.update();
	
	this.songTitleOffset += this.songTitleDelta * Delta;
	this.songTitleUpdate();

	if((this.songTitleOffset >= 6.5)||(this.songTitleOffset <= 0.0)){
		this.songTitleDelta *= -1.0;
	}

	this.playbackTime += Delta;

	if(this.playbackTime > this.playbackLimit){
		this.music.fade(1500, 0.0, true);            
		if(this.playbackTime > this.playbackLimit + 3000) this.NextSong();
	}
}

MusicPlayer.prototype.deleteSong = function(){
	this.music.stop();
	
	// Take song reference 
	var s = this.songList[this.nextSong];
	
	// Unlink from songList
	this.songList.remove(this.nextSong);
	this.maxSongs--;
	
	/*var file = new File("data/music/" + s.getFilename());
		// Move song to trash
	file.renameTo(new File("data/music/deleted.trash/" + s.getFilename()));    		
	*/
	this.NextSong();
}


MusicPlayer.prototype.getModTempo = function(filename) {
	/*File f = new File("data/music/" + filename);
	int songTempo;
	
	byte padding[];
	byte bytes[];
	byte mult[];
	padding = new byte[76];
	bytes = new byte[2];
	mult = new byte[2];
	float factor;
	
	try {
		
		FileInputStream fr = new FileInputStream(f);
		fr.read(padding, 0, 76);            
		fr.read(mult, 0, 2);
		fr.read(bytes, 0, 2);
		
	} catch (FileNotFoundException ex) {
		Logger.getLogger(JTrickyNoid.class.getName()).log(Level.SEVERE, null, ex);
	} finally {
		
		factor = mult[0]*2;
		songTempo = ((int)bytes[0]);
		if(songTempo < 0) songTempo *= -1.0f;
		songTempo *= factor;
	}*/
	
	return this.songTempo;
}

MusicPlayer.prototype.getModTitle = function(offset, filename){
	/*File f = new File("data/music/" + filename);
	byte bytes[];
	String songName;

	bytes = new byte[20];

	//playbackTime = game.playtime;

	try {
		
		FileInputStream fr = new FileInputStream(f);
		fr.read(bytes, 0, offset);
		fr.read(bytes, 0, 20);
		songName = new String(bytes);
		
		fr.read(bytes, 0, 1);//skip 1 byte
		fr.read(bytes, 0, 20);
		author = new String(bytes);
		
	} catch (FileNotFoundException ex) {
		Logger.getLogger(JTrickyNoid.class.getName()).log(Level.SEVERE, null, ex);
		songName = "ERROR";
		author = "ERROR";
	}*/
	return this.songName;
}

MusicPlayer.prototype.songTitleUpdate = function() {
	/*if(!this.songList[this.nextSong])return "No Name";
	
	var name = this.songList[this.nextSong].getTitle();
	var code, i;
	for(i = 0; i < 14; i++) {

		// 1ST Line : Song Title
		// code = name.codePointAt(i + parseInt(songTitleOffset));
		code = name[i + parseInt(songTitleOffset)];
		if((code > 31 ) && ( code < 0xff)){
			this.hud.setTileId(48+i, 1, 1, code - 31);
		} else {
			this.hud.setTileId(48+i, 1, 1, 0x01);
		}

		// 2ND Line : Song Author
		// code = this.author.codePointAt(i + (int)songTitleOffset);
		code = this.author[i + parseInt(songTitleOffset)];
		if((code > 31 )&&( code < 0xff)){
			this.hud.setTileId(48+i, 2, 1, code - 31);
		} else {
			this.hud.setTileId(48+i, 2, 1, 0x01);
		}

		// 3RD Line : Song timer
		var pTime = this.game.playtime;
		var time = parseInt(pTime);

		var seconds = parseInt(pTime / 1000);
		var minutes = parseInt(seconds / 60);
		var hours  = parseInt(minutes / 60);

		var value = [ (time % 100) / 10, 
					(time % 1000) / 100,
					0xa,
					seconds % 10,
					((seconds % 60) / 10) % 10,
					0xa,
					minutes % 10,
					((minutes % 60) / 10) % 10];

		if(i<8) {
			this.hud.setTileId(61-i, 3, 1, 0x11 + value[i] );                
		} 
	}*/
}

MusicPlayer.prototype.randInt = function(min, max) {
	return (Math.random*(max - min) + 1) + min;
}

MusicPlayer.prototype.getSongList = function(){
	var songlist = []; 	
	this.maxSongs = 0;

	try{                 
		var f = new File("data/music");
		var files = f.list();

		var songName = "";
		var songTempo = "";
		// for each name in the path array
		var i, file;
		for(i=0; i<files.length; i++){
			file = files[i]; 
			// prints filename and directory name
			/*if(file.toLowerCase().endsWith(".mod")){
			  songName = getModTitle(0, file);                  
			  songTempo = 256;
			} else if(file.toLowerCase().endsWith(".xm")) {
			  songName = getModTitle(0x11, file);
			  songTempo = getModTempo(file);
			  //songTempo *= 2;
			} else if(file.toLowerCase().endsWith(".ogg")) {
			  songName = getModTitle(0x11, file);
			  songTempo = 400;//getModTempo(file);
			} else {
			  // Not a valid module, dont load it.
			  continue;
			} */              
			songlist[songlist.length] = new Song(file, songName, "Unauthed", songTempo);
			this.maxSongs++;
		}
	} catch(e){
		cout('^1MUSICPLAYER ^3: ^1Failed to read song list : '+e.message);
	}
  
	return songlist;
}

MusicPlayer.prototype.nextSong = function() {
	this.nextTrack();	
}

MusicPlayer.prototype.getTempo = function(){
	if(!this.songList[this.nextSong])return 140;
	
	var speed = parseInt( this.songList[ this.nextSong ].getSpeed());
	cout("TITLE" + this.songList[ this.nextSong].getTitle() + "Song speed: " + speed);	
	return speed;
}

MusicPlayer.prototype.getPlaybackTime = function() {
	return this.game.playtime; //playbackTime;
}

MusicPlayer.prototype.isPlaying = function() {
	if(!this.music)return false;
	return this.music.playing();
}    

MusicPlayer.prototype.quiet = function(){
	//this.music.fade(300, 0.50, false);
}
MusicPlayer.prototype.loud = function(){
	//this.music.fade(300, 1.0, false);
}

MusicPlayer.prototype.musicEnded = function(music) {
	this.NextSong();        
}

MusicPlayer.prototype.musicSwapped = function(music,  newMusic){
	
}
