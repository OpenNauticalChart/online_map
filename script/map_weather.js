
// Main settings
var version = "0.0.4";
var date = "08.03.2016";

// The map
var map;

// Tile server url 
var tileUrl = "http://weather.openportguide.de/tiles/actual/";

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
	var buffZoom = parseInt(getCookie("zoom"));
	var buffLat = parseFloat(getCookie("lat"));
	var buffLon = parseFloat(getCookie("lon"));
	if (buffZoom != -1) {
		if (buffZoom <= 3)  {
			buffZoom = 4;
		} else if (buffZoom >= 8) {
			buffZoom = 7;
		} 
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
	placeDiv("actionDialog", 50, 55)
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
	map = new ol.Map({
		controls: [
			new ol.control.Zoom(),
			new ol.control.ZoomSlider()
		],
		target: 'map', 
		renderer: 'canvas', 
		layers: [
			// Add base map from OpenStreetMap source
			new ol.layer.Tile({
				source: new ol.source.OSM()
			})
		],

		view: new ol.View({
			minZoom: 4,
			maxZoom: 7,
			center: ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'),
			zoom: zoom
		})
	});
	

	// Add weather layers to map-------------------------------------------------------------------------------------------------------
	// Wind layers
	 map.addLayer(layer_weather_wind1 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/wind_stream/5/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_wind2 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/wind_stream/7/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_wind3 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/wind_stream/9/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_wind4 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/wind_stream/11/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_wind5 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/wind_stream/15/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_wind6 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/wind_stream/19/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_wind7 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/wind_stream/23/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_wind8 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/wind_streamr/27/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	// Air pressure layers
	 map.addLayer(layer_weather_pressure1 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/surface_pressure/5/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_pressure2 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/surface_pressure/7/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_pressure3 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/surface_pressure/9/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_pressure4 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/surface_pressure/11/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_pressure5 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/surface_pressure/15/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_pressure6 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/surface_pressure/19/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_pressure7 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/surface_pressure/23/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_pressure8 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/surface_pressure/27/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	// Temperature layers
	 map.addLayer(layer_weather_air_temperature1 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/air_temperature/5/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_air_temperature2 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/air_temperature/7/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_air_temperature3 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/air_temperature/9/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_air_temperature4 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/air_temperature/11/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_air_temperature5 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/air_temperature/15/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_air_temperature6 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/air_temperature/19/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_air_temperature7 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/air_temperature/23/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_air_temperature8 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/air_temperature/27/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	// Precipitation layers
	 map.addLayer(layer_weather_precipitation1 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/precipitation/5/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_precipitation2 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/precipitation/7/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_precipitation3 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/precipitation/9/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_precipitation4 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/precipitation/11/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_precipitation5 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/precipitation/15/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_precipitation6 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/precipitation/19/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_precipitation7 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/precipitation/23/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_precipitation8 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/precipitation/27/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	// Wave height layers
	 map.addLayer(layer_weather_significant_wave_height1 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/significant_wave_height/5/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_significant_wave_height2 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/significant_wave_height/7/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_significant_wave_height3 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/significant_wave_height/9/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_significant_wave_height4 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/significant_wave_height/11/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_significant_wave_height5 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/significant_wave_height/15/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_significant_wave_height6 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/significant_wave_height/19/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_significant_wave_height7 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/significant_wave_height/23/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
	 map.addLayer(layer_weather_significant_wave_height8 = new ol.layer.Tile({ source: new ol.source.TileImage({url: tileUrl +'/significant_wave_height/27/{z}/{x}/{y}.png'}), isBaseLayer: false, visible: false }));
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
			layer_weather_wind1.setVisible(true);
			break;
		case 2:
			layer_weather_wind2.setVisible(true);
			break;
		case 3:
			layer_weather_wind3.setVisible(true);
			break;
		case 4:
			layer_weather_wind4.setVisible(true);
			break;
		case 5:
			layer_weather_wind5.setVisible(true);
			break;
		case 6:
			layer_weather_wind6.setVisible(true);
			break;
		case 7:
			layer_weather_wind7.setVisible(true);
			break;
		case 8:
			layer_weather_wind8.setVisible(true);
			break;
	}
}

function setPressureLayerVisible() {
	clearPressureLayerVisibility();
	switch (layerNumber) {
		case 1:
			layer_weather_pressure1.setVisible(true);
			break;
		case 2:
			layer_weather_pressure2.setVisible(true);
			break;
		case 3:
			layer_weather_pressure3.setVisible(true);
			break;
		case 4:
			layer_weather_pressure4.setVisible(true);
			break;
		case 5:
			layer_weather_pressure5.setVisible(true);
			break;
		case 6:
			layer_weather_pressure6.setVisible(true);
			break;
		case 7:
			layer_weather_pressure7.setVisible(true);
			break;
		case 8:
			layer_weather_pressure8.setVisible(true);
			break;
	}
}

function setAirTemperatureLayerVisible() {
	clearAirTemperatureLayerVisibility();
	switch (layerNumber) {
		case 1:
			layer_weather_air_temperature1.setVisible(true);
			break;
		case 2:
			layer_weather_air_temperature2.setVisible(true);
			break;
		case 3:
			layer_weather_air_temperature3.setVisible(true);
			break;
		case 4:
			layer_weather_air_temperature4.setVisible(true);
			break;
		case 5:
			layer_weather_air_temperature5.setVisible(true);
			break;
		case 6:
			layer_weather_air_temperature6.setVisible(true);
			break;
		case 7:
			layer_weather_air_temperature7.setVisible(true);
			break;
		case 8:
			layer_weather_air_temperature8.setVisible(true);
			break;
	}
}

function setPrecipitationLayerVisible() {
	clearPrecipitationLayerVisibility();
	switch (layerNumber) {
		case 1:
			layer_weather_precipitation1.setVisible(true);
			break;
		case 2:
			layer_weather_precipitation2.setVisible(true);
			break;
		case 3:
			layer_weather_precipitation3.setVisible(true);
			break;
		case 4:
			layer_weather_precipitation4.setVisible(true);
			break;
		case 5:
			layer_weather_precipitation5.setVisible(true);
			break;
		case 6:
			layer_weather_precipitation6.setVisible(true);
			break;
		case 7:
			layer_weather_precipitation7.setVisible(true);
			break;
		case 8:
			layer_weather_precipitation8.setVisible(true);
			break;
	}
}

function setSignificantWaveHeightLayerVisible() {
	clearSignificantWaveHeightLayerVisibility();
	switch (layerNumber) {
		case 1:
			layer_weather_significant_wave_height1.setVisible(true);
			break;
		case 2:
			layer_weather_significant_wave_height2.setVisible(true);
			break;
		case 3:
			layer_weather_significant_wave_height3.setVisible(true);
			break;
		case 4:
			layer_weather_significant_wave_height4.setVisible(true);
			break;
		case 5:
			layer_weather_significant_wave_height5.setVisible(true);
			break;
		case 6:
			layer_weather_significant_wave_height6.setVisible(true);
			break;
		case 7:
			layer_weather_significant_wave_height7.setVisible(true);
			break;
		case 8:
			layer_weather_significant_wave_height8.setVisible(true);
			break;
	}
}

function clearWindLayerVisibility() {
	layer_weather_wind1.setVisible(false);
	layer_weather_wind2.setVisible(false);
	layer_weather_wind3.setVisible(false);
	layer_weather_wind4.setVisible(false);
	layer_weather_wind5.setVisible(false);
	layer_weather_wind6.setVisible(false);
	layer_weather_wind7.setVisible(false);
	layer_weather_wind8.setVisible(false);
}

function clearPressureLayerVisibility() {
	layer_weather_pressure1.setVisible(false);
	layer_weather_pressure2.setVisible(false);
	layer_weather_pressure3.setVisible(false);
	layer_weather_pressure4.setVisible(false);
	layer_weather_pressure5.setVisible(false);
	layer_weather_pressure6.setVisible(false);
	layer_weather_pressure7.setVisible(false);
	layer_weather_pressure8.setVisible(false);
}

function clearAirTemperatureLayerVisibility() {
	layer_weather_air_temperature1.setVisible(false);
	layer_weather_air_temperature2.setVisible(false);
	layer_weather_air_temperature3.setVisible(false);
	layer_weather_air_temperature4.setVisible(false);
	layer_weather_air_temperature5.setVisible(false);
	layer_weather_air_temperature6.setVisible(false);
	layer_weather_air_temperature7.setVisible(false);
	layer_weather_air_temperature8.setVisible(false);
}

function clearPrecipitationLayerVisibility() {
	layer_weather_precipitation1.setVisible(false);
	layer_weather_precipitation2.setVisible(false);
	layer_weather_precipitation3.setVisible(false);
	layer_weather_precipitation4.setVisible(false);
	layer_weather_precipitation5.setVisible(false);
	layer_weather_precipitation6.setVisible(false);
	layer_weather_precipitation7.setVisible(false);
	layer_weather_precipitation8.setVisible(false);
}

function clearSignificantWaveHeightLayerVisibility() {
	layer_weather_significant_wave_height1.setVisible(false);
	layer_weather_significant_wave_height2.setVisible(false);
	layer_weather_significant_wave_height3.setVisible(false);
	layer_weather_significant_wave_height4.setVisible(false);
	layer_weather_significant_wave_height5.setVisible(false);
	layer_weather_significant_wave_height6.setVisible(false);
	layer_weather_significant_wave_height7.setVisible(false);
	layer_weather_significant_wave_height8.setVisible(false);
}