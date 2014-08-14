<?php
/***************************
 *OverPass-Api Handler
 ***************************/
 
$bb = $_REQUEST["bb"];

header("Content-Type: text/xml; charset=utf-8");
$baseUrl = 'http://overpass-api.de/api/interpreter?data=%28way%28' .$bb .'%29[%22seamark:type%22];%3E;node%28' .$bb .'%29[%22seamark:type%22];%29;out%20body;';
$data = file_get_contents( "{$baseUrl}" );
echo $data;
?>
