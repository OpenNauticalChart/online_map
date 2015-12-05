// Main settings
var version = "0.0.4.9";
var date = "05.12.2015";

// Map settings
var map;
var popup;

// Position and zoomlevel of the map  (will be overriden with permalink parameters or cookies)
var lon = 11.6540;
var lat = 54.1530;
var zoom = 10;

// Layers
var layer_seamarks = -1;
var layer_grid = -1;
var layer_download = -1;
var layer_nautical_route = -1;

// Select controls
var selectControl;

// Look up translation for given string
var localize = function (string, fallback) {
	var localized = string.toLocaleString();
	var retValue = fallback;
	if (localized !== string) {
		retValue = localized;
	} 
	return retValue;
};

// Load map for the first time
function init() {
	var buffZoom = -1;
	var buffLat = -1;
	var buffLon = -1;
	if (getArgument("permalink") == "true") {
		buffZoom = parseInt(getArgument("zoom"));
		buffLat = parseFloat(getArgument("lat"));
		buffLon = parseFloat(getArgument("lon"));
	} else {
		buffZoom = parseInt(getCookie("zoom"));
		buffLat = parseFloat(getCookie("lat"));
		buffLon = parseFloat(getCookie("lon"));
	}
	if (buffZoom != -1) {
		zoom = buffZoom;
	}
	if (buffLat != -1 && buffLon != -1) {
		lat = buffLat;
		lon = buffLon;
	}
	drawmap();
	setLanguageStrings ();
	setLayerVisibility();
}

// Add translation to dialogs
function setLanguageStrings () {
	document.getElementById("menu_help").innerHTML = localize("%help", "Help");
	document.getElementById("menu_help_about").innerHTML = localize("%about", "About");
	document.getElementById("menu_help_license").innerHTML = localize("%license", "License");
	document.getElementById("menu_help_map_key").innerHTML = localize("%map_key", "Map key");
	document.getElementById("menu_help_report_bugs").innerHTML = localize("%report_bugs", "Report bugs");
	document.getElementById("menu_layer_coordinate_grid").innerHTML = localize("%coordinate_grid", "Coordinate grid");
	document.getElementById("menu_layer_seamarks").innerHTML = localize("%seamarks", "Sea marks");
	//document.getElementById("menu_layer_tidal_scale").innerHTML = localize("%tidal_scale", "Tidal scale");
	document.getElementById("menu_layer_weather").innerHTML = localize("%weather", "Weather");
	document.getElementById("menu_tools").innerHTML = localize("%tools", "Tools");
	document.getElementById("menu_tools_map_download").innerHTML = localize("%map_download", "Download chart");
	//document.getElementById("menu_tools_permalink").innerHTML = localize("%permalink", "Permalink");
	document.getElementById("menu_tools_trip_planner").innerHTML = localize("%trip_planner", "Trip planner");
	document.getElementById("menu_view").innerHTML = localize("%view", "View");
}

// Set visibility of the layers
function setLayerVisibility() {
	if (getArgument("permalink") == "true") {
		if (getArgument(layer_seamarks.name) == "false") {
			layer_seamarks.setVisibility(false);
		}
		if (getArgument(layer_grid.name) == "false") {
			layer_grid.setVisibility(false);
		}
		if (getArgument("map_download") == "true") {
			addMapDownload();
		}
	} else {
		if (getCookie(layer_seamarks.name) == "false") {
			layer_seamarks.setVisibility(false);
		}
		if (getCookie(layer_grid.name) == "false") {
			layer_grid.setVisibility(false);
		}
	}
	setLayerCheckBoxes();
}

function setLayerCheckBoxes() {
	document.getElementById("checkLayerSeaMarks").checked = (layer_seamarks.getVisibility() === true);
	document.getElementById("checkLayerCordinateGrid").checked = (layer_grid.getVisibility() === true);
}

// Show dialog window
function showActionDialog(header, htmlText, close_button, download_button, clear_button) {
	var max_height = window.innerHeight  - 130;
	var max_width = window.innerWidth - 100;
	//alert(max_height);
	var content = "<table border=\"0\" cellspacing=\"0\" cellpadding=\"4\">";
	content += "<tr bgcolor=\"#CAE1FF\"><td align=\"left\" valign=\"top\"><b>" + header + "</b></td><td align=\"right\" valign=\"top\"><img src=\"./resources/dialog/close.png\" onClick=\"";
	if (close_button) {
		 content += close_button;
	} else {
		 content += "closeActionDialog()";
	}
	content += "\"></td></tr>";
	content += "<tr><td colspan=\"2\"><div style=\"max-height:" + max_height + "px; max-width:" + max_width + "px; overflow:auto;\">" + htmlText + "</div></td></tr>";
	content += "<tr><td>";
	if (download_button) {
		content += "<input type=\"button\" id=\"buttonActionDlgDownload\" value=\"" + localize('%download', 'Download') + "\" onclick=\"" + download_button + "\" disabled=\"true\">";
	}
	if (clear_button) {
		content += "&nbsp;<input type=\"button\" id=\"buttonActionDlgClear\" value=\"" + localize('%clear', 'Clear') + "\" onclick=\"" + clear_button + "\" disabled=\"true\">";
	}
	if (close_button) {
		content +="</td><td align=\"right\" valign=\"bottom\"><input type=\"button\" id=\"buttonMapClose\" value=\"" +  localize("%close", "Close") + "\" onclick=\"" + close_button + ";\"></td></tr>";
	} else {
		content +="</td><td align=\"right\" valign=\"bottom\"><input type=\"button\" id=\"buttonMapClose\" value=\"" +  localize("%close", "Close") + "\" onclick=\"closeActionDialog();\"></td></tr>";
	}
	content += "</table>";
	document.getElementById("actionDialog").style.visibility = 'visible';
	document.getElementById("actionDialog").innerHTML = content;
}

// Hide dialog window
function closeActionDialog() {
	document.getElementById("actionDialog").style.visibility = 'hidden';
}

// Toggle visibility of given layer
function showLayer(layer) {
	if (layer.visibility) {
		layer.setVisibility(false);
		setCookie( layer.name, "false");
	} else {
		layer.setVisibility(true);
		setCookie( layer.name, "true");
	}
	setLayerCheckBoxes();
}

function drawmap() {
	map = new OpenLayers.Map('map', {
		projection: projMerc,
		displayProjection: proj4326,
		eventListeners: {
			click: mapEventClick,
			moveend: mapEventMove,
			zoomend: mapEventZoom
		},
		controls: [
			new OpenLayers.Control.Navigation(),
			new OpenLayers.Control.ScaleLine({topOutUnits : "nmi", bottomOutUnits: "km", topInUnits: 'nmi', bottomInUnits: 'km', maxWidth: '40'}),
			new OpenLayers.Control.MousePositionDM(),
			new OpenLayers.Control.OverviewMap(),
			new OpenLayers.Control.PanZoomBar()],
			maxExtent:
			new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
		numZoomLevels: 18,
		maxResolution: 156543,
		units: 'meters'
	});

	// Select feature ---------------------------------------------------------------------------------------------------------
	// (only one SelectFeature per map is allowed)
	selectControl = new OpenLayers.Control.SelectFeature([],{
		hover:true,
		popup:null,
		addLayer:function(layer){
			var layers = this.layers;
			if (layers) {
				layers.push(layer);
			} else {
				layers = [
					layer
				];
			}
			this.setLayer(layers);
		},
		removePopup:function(){
			if (this.popup) {
				this.map.removePopup(this.popup);
				this.popup.destroy();
				this.popup = null;
			}
		}
	});

	// Add Layers to map-------------------------------------------------------------------------------------------------------
	var layer_mapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
	layer_seamarks = new OpenLayers.Layer.TMS("seamarks", "http://t1.openseamap.org/seamark/", { layerId: 3, numZoomLevels: 19, type: 'png', getURL:getTileURL, isBaseLayer:false, displayOutsideMaxExtent:true});
	layer_grid = new OpenLayers.Layer.GridWGS("coordinate_grid", {visibility: true, zoomUnits: zoomUnits	});
	map.addLayers([layer_mapnik, layer_seamarks, layer_grid]);
	if (!map.getCenter()) {
		jumpTo(lon, lat, zoom);
	}
	map.addControl(selectControl);
	selectControl.activate();
}

function mapEventClick(event) {
	if (zoom >= 13) {
		var bbOffset = 0.001;
		var clickLonLat = map.getLonLatFromViewPortPx(event.xy).transform( projMerc, proj4326);
		var popupText = getNodeInformation(clickLonLat.lat - bbOffset, clickLonLat.lon - bbOffset, clickLonLat.lat + bbOffset, clickLonLat.lon +bbOffset);
		if (popupText != "-1") {
			popup = new OpenLayers.Popup.FramedCloud("info",
				map.getLonLatFromViewPortPx(event.xy),
				null,
				popupText,
				null,
				true);
			map.addPopup(popup);
		}
	}
}

// Map event listener moved
function mapEventMove(event) {
	// Set cookies for remembering lat lon values
	setCookie("lat", y2lat(map.getCenter().lat).toFixed(5));
	setCookie("lon", x2lon(map.getCenter().lon).toFixed(5));
}

// Map event listener Zoomed
function mapEventZoom(event) {
	zoom = map.getZoom();
	// Set cookie for remembering zoomlevel
	setCookie("zoom",zoom);
	// Update download layer if exists
	if (layer_download != -1) {
		addDownloadlayer();
	}
}

// Create a permalink and open it in the browser
function createPermalink() {
	var mapPermalink = location.protocol + '//' + location.host + location.pathname;
	mapPermalink += "?permalink=true&zoom=" + zoom + "&lat=" +lat + "&lon=" + lon;
	mapPermalink += "&" + layer_seamarks.name + "=" + document.getElementById("checkLayerSeaMarks").checked;
	mapPermalink += "&" + layer_grid.name + "=" + document.getElementById("checkLayerCordinateGrid").checked;
	if (layer_download != -1) {
		mapPermalink += "&map_download=true"
	}
	window.location.href = mapPermalink;
}
