<?php
/***************************
 * Nominatim Handler
 ***************************/
header("Content-Type: text/xml; charset=utf-8");
$name = urlencode( $_GET["q"]  );
$baseUrl = 'http://nominatim.openstreetmap.org/search?format=xml&q=';
$data = file_get_contents( "{$baseUrl}{$name}" );
echo $data;
?>
