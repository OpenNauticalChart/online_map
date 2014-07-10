var downloadName;
var downloadLink;

function addMapDownload() {
	selectControl.hover = false;
	addDownloadlayer();

	var htmlText = "<table border=\"0\" width=\"240px\"  cellpadding=\"4\">";
	htmlText += "<tr><td>" + localize('%name', 'Name') + "</td><td><div id=\"download_dialog_name\">" + localize('%please_select_chart', 'Please select chart') + "<br/></div></td></tr>";
	htmlText += "<tr><td>" + localize('%format', 'Format') + ":</td><td><select id=\"mapFormat\" onchange=\"selChangedMapBmpFormat()\"><option value=\"unknown\"/>" + localize('%unknown', 'Unknown') + ":<option value=\"png\"/>png<option value=\"cal\"/>cal<option value=\"kap\"/>kap<option value=\"WCI\"/>WCI<option value=\"kmz\"/>kmz<option value=\"jpr\"/>jpr</select></td></tr>";
	htmlText += "</table>";
	showActionDialog(localize('%map_download', 'Download chart'), htmlText, "closeMapDownload()", "downloadMap()");
	getDownloadMapBmpFormat();
}

function selChangedMapBmpFormat() {
	var format = document.getElementById("mapFormat").value;
	// Set cookie for remembering the download format
	setCookie("downloadMapBmpFormat", format);
}

function getDownloadMapBmpFormat() {
	var buff = getCookie("downloadMapBmpFormat");
	if (buff != "-1") {
		document.getElementById("mapFormat").value = buff;
	} 
}

function addDownloadlayer() {
	var xmlDoc=loadXMLDoc("./gml/map_download.xml");

	if (layer_download == -1) {
		layer_download = new OpenLayers.Layer.Vector("map_download", {visibility: true	});
		map.addLayer(layer_download);
		// Register featureselect for download tool
		selectControl.addLayer(layer_download);
		layer_download.events.register("featureselected", layer_download, selectedMap);
	}
	layer_download.removeAllFeatures();
	try {
		var root = xmlDoc.getElementsByTagName("maps")[0];
		var items = root.getElementsByTagName("map");
	} catch(e) {
		alert("Error (root): "+ e);
		return -1;
	}
	for (var i=0; i < items.length; ++i) {
		var item = items[i];
		var load = false;
		var category =item.getElementsByTagName("category")[0].childNodes[0].nodeValue;

		if (zoom <= 7 && category >= 2) {
			load = true;
		} else if (zoom <= 10 && category >= 4) {
			load = true;
		} else if (zoom <= 13 && category >= 6) {
			load = true;
		} else if (zoom <= 18 && category >= 7) {
			load = true;
		}

		if (load) {
			try {
				var n = item.getElementsByTagName("north")[0].childNodes[0].nodeValue;
				var s = item.getElementsByTagName("south")[0].childNodes[0].nodeValue;
				var e = item.getElementsByTagName("east")[0].childNodes[0].nodeValue;
				var w = item.getElementsByTagName("west")[0].childNodes[0].nodeValue;
			} catch(e) {
				alert("Error (load): " + e);
				return -1;
			}
			var bounds = new OpenLayers.Bounds(w, s, e, n);
			bounds.transform(new OpenLayers.Projection("EPSG:4326"), new
			OpenLayers.Projection("EPSG:900913"));
			var name = item.getElementsByTagName("name")[0].childNodes[0].nodeValue.trim();
			var link = item.getElementsByTagName("link")[0].childNodes[0].nodeValue.trim();
			var attributes = {name: name, link: link};
			var box = new OpenLayers.Feature.Vector(bounds.toGeometry(), attributes);
			layer_download.addFeatures(box);
		}
	}
}

function closeMapDownload() {
	selectControl.hover = true;
	layer_download.removeAllFeatures();
	map.removeLayer(layer_download);
	layer_download = -1;
	closeActionDialog();
}

function downloadMap() {
	var format = document.getElementById("mapFormat").value;

	if (format == "unknown") {
		alert( localize('%select_format', 'Please select a format'));
		return;
	} else if (format == "cal") {
		format = "_png." + format
	} else {
		format = "." + format
	}
	var url = "http://sourceforge.net/projects/opennautical/files/Maps" + downloadLink + "ONC-" + downloadName + format + "/download";
	
	downloadWindow = window.open(url);
}

function selectedMap (event) {
	var feature = event.feature;

	downloadName = feature.attributes.name;
	downloadLink =feature.attributes.link;

	document.getElementById('download_dialog_name').innerHTML = ""+ downloadName +"";
	document.getElementById('buttonActionDlgDownload').disabled = false;
}