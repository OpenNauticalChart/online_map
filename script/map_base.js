// Main settings
var version = "0.0.3";
var date = "03.07.2014";

// Map settings
var map;
var popup;

// Position and zoomlevel of the map  (will be overriden with permalink parameters or cookies)
var lon = 11.6540;
var lat = 54.1530;
var zoom = 10;

// Layers
var layer_pois = -1;
var layer_seamarks = -1;
var layer_grid = -1;
var layer_download = -1;

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
	document.getElementById("menu_about").innerHTML = localize("%about", "About");
	document.getElementById("menu_help").innerHTML = localize("%help", "Help");
	document.getElementById("menu_layer_coordinate_grid").innerHTML = localize("%coordinate_grid", "Coordinate grid");
	document.getElementById("menu_layer_seamarks").innerHTML = localize("%seamarks", "Sea marks");
	document.getElementById("menu_layer_weather").innerHTML = localize("%weather", "Weather");
	document.getElementById("menu_license").innerHTML = localize("%license", "License");
	document.getElementById("menu_permalink").innerHTML = localize("%permalink", "Permalink");
	document.getElementById("menu_tools").innerHTML = localize("%tools", "Tools");
	document.getElementById("menu_tools_map_download").innerHTML = localize("%map_download", "Download chart");
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
function showActionDialog(header, htmlText, close_button, download_button) {
	var content = "<table border=\"0\" cellspacing=\"0\" cellpadding=\"4\">";
	content += "<tr bgcolor=\"#CAE1FF\"><td align=\"left\" valign=\"top\"><b>" + header + "</b></td><td align=\"right\" valign=\"top\"><img src=\"./resources/dialog/close.png\" onClick=\"closeActionDialog();\"></td></tr>";
	content += "<tr><td colspan=\"2\">" + htmlText + "</td></tr>";
	content += "<tr><td>";
	if (download_button) {
		content += "<input type=\"button\" id=\"buttonActionDlgDownload\" value=\"" + localize('%download', 'Download') + ":\" onclick=\"downloadMap()\" disabled=\"true\">";
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

// Show the license dialog
function showLicense() {
	var content = "<table border=\"0\" cellpadding=\"5\"><tr><td><img alt=\"CC by SA\" src=\"./resources/icons/CC-BY-SA_44px.png\" height=\"44\" border=\"0\"></td>";
	content  += "<td>" + localize("%license_dialog_onc", "ONC - Data can be used freely under the terms of the") + " <br><a href=\"http://creativecommons.org/licenses/by-sa/2.0\" target=\"_blank\">Creative Commons Attribution-ShareAlike 2.0 " +  localize('%license', 'License') + "</a></td>";
	content  += "</tr><tr><td height=\"5\" class=\"normal\" colspan=\"2\"><hr></td></tr><tr><td><img alt=\OSM-Logo\" src=\"resources/icons/OSM-Logo-44px.png\" height=\"44\" border=\"0\"></td>";
	content  += "<td>" + localize("%license_dialog_osm", "All base layer data originate from the") + " <a href=\"http://www.openstreetmap.org/copyright\" target=\"_blank\">OpenStreetMap-" +  localize('%project', 'Project') + "</a></td></tr>";
	showActionDialog(localize('%license', 'License'),  content);
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
			moveend: mapEventMove,
			zoomend: mapEventZoom,
			click: mapEventClick
		},
		controls: [
			new OpenLayers.Control.Navigation(),
			new OpenLayers.Control.ScaleLine({topOutUnits : "nmi", bottomOutUnits: "km", topInUnits: 'nmi', bottomInUnits: 'km', maxWidth: '40'}),
			//new OpenLayers.Control.LayerSwitcher(),
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
	//layer_pois = new OpenLayers.Layer.Vector("pois", { visibility: true, 	projection: proj4326,  displayOutsideMaxExtent:true	});
	map.addLayers([layer_mapnik, layer_seamarks, layer_grid/*, layer_pois*/]);
	if (!map.getCenter()) {
		jumpTo(lon, lat, zoom);
	}
	map.addControl(selectControl);
	selectControl.activate();
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

function onFeatureSelectPoiLayers(feature) {
	if (feature.data.popupContentHTML) {
		var buff = feature.data.popupContentHTML;
	} else { 
		var buff = '<b>'+feature.attributes.name +'</b><br>'+ feature.attributes.description;
	}
	if (popup) {
		map.removePopup(popup);
	}
	popup = new OpenLayers.Popup.FramedCloud("chicken", 
		feature.geometry.getBounds().getCenterLonLat(),
		null,
		buff,
		null, 
		true
	);
	map.addPopup(popup);
}

function onFeatureUnselectPoiLayers(feature) {
	if (popup) {
		//map.removePopup(popup);
	}
}

function mapEventClick(event) {
	if (popup) {
		//map.removePopup(popup);
	}
}

// Create a permalink and open it in the browser
function createPermalink() {
	var mapPermalink = location.protocol + '//' + location.host + location.pathname;
	mapPermalink += "?permalink=true&zoom=" + zoom + "&lat=" +lat + "&lon=" + lon;
	mapPermalink += "&" + layer_seamarks.name + "=" + document.getElementById("checkLayerSeaMarks").checked;
	mapPermalink += "&" + layer_grid.name + "=" + document.getElementById("checkLayerCordinateGrid").checked;
	window.location.href = mapPermalink;
}
