
var clearecho = false;

function echoClear(){
	$('#echo').css('opacity', '0');
}

function cout(message){
	var d = $('#debug');
	message = parsecolors(message);
	$('#echo').html(message).css('opacity', '.8');
	d.append(message+'<br/>');
	d.scrollTop(d.attr("scrollHeight"));
	
	// Schedule echo screen to remove text along time
	if(clearecho)window.clearInterval(clearecho);
	clearecho = window.setTimeout(echoClear, 2000);
}

function complaint(sectionName, errorData, exception){
	cout('^1'+sectionName+' ^2: ^1'+ errorData+' ^2 : ^8'+exception.message);
}

function cls(sectionName, infoData){
	$('#debug').html('');
}

function info(sectionName, infoData){
	cout('^7'+sectionName+' ^8: ^5'+ infoData+'...');
}

function parsecolors(str){
	var text = "";
	
	var pieces = str.split('^');
	var colors = pieces.length;
	
	if(colors > 1){	
		var i=0;
		var cval, tval, part;
		for(; i<colors; i++){
			
			part = pieces[i];
			
			/*Skip color parsing if string length is less than parseable token */
			if(part.length < 2){
				text += part;
				continue;
			}
			
			tval = part.substring(1, part.length);
			cval = part[0];
			text += '<span color="'+cval+'">'+tval+'</span>';
		}
	} else return str;
	
	return text;
}
