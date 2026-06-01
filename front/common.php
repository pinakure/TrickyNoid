<?php 
error_reporting(E_ALL); 

function autoload($directory){
	global $autoload;
	
	/* M4GEEK AUTOLOADER */
	$dir = scandir($directory);
	foreach($dir as $d){
		$ext = @end(explode('.', $d));
		switch($ext){
			case 'js':
				echo '<script language="javascript" src="'.$directory.'/'.$d.'"></script>';		
				break;
			case 'css':
				echo '<link rel="stylesheet" type="text/css" href="'.$directory.'/'.$d.'"/>'; 
				break;
			case 'php':
				include $directory.'/'.$d; 
				break;
			case 'html': case 'htm':
				$autoload .= file_get_contents($directory.'/'.$d); 
				break;
		}
	}
	
	/* Perform Introspective actions as calling generic functions, declarations, etc here */
}

function getPlayList(){
	$entries = array();
	
	$mdir = scandir('data/music/');foreach($mdir as $md){	
		
		if($md == '.')continue;	
		if($md == '..')continue;	
		if($md == 'deleted.trash')continue;
		
		$songs = array();
		$songs['composer'] = $md;
		$songs['songs'] = array();
		
		$dir = scandir('data/music/'.$md.'/');foreach($dir as $d){		
			
			$song = array();
			
			$ext = @end(explode('.', $d));
			switch($ext){
				case 'mod':
				case 'xm':
				case 'ft2':
				case 's3m':
					$songs['songs'][] = array(	'file'=>$d, 
												'size'=>filesize('data/music/'.$md.'/'.$d));
					break;
					
			}
		}
		
		// $entries[] = json_encode($songs);
		$entries[] = $songs;
	}
	
	return json_encode($entries);
}
?>