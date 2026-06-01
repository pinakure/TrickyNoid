<?php /*global $autoload;
$autoload .=  
'<div id="debug_wrap">
	<div id="debug"></div>
	<div id="debug_pull">console</div>
</div>';*/

function consoleExclusiveFunction(){
}

function parsecolors($str){
	$text = "";
	
	$pieces = explode('^', $str);
	$colors = count($pieces);
	
	if($colors > 1){	
		for($i=0; $i<$colors; $i++){
			$part = $pieces[$i];
			
			/*Skip color parsing if string length is less than parseable token */
			if(strlen($part)<2){
				$text .= $part;
				continue;
			}
			
			$tval = substr($part, 1, strlen($part));
			$cval = $part[0];
			$text .= "<span color=\"$cval\">$tval</span>";			
		}
	} else return $str;
	
	return $text;
}
?>