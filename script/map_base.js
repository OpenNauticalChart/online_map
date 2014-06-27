var map;
var popup;
var arrayMaps = new Array();

// Position and zoomlevel of the map  (will be overriden with permalink parameters or cookies)
var lon = 11.6540;
var lat = 54.1530;
var zoom = 10;

// Layers
var layer_pois;
var layer_seamarks;

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
	var buffZoom = parseInt(getCookie("zoom"));
	var buffLat = parseFloat(getCookie("lat"));
	var buffLon = parseFloat(getCookie("lon"));
	if (buffZoom != -1) {
		zoom = buffZoom;
	}
	if (buffLat != -1 && buffLon != -1) {
		lat = buffLat;
		lon = buffLon;
	}
	drawmap();
	setLanguageStrings ();
}

// Add translation to dialogs
function setLanguageStrings () {
	// Help menu
	document.getElementById("menu_help").innerHTML = localize("%help", "Help");
	document.getElementById("menu_license").innerHTML = localize("%license", "License");
	document.getElementById("menu_about").innerHTML = localize("%about", "About");
}

 // Show dialog window
function showActionDialog(header, htmlText) {
	var content = "<table border=\"0\" cellspacing=\"0\" cellpadding=\"4\">";
	content += "<tr bgcolor=\"#CAE1FF\"><td align=\"left\" valign=\"top\"><b>" + header + "</b></td><td align=\"right\" valign=\"top\"><img src=\"./resources/action/close.png\" onClick=\"closeActionDialog();\"></td></tr>";
	content += "<tr><td colspan=\"2\">" + htmlText + "</td></tr>";
	content += "<tr><td></td><td align=\"right\" valign=\"bottom\"><input type=\"button\" id=\"buttonMapClose\" value=\"" +  localize("%close", "Close") + "\" onclick=\"closeActionDialog();\"></td></tr>";
	content += "</table>";
	document.getElementById("actionDialog").style.visibility = 'visible';
	document.getElementById("actionDialog").innerHTML = content;
}

// Hide dialog window
function closeActionDialog() {
	document.getElementById("actionDialog").style.visibility = 'hidden';
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
			//new OpenLayers.Control.Permalink(),
			new OpenLayers.Control.Navigation(),
			new OpenLayers.Control.ScaleLine(),
			//new OpenLayers.Control.LayerSwitcher(),
			new OpenLayers.Control.MousePosition(),
			new OpenLayers.Control.OverviewMap(),
			new OpenLayers.Control.PanZoomBar()],
			maxExtent:
			new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
		numZoomLevels: 18,
		maxResolution: 156543,
		units: 'meters'
	});

	// Add Layers to map-------------------------------------------------------------------------------------------------------
	// Mapnik
	var layer_mapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
	layer_seamarks = new OpenLayers.Layer.TMS("seamarks", "http://t1.openseamap.org/seamark/",
                    { layerId: 3, numZoomLevels: 19, type: 'png', getURL:getTileURL, isBaseLayer:false, displayOutsideMaxExtent:true});
	// Pois
	layer_pois = new OpenLayers.Layer.Vector("pois", { 
		visibility: true,
		projection: proj4326, 
		displayOutsideMaxExtent:true
	});
	map.addLayers([layer_mapnik, layer_seamarks, layer_pois]);

	if (!map.getCenter()) {
		jumpTo(lon, lat, zoom);
	}

	// Add select tool for poi layers
	selectControlPois = new OpenLayers.Control.SelectFeature([layer_pois], {onSelect: onFeatureSelectPoiLayers, onUnselect: onFeatureUnselectPoiLayers, hover: true});
	map.addControl(selectControlPois);
	selectControlPois.activate();
}

// Map event listener moved
function mapEventMove(event) {
	// Set cookie for remembering lat lon values
	setCookie("lat", y2lat(map.getCenter().lat).toFixed(5));
	setCookie("lon", x2lon(map.getCenter().lon).toFixed(5));
	
	//refreshTelecom();
}

// Map event listener Zoomed
function mapEventZoom(event) {
	zoom = map.getZoom();
	// Set cookie for remembering zoomlevel
	setCookie("zoom",zoom);
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
		map.removePopup(popup);
	}
}
