<script>
var MAP_LIST = [ <?php

$dir = scandir('data/map/');

for($i=0; $i<count($dir); $i++){
	$d = $dir[$i];
	
	$map = explode('.tmx', $d);
	if(count($map) == 2){	
		echo "'".$map[0]."',";
	}
}

?>];
</script>