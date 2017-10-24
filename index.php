<!DOCTYPE html>
<html>
	<head>
		<title>OpenNauticalChart</title>
		<meta name="AUTHOR" content="Olaf Hannemann" >
		<meta http-equiv="content-type" content="text/html; charset=utf-8">
		<meta name="description" content="OpenNauticalChart offers free seacharts for everybody. This charts are usable (offline) with several ship-plotters and Navigation-equipement on board.">
		<meta name="date" content="2014-10-25">
		<link rel="SHORTCUT ICON" href="./resources/icons/ONC-Logo_16px.png">
		<link rel="stylesheet" type="text/css" href="./map-full.css">
		<script type="text/javascript" src="./script/openlayers/OpenLayers.js"></script>
		<script type="text/javascript" src="./script/json2.js"></script>
		<script type="text/javascript" src="./script/prototype.js"></script>
		<script type="text/javascript" src="./script/map_base.js"></script>
		<script type="text/javascript" src="./script/download_map.js"></script>
		<script type="text/javascript" src="./script/nautical_route/nautical_route.js"></script>
		<script type="text/javascript" src="./script/OpenStreetMap.js"></script>
		<script type="text/javascript" src="./script/nominatim.js"></script>
		<script type="text/javascript" src="./script/utilities.js"></script>
		<script type="text/javascript" src="./script/map_utils.js"></script>
		<script type="text/javascript" src="./script/language/l10n.js"></script>
		<script type="text/javascript" src="./script/language/localizations.js"></script>
	</head>
	<body onload=init();>
		<div id="map" style="position:absolute; bottom:0px; left:0px;"></div>
		<div id="layerswitcher"></div>
		<div style="position:absolute; bottom:48px; left:12px; width:700px; cursor:pointer;">
			<img src="./resources/icons/OSM-Logo-32px.png" height="32px" title="All base layer data originate from the OpenStreetMap project" onClick="javascript:showActionDialog(localize('%license', 'License'), loadFile('./dialog_pages/main_license/main_license_' + localize('%locale', 'en') + '.html', 'txt'));">
			<img src="./resources/icons/CC-BY-SA_32px.png" height="32px" title="This work is licensed under the Creative Commons Attribution-ShareAlike 2.0 License" onClick="javascript:showActionDialog(localize('%license', 'License'), loadFile('./dialog_pages/main_license/main_license_' + localize('%locale', 'en') + '.html', 'txt'));">
		</div>
		<div id="actionDialog">
            <br>
        </div>
		 <?php include('./include/topmenu.inc'); ?>
	</body>
</html>
