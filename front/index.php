<?php 

include "common.php";

if(array_key_exists('playlist', $_GET)){ echo getPlayList();	die(); }

?><!DOCTYPE html>
<html>
	<head>
    	<title>TrickyNoid</title>
		<meta encoding="utf-8"/>
		<meta charset="utf-8"/>
		<meta name="viewport" content="target-densitydpi=device-dpi; width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;">
		<link rel="stylesheet" type="text/css" href="stylesheet.php"/>
		<?php 
			autoload('js'); 
			autoload('js/engine'); 
			autoload('js/game'); 
			autoload('modules');
		?>
    </head>
	<body id="body" oncontextmenu="return false">
		<?= $GLOBALS['autoload'] ?>		
	</body>
<html>