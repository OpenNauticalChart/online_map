<?php
	include("./api/weather_time_utc.php");
?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
       "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<title>ONC - Weather</title>
		<meta name="AUTHOR" content="Olaf Hannemann" >
		<meta http-equiv="content-type" content="text/html; charset=utf-8">
		<meta name="date" content="2014-02-07">
		<link rel="SHORTCUT ICON" href="./resources/icons/ONC-Logo_16px.png">
		<link rel="stylesheet" type="text/css" href="map-full.css">
		<link rel="stylesheet" type="text/css" href="weather.css">
		<script type="text/javascript" src="./script/openlayers/OpenLayers.js"></script>
		<script type="text/javascript" src="./script/json2.js"></script>
		<script type="text/javascript" src="./script/map_weather.js"></script>
		<script type="text/javascript" src="./script/OpenStreetMap.js"></script>
		<script type="text/javascript" src="./script/utilities.js"></script>
		<script type="text/javascript" src="./script/map_utils.js"></script>
		<script type="text/javascript" src="./script/language/l10n.js"></script>
		<script type="text/javascript" src="./script/language/localizations.js"></script>
		<script type="text/javascript">
			// FIXME: needs to be conveted to a stand alone php file
			// Read time files from server and create the menu
			function fillTimeDiv() {
				var arrayTimeValues = new Array();

				arrayTimeValues[0] = "<?=$utc->getWeatherUtc('5')?>";
				arrayTimeValues[1] = "<?=$utc->getWeatherUtc('7')?>";
				arrayTimeValues[2] = "<?=$utc->getWeatherUtc('9')?>";
				arrayTimeValues[3] = "<?=$utc->getWeatherUtc('11')?>";
				arrayTimeValues[4] = "<?=$utc->getWeatherUtc('15')?>";
				arrayTimeValues[5] = "<?=$utc->getWeatherUtc('19')?>";
				arrayTimeValues[6] = "<?=$utc->getWeatherUtc('23')?>";
				arrayTimeValues[7] = "<?=$utc->getWeatherUtc('27')?>";

				var oldDate = "00";
				var html = "<span><b>" + localize("%time_utc", "Time (UTC)") + "</b></span><br/><br/>";
				var layer = 1;

				for(i = 0; i < arrayTimeValues.length; i++) {
					var values = arrayTimeValues[i].split(" ");
					var date = values[0];
					var time = values[1];
					layer = i + 1;
					if (oldDate != date) {
						if (oldDate != "00") {
							html += "</ul>";
						}
						html += "<h2>" + date + "</h2>";
						html += "<ul>";
						oldDate = date;
					}
					html += "<li id = timeLayer" + layer + " onClick='setLayerVisible(" + layer + ")' onMouseover=\"this.style.background='#ADD8E6'\" onMouseout=\"if(layerNumber !=" + layer + ") {this.style.background='#FFFFFF'} else {this.style.background='#ADD8E6'}\">" + time + "</li>";
				}
				html += "</ul>";
				document.getElementById('timemenu').innerHTML = html;
			}
		</script>
	</head>
	<body onload=init();>
		<div id="map" style="position:absolute; bottom:0px; left:0px;"></div>
		<div id="layerswitcher"></div>
		<div style="position:absolute; bottom:10px; left:12px; width:700px; cursor:pointer;">
			<img src="./resources/icons/OSM-Logo-32px.png" height="32px" title="All base layer data originate from the OpenStreetMap project" onClick="javascript:showActionDialog(localize('%license', 'License'), loadFile('./dialog_pages/main_license/main_license_' + localize('%locale', 'en') + '.html', 'txt'));">
			<img src="./resources/icons/CC-BY-SA_32px.png" height="32px" title="This work is licensed under the Creative Commons Attribution-ShareAlike 2.0 License" onClick="javascript:showActionDialog(localize('%license', 'License'), loadFile('./dialog_pages/main_license/main_license_' + localize('%locale', 'en') + '.html', 'txt'));">
			<img src="./resources/icons/OpenPortGuideLogo_32.png" height="32px" title="Weather by OpenPortGuide" onClick="javascript:showActionDialog(localize('%license', 'License'), loadFile('./dialog_pages/main_license/main_license_' + localize('%locale', 'en') + '.html', 'txt'));">
		</div>
		<div id="actionDialog"></div>
		 <? include('./include/topmenu_weather.inc'); ?>
		 <div id="timemenu" style="position:absolute; top:55px; left:12px;"></div>
		<div id="comment" style="position:absolute; top:10px; right:12px;  visibility:hidden;">
			<img src="./resources/map/WindScale.png"/>
		</div>
	</body>
</html>
