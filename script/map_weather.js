
// Main settings
var version = "0.0.1";
var date = "02.07.2014";

// The map
var map;

// Wind layers
var layer_weather_wind1;
var layer_weather_wind2;
var layer_weather_wind3;
var layer_weather_wind4;
var layer_weather_wind5;
var layer_weather_wind6;
var layer_weather_wind7;
var layer_weather_wind8;
// Air pressure layers
var layer_weather_pressure1;
var layer_weather_pressure2;
var layer_weather_pressure3;
var layer_weather_pressure4;
var layer_weather_pressure5;
var layer_weather_pressure6;
var layer_weather_pressure7;
var layer_weather_pressure8;
// Temperature layers
var layer_weather_air_temperature1;
var layer_weather_air_temperature2;
var layer_weather_air_temperature3;
var layer_weather_air_temperature4;
var layer_weather_air_temperature5;
var layer_weather_air_temperature6;
var layer_weather_air_temperature7;
var layer_weather_air_temperature8;
// Precipitation layers
var layer_weather_precipitation1;
var layer_weather_precipitation2;
var layer_weather_precipitation3;
var layer_weather_precipitation4;
var layer_weather_precipitation5;
var layer_weather_precipitation6;
var layer_weather_precipitation7;
var layer_weather_precipitation8;
// Significant wave height layers
var layer_weather_significant_wave_height1;
var layer_weather_significant_wave_height2;
var layer_weather_significant_wave_height3;
var layer_weather_significant_wave_height4;
var layer_weather_significant_wave_height5;
var layer_weather_significant_wave_height6;
var layer_weather_significant_wave_height7;
var layer_weather_significant_wave_height8;

// Selected time layer
var layerNumber = 1;

// Layer visibility
var showWindLayer = false;
var showPressureLayer = false;
var showAirTemperatureLayer = false;
var showPrecipitationLayer = false;
var showSignificantWaveHeightLayer = false;

// Position and zoomlevel of the map  (will be overriden with permalink parameters or cookies)
var lon = 11.6540;
var lat = 54.1530;
var zoom = 6;

// Look up translation for given string
var localize = function (string, fallback) {
	var localized = string.toLocaleString();
	var retValue = fallback;
	if (localized !== string) {
		retValue = localized;
	} 
	return retValue;
};

// Load page for the first time
function init() {
	var buffZoom = parseInt(getCookie("weather_zoom"));
	var buffLat = parseFloat(getCookie("weather_lat"));
	var buffLon = parseFloat(getCookie("weather_lon"));
	if (buffZoom != -1) {
		zoom = buffZoom;
	}
	if (buffLat != -1 && buffLon != -1) {
		lat = buffLat;
		lon = buffLon;
	}
	fillTimeDiv();
	drawmap();
	setLanguageStrings ();
	showWind();
	document.getElementById("timeLayer1").style.background = "#ADD8E6";
	document.getElementById("checkPressure").checked = false;
	document.getElementById("checkAirTemperature").checked = false;
	document.getElementById("checkPrecipitation").checked = false;
	document.getElementById("checkSignificantWaveHeight").checked = false;
}

// Add translation to dialogs
function setLanguageStrings () {
	document.getElementById("menu_nautical_chart").innerHTML = localize("%nautical_chart", "Nautical Chart");
	document.getElementById("menu_wind").innerHTML = localize("%wind", "Wind");
	document.getElementById("menu_air_pressure").innerHTML = localize("%air_pressure", "Air pressure");
	document.getElementById("menu_air_temperature").innerHTML = localize("%temperature", "Temperature");
	document.getElementById("menu_precipitation").innerHTML = localize("%precipitation", "Precipitation");
	document.getElementById("menu_wave_height").innerHTML = localize("%wave_height", "Wave height");
	document.getElementById("menu_help").innerHTML =  localize("%help", "Help");
}

// Show dialog window
function showActionDialog(header, htmlText, close_button, download_button) {
	var content = "<table border=\"0\" cellspacing=\"0\" cellpadding=\"4\">";
	content += "<tr bgcolor=\"#CAE1FF\"><td align=\"left\" valign=\"top\"><b>" + header + "</b></td><td align=\"right\" valign=\"top\"><img src=\"./resources/dialog/close.png\" onClick=\"";
	if (close_button) {
		 content += close_button;
	} else {
		 content += "closeActionDialog()";
	}
	content += "\"></td></tr>";
	content += "<tr><td colspan=\"2\">" + htmlText + "</td></tr>";
	content += "<tr><td>";
	if (download_button) {
		content += "<input type=\"button\" id=\"buttonActionDlgDownload\" value=\"" + localize('%download', 'Download') + ":\" onclick=\"" + download_button + "\" disabled=\"true\">";
	}
	if (close_button) {
		content +="</td><td align=\"right\" valign=\"bottom\"><input type=\"button\" id=\"buttonMapClose\" value=\"" +  localize("%close", "Close") + "\" onclick=\"" + close_button + ";\"></td></tr>";
	} else {
		content +="</td><td align=\"right\" valign=\"bottom\"><input type=\"button\" id=\"buttonMapClose\" value=\"" +  localize("%close", "Close") + "\" onclick=\"closeActionDialog();\"></td></tr>";
	}
	content += "</table>";
	placeDiv("actionDialog", 12, 55)
	document.getElementById("timemenu").style.visibility = 'hidden';
	document.getElementById("actionDialog").style.visibility = 'visible';
	document.getElementById("actionDialog").innerHTML = content;
}

// Hide dialog window
function closeActionDialog() {
	document.getElementById("timemenu").style.visibility = 'visible';
	document.getElementById("actionDialog").style.visibility = 'hidden';
}

function drawmap() {
	map = new OpenLayers.Map('map', {
		projection: projMerc,
		displayProjection: proj4326,
		eventListeners: {
			"moveend": mapEventMove,
			"zoomend": mapEventZoom
		},
		controls: [
			new OpenLayers.Control.MousePositionDM(),
			new OpenLayers.Control.OverviewMap(),
			new OpenLayers.Control.Navigation({zoomWheelEnabled: false})],
			maxExtent:
			new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
		numZoomLevels: 3,
		maxResolution: 156543,
		units: 'meters'
	});

	// Add Layers to map-------------------------------------------------------------------------------------------------------
	// Mapnik
	var layer_mapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
	// Wind layers
	layer_weather_wind1 = new OpenLayers.Layer.TMS("Wind12", "http://www.openportguide.org/tiles/actual/wind_vector/5/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_wind2 = new OpenLayers.Layer.TMS("Wind18", "http://www.openportguide.org/tiles/actual/wind_vector/7/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_wind3 = new OpenLayers.Layer.TMS("Wind24", "http://www.openportguide.org/tiles/actual/wind_vector/9/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_wind4 = new OpenLayers.Layer.TMS("Wind30", "http://www.openportguide.org/tiles/actual/wind_vector/11/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_wind5 = new OpenLayers.Layer.TMS("Wind42", "http://www.openportguide.org/tiles/actual/wind_vector/15/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_wind6 = new OpenLayers.Layer.TMS("Wind54", "http://www.openportguide.org/tiles/actual/wind_vector/19/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_wind7 = new OpenLayers.Layer.TMS("Wind66", "http://www.openportguide.org/tiles/actual/wind_vector/23/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_wind8 = new OpenLayers.Layer.TMS("Wind78", "http://www.openportguide.org/tiles/actual/wind_vector/27/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	// Air pressure layers
	layer_weather_pressure1 = new OpenLayers.Layer.TMS("Wind12", "http://www.openportguide.org/tiles/actual/surface_pressure/5/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_pressure2 = new OpenLayers.Layer.TMS("Wind18", "http://www.openportguide.org/tiles/actual/surface_pressure/7/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_pressure3 = new OpenLayers.Layer.TMS("Wind24", "http://www.openportguide.org/tiles/actual/surface_pressure/9/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_pressure4 = new OpenLayers.Layer.TMS("Wind30", "http://www.openportguide.org/tiles/actual/surface_pressure/11/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_pressure5 = new OpenLayers.Layer.TMS("Wind42", "http://www.openportguide.org/tiles/actual/surface_pressure/15/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_pressure6 = new OpenLayers.Layer.TMS("Wind54", "http://www.openportguide.org/tiles/actual/surface_pressure/19/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_pressure7 = new OpenLayers.Layer.TMS("Wind66", "http://www.openportguide.org/tiles/actual/surface_pressure/23/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_pressure8 = new OpenLayers.Layer.TMS("Wind78", "http://www.openportguide.org/tiles/actual/surface_pressure/27/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	// Temperature layers
	layer_weather_air_temperature1 = new OpenLayers.Layer.TMS("Wind12", "http://www.openportguide.org/tiles/actual/air_temperature/5/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_air_temperature2 = new OpenLayers.Layer.TMS("Wind18", "http://www.openportguide.org/tiles/actual/air_temperature/7/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_air_temperature3 = new OpenLayers.Layer.TMS("Wind24", "http://www.openportguide.org/tiles/actual/air_temperature/9/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_air_temperature4 = new OpenLayers.Layer.TMS("Wind30", "http://www.openportguide.org/tiles/actual/air_temperature/11/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_air_temperature5 = new OpenLayers.Layer.TMS("Wind42", "http://www.openportguide.org/tiles/actual/air_temperature/15/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_air_temperature6 = new OpenLayers.Layer.TMS("Wind54", "http://www.openportguide.org/tiles/actual/air_temperature/19/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_air_temperature7 = new OpenLayers.Layer.TMS("Wind66", "http://www.openportguide.org/tiles/actual/air_temperature/23/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_air_temperature8 = new OpenLayers.Layer.TMS("Wind78", "http://www.openportguide.org/tiles/actual/air_temperature/27/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	// Precipitation layers
	layer_weather_precipitation1 = new OpenLayers.Layer.TMS("Wind12", "http://www.openportguide.org/tiles/actual/precipitation/5/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_precipitation2 = new OpenLayers.Layer.TMS("Wind18", "http://www.openportguide.org/tiles/actual/precipitation/7/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_precipitation3 = new OpenLayers.Layer.TMS("Wind24", "http://www.openportguide.org/tiles/actual/precipitation/9/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_precipitation4 = new OpenLayers.Layer.TMS("Wind30", "http://www.openportguide.org/tiles/actual/precipitation/11/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_precipitation5 = new OpenLayers.Layer.TMS("Wind42", "http://www.openportguide.org/tiles/actual/precipitation/15/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_precipitation6 = new OpenLayers.Layer.TMS("Wind54", "http://www.openportguide.org/tiles/actual/precipitation/19/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_precipitation7 = new OpenLayers.Layer.TMS("Wind66", "http://www.openportguide.org/tiles/actual/precipitation/23/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_precipitation8 = new OpenLayers.Layer.TMS("Wind78", "http://www.openportguide.org/tiles/actual/precipitation/27/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	// Temperature layers
	layer_weather_significant_wave_height1 = new OpenLayers.Layer.TMS("Wind12", "http://www.openportguide.org/tiles/actual/significant_wave_height/5/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_significant_wave_height2 = new OpenLayers.Layer.TMS("Wind18", "http://www.openportguide.org/tiles/actual/significant_wave_height/7/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_significant_wave_height3 = new OpenLayers.Layer.TMS("Wind24", "http://www.openportguide.org/tiles/actual/significant_wave_height/9/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_significant_wave_height4 = new OpenLayers.Layer.TMS("Wind30", "http://www.openportguide.org/tiles/actual/significant_wave_height/11/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_significant_wave_height5 = new OpenLayers.Layer.TMS("Wind42", "http://www.openportguide.org/tiles/actual/significant_wave_height/15/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_significant_wave_height6 = new OpenLayers.Layer.TMS("Wind54", "http://www.openportguide.org/tiles/actual/significant_wave_height/19/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_significant_wave_height7 = new OpenLayers.Layer.TMS("Wind66", "http://www.openportguide.org/tiles/actual/significant_wave_height/23/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	layer_weather_significant_wave_height8 = new OpenLayers.Layer.TMS("Wind78", "http://www.openportguide.org/tiles/actual/significant_wave_height/27/",
	{ type: 'png', getURL:getTileURL, isBaseLayer:false, visibility: false, displayOutsideMaxExtent:true});
	map.addLayers([layer_mapnik, layer_weather_wind1, layer_weather_wind2, layer_weather_wind3, layer_weather_wind4, layer_weather_wind5, layer_weather_wind6, layer_weather_wind7,
		layer_weather_wind8, layer_weather_pressure1, layer_weather_pressure2, layer_weather_pressure3, layer_weather_pressure4, layer_weather_pressure5, layer_weather_pressure6, layer_weather_pressure7, layer_weather_pressure8,
		layer_weather_air_temperature1, layer_weather_air_temperature2, layer_weather_air_temperature3, layer_weather_air_temperature4, layer_weather_air_temperature5, layer_weather_air_temperature6, layer_weather_air_temperature7, layer_weather_air_temperature8,
		layer_weather_precipitation1, layer_weather_precipitation2, layer_weather_precipitation3, layer_weather_precipitation4, layer_weather_precipitation5, layer_weather_precipitation6, layer_weather_precipitation7, layer_weather_precipitation8,
		layer_weather_significant_wave_height1, layer_weather_significant_wave_height2, layer_weather_significant_wave_height3, layer_weather_significant_wave_height4, layer_weather_significant_wave_height5, layer_weather_significant_wave_height6, layer_weather_significant_wave_height7, layer_weather_significant_wave_height8]);

	if (!map.getCenter()) {
		jumpTo(lon, lat, zoom);
	}
}

// Map event listener moved
function mapEventMove(event) {
	// Set cookie for remembering lat lon values
	setCookie("weather_lat", y2lat(map.getCenter().lat).toFixed(5));
	setCookie("weather_lon", x2lon(map.getCenter().lon).toFixed(5));
}

// Map event listener Zoomed
function mapEventZoom(event) {
	zoom = map.getZoom();
	if (zoom >= 8) {
		map.zoomTo(7)
	} else if (zoom <= 3) {
		map.zoomTo(4)
	}
	// Set cookie for remembering #zoomlevel
	setCookie("weather_zoom",zoom);
}

function zoomIn() {
	if (zoom <= 6) {
		map.zoomIn();
	}
}

function zoomOut() {
	if (zoom >= 5) {
		map.zoomOut();
	}
}

function showWind() {
	if (!showWindLayer) {
		document.getElementById("checkWind").checked = true;
		document.getElementById("comment").style.visibility = "visible";
		document.getElementById("buttonWind").style.background = "#ADD8E6";
		setWindLayerVisible();
		showWindLayer = true;
	} else {
		document.getElementById("checkWind").checked = false;
		document.getElementById("comment").style.visibility = "hidden";
		clearWindLayerVisibility();
		showWindLayer = false;
	}
}

function showPressure() {
	if (!showPressureLayer) {
		document.getElementById("checkPressure").checked = true;
		document.getElementById("buttonPressure").style.background = "#ADD8E6";
		setPressureLayerVisible();
		showPressureLayer = true;
	} else {
		document.getElementById("checkPressure").checked = false;
		clearPressureLayerVisibility();
		showPressureLayer = false;
	}
}

function showAirTemperature() {
	if (!showAirTemperatureLayer) {
		document.getElementById("checkAirTemperature").checked = true;
		document.getElementById("buttonAirTemperature").style.background = "#ADD8E6";
		setAirTemperatureLayerVisible();
		showAirTemperatureLayer = true;
	} else {
		document.getElementById("checkAirTemperature").checked = false;
		clearAirTemperatureLayerVisibility();
		showAirTemperatureLayer = false;
	}
}

function showPrecipitation() {
	if (!showPrecipitationLayer) {
		document.getElementById("checkPrecipitation").checked = true;
		document.getElementById("buttonPrecipitation").style.background = "#ADD8E6";
		setPrecipitationLayerVisible();
		showPrecipitationLayer = true;
	} else {
		document.getElementById("checkPrecipitation").checked = false;
		clearPrecipitationLayerVisibility();
		showPrecipitationLayer = false;
	}
}

function showSignificantWaveHeight() {
	if (!showSignificantWaveHeightLayer) {
		document.getElementById("checkSignificantWaveHeight").checked = true;
		document.getElementById("buttonSignificantWaveHeight").style.background = "#ADD8E6";
		setSignificantWaveHeightLayerVisible();
		showSignificantWaveHeightLayer = true;
	} else {
		document.getElementById("checkSignificantWaveHeight").checked = false;
		clearSignificantWaveHeightLayerVisibility();
		showSignificantWaveHeightLayer = false;
	}
}

function setLayerVisible(number) {
	document.getElementById("timeLayer" + layerNumber).style.background = "#FFFFFF";
	layerNumber = number;
	document.getElementById("timeLayer" + layerNumber).style.background = "#ADD8E6";
	if (showWindLayer) {
		setWindLayerVisible();
	}
	if (showPressureLayer) {
		setPressureLayerVisible();
	}
	if (showAirTemperatureLayer) {
		setAirTemperatureLayerVisible();
	}
	if (showPrecipitationLayer) {
		setPrecipitationLayerVisible();
	}
	if (showSignificantWaveHeightLayer) {
		setSignificantWaveHeightLayerVisible();
	}
}

function setWindLayerVisible() {
	clearWindLayerVisibility();
	switch (layerNumber) {
		case 1:
			layer_weather_wind1.setVisibility(true);
			break;
		case 2:
			layer_weather_wind2.setVisibility(true);
			break;
		case 3:
			layer_weather_wind3.setVisibility(true);
			break;
		case 4:
			layer_weather_wind4.setVisibility(true);
			break;
		case 5:
			layer_weather_wind5.setVisibility(true);
			break;
		case 6:
			layer_weather_wind6.setVisibility(true);
			break;
		case 7:
			layer_weather_wind7.setVisibility(true);
			break;
		case 8:
			layer_weather_wind8.setVisibility(true);
			break;
	}
}

function setPressureLayerVisible() {
	clearPressureLayerVisibility();
	switch (layerNumber) {
		case 1:
			layer_weather_pressure1.setVisibility(true);
			break;
		case 2:
			layer_weather_pressure2.setVisibility(true);
			break;
		case 3:
			layer_weather_pressure3.setVisibility(true);
			break;
		case 4:
			layer_weather_pressure4.setVisibility(true);
			break;
		case 5:
			layer_weather_pressure5.setVisibility(true);
			break;
		case 6:
			layer_weather_pressure6.setVisibility(true);
			break;
		case 7:
			layer_weather_pressure7.setVisibility(true);
			break;
		case 8:
			layer_weather_pressure8.setVisibility(true);
			break;
	}
}

function setAirTemperatureLayerVisible() {
	clearAirTemperatureLayerVisibility();
	switch (layerNumber) {
		case 1:
			layer_weather_air_temperature1.setVisibility(true);
			break;
		case 2:
			layer_weather_air_temperature2.setVisibility(true);
			break;
		case 3:
			layer_weather_air_temperature3.setVisibility(true);
			break;
		case 4:
			layer_weather_air_temperature4.setVisibility(true);
			break;
		case 5:
			layer_weather_air_temperature5.setVisibility(true);
			break;
		case 6:
			layer_weather_air_temperature6.setVisibility(true);
			break;
		case 7:
			layer_weather_air_temperature7.setVisibility(true);
			break;
		case 8:
			layer_weather_air_temperature8.setVisibility(true);
			break;
	}
}

function setPrecipitationLayerVisible() {
	clearPrecipitationLayerVisibility();
	switch (layerNumber) {
		case 1:
			layer_weather_precipitation1.setVisibility(true);
			break;
		case 2:
			layer_weather_precipitation2.setVisibility(true);
			break;
		case 3:
			layer_weather_precipitation3.setVisibility(true);
			break;
		case 4:
			layer_weather_precipitation4.setVisibility(true);
			break;
		case 5:
			layer_weather_precipitation5.setVisibility(true);
			break;
		case 6:
			layer_weather_precipitation6.setVisibility(true);
			break;
		case 7:
			layer_weather_precipitation7.setVisibility(true);
			break;
		case 8:
			layer_weather_precipitation8.setVisibility(true);
			break;
	}
}

function setSignificantWaveHeightLayerVisible() {
	clearSignificantWaveHeightLayerVisibility();
	switch (layerNumber) {
		case 1:
			layer_weather_significant_wave_height1.setVisibility(true);
			break;
		case 2:
			layer_weather_significant_wave_height2.setVisibility(true);
			break;
		case 3:
			layer_weather_significant_wave_height3.setVisibility(true);
			break;
		case 4:
			layer_weather_significant_wave_height4.setVisibility(true);
			break;
		case 5:
			layer_weather_significant_wave_height5.setVisibility(true);
			break;
		case 6:
			layer_weather_significant_wave_height6.setVisibility(true);
			break;
		case 7:
			layer_weather_significant_wave_height7.setVisibility(true);
			break;
		case 8:
			layer_weather_significant_wave_height8.setVisibility(true);
			break;
	}
}

function clearWindLayerVisibility() {
	layer_weather_wind1.setVisibility(false);
	layer_weather_wind2.setVisibility(false);
	layer_weather_wind3.setVisibility(false);
	layer_weather_wind4.setVisibility(false);
	layer_weather_wind5.setVisibility(false);
	layer_weather_wind6.setVisibility(false);
	layer_weather_wind7.setVisibility(false);
	layer_weather_wind8.setVisibility(false);
}

function clearPressureLayerVisibility() {
	layer_weather_pressure1.setVisibility(false);
	layer_weather_pressure2.setVisibility(false);
	layer_weather_pressure3.setVisibility(false);
	layer_weather_pressure4.setVisibility(false);
	layer_weather_pressure5.setVisibility(false);
	layer_weather_pressure6.setVisibility(false);
	layer_weather_pressure7.setVisibility(false);
	layer_weather_pressure8.setVisibility(false);
}

function clearAirTemperatureLayerVisibility() {
	layer_weather_air_temperature1.setVisibility(false);
	layer_weather_air_temperature2.setVisibility(false);
	layer_weather_air_temperature3.setVisibility(false);
	layer_weather_air_temperature4.setVisibility(false);
	layer_weather_air_temperature5.setVisibility(false);
	layer_weather_air_temperature6.setVisibility(false);
	layer_weather_air_temperature7.setVisibility(false);
	layer_weather_air_temperature8.setVisibility(false);
}

function clearPrecipitationLayerVisibility() {
	layer_weather_precipitation1.setVisibility(false);
	layer_weather_precipitation2.setVisibility(false);
	layer_weather_precipitation3.setVisibility(false);
	layer_weather_precipitation4.setVisibility(false);
	layer_weather_precipitation5.setVisibility(false);
	layer_weather_precipitation6.setVisibility(false);
	layer_weather_precipitation7.setVisibility(false);
	layer_weather_precipitation8.setVisibility(false);
}

function clearSignificantWaveHeightLayerVisibility() {
	layer_weather_significant_wave_height1.setVisibility(false);
	layer_weather_significant_wave_height2.setVisibility(false);
	layer_weather_significant_wave_height3.setVisibility(false);
	layer_weather_significant_wave_height4.setVisibility(false);
	layer_weather_significant_wave_height5.setVisibility(false);
	layer_weather_significant_wave_height6.setVisibility(false);
	layer_weather_significant_wave_height7.setVisibility(false);
	layer_weather_significant_wave_height8.setVisibility(false);
}