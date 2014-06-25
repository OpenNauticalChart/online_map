<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
       "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<title>OpenNauticalChart</title>
		<meta name="AUTHOR" content="Olaf Hannemann" >
		<meta http-equiv="content-type" content="text/html; charset=utf-8">
		<meta name="date" content="2014-24-06">
		<link rel="SHORTCUT ICON" href="./resources/icons/plug_icon_16px.png">
		<link rel="stylesheet" type="text/css" href="map-full.css">
		<script type="text/javascript" src="./script/map_base.js"></script>
		<script type="text/javascript" src="./include/action_dialog_pages.js"></script>
		<script type="text/javascript" src="./script/openlayers/OpenLayers.js"></script>
		<script type="text/javascript" src="./script/OpenStreetMap.js"></script>
		<script type="text/javascript" src="./script/nominatim.js"></script>
		<script type="text/javascript" src="./script/utilities.js"></script>
		<script type="text/javascript" src="./script/map_utils.js"></script>
	</head>
	<body onload=init();>
		<div id="map" style="position:absolute; bottom:0px; left:0px;"></div>
		<div id="layerswitcher"></div>
		<div style="position:absolute; bottom:48px; left:12px; width:700px; cursor:pointer;">
			<img src="./resources/icons/OSM-Logo-32px.png" height="32px" title="alle daten..." onClick="showLicense()">
			<img src="./resources/icons/somerights20.png" height="30px" title="This work is licensed under the Creative Commons Attribution-ShareAlike 2.0 License" onClick="showLicense()">
		</div>
		<div id="actionDialog">
            <br>
        </div>
		 <? include('./include/topmenu.inc'); ?>
	</body>
</html>
