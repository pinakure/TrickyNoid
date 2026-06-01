<?php header("Content-Type: text/css;charset=utf-8");?>

* {
	margin: 				0;
	padding:				0;
}

body, html{
	height: 				100%;
	width: 					100%;	
	overflow:				hidden;
	background:				#000;
}

body {
	background-image:		url(data/gfx/pretitle.png);
	background-position:	left;
	background-size:		70%;
	image-rendering:		-moz-pixelated;
	image-rendering:		-o-pixelated;
	image-rendering:		-webkit-pixelated;
	image-rendering:		pixelated;
	background-repeat:		no-repeat;
}

canvas{ 
	display:				inline-block;
	width:					100%;
	height:					100%;
	border: 				none;
	background-color:		transparent;
	box-shadow:				2px 2px #444;
	cursor:					none;
	image-rendering:		-moz-pixelated;
	image-rendering:		-o-pixelated;
	image-rendering:		-webkit-pixelated;	
	image-rendering:		pixelated;
}