OpenLayers.Util.OSM = {};

//Class: OpenLayers.Layer.OSM.Mapnik
OpenLayers.Layer.OSM.Mapnik = OpenLayers.Class(OpenLayers.Layer.OSM, {
    initialize: function(name, options) {
        var url = [
            "http://a.tile.openstreetmap.org/${z}/${x}/${y}.png",
            "http://b.tile.openstreetmap.org/${z}/${x}/${y}.png",
            "http://c.tile.openstreetmap.org/${z}/${x}/${y}.png"
        ];
        options = OpenLayers.Util.extend({ numZoomLevels: 19, buffer: 0 }, options);
        var newArguments = [name, url, options];
        OpenLayers.Layer.OSM.prototype.initialize.apply(this, newArguments);
    },

    CLASS_NAME: "OpenLayers.Layer.OSM.Mapnik"
});

function getNodeInformation(a ,b, c, d) {
	var xmlDoc=loadFile("./api/get_node_information.php?bb=" + a +","+ b +","+ c +","+ d, "xml");
	var root = xmlDoc.getElementsByTagName("osm")[0];
	var itemType ="-1";
	var infoText = "-1";
	var items = root.getElementsByTagName("way");
	for (var i=0; i < items.length; ++i) {
		var item = items[i];
		itemType = getTag(item, "seamark:type");
		if (itemType == "harbour") {
			var buff = parseNodeHarbour(item);
			if (buff != "-1") {
				infoText = buff;
				infoText += "<br/><span onClick=\"showWeatherPng(" + a + ", " + b + ")\"  style=\"cursor:pointer; color: blue;\">" + localize("%weather", "Weather") + "</span>";
			}
		} else {
			itemType = "-1";
		}
	}
	if (itemType == "-1") {
		items = root.getElementsByTagName("node");
		for (var i=0; i < items.length; ++i) {
			var item = items[i];
			itemType = getTag(item, "seamark:type");
			if (itemType == "harbour") {
				var buff = parseNodeHarbour(item);
				if (buff != "-1") {
					infoText = buff;
					infoText += "<br/><span onClick=\"showWeatherPng(" + a + ", " + b +  ")\"  style=\"cursor:pointer; color: blue;\">" + localize("%weather", "Weather") + "</span>";
				}
			}
		}
	}
	return infoText;
}

function getTag(item, key) {
	var tags = item.getElementsByTagName("tag");
	var tagValue = "-1";
	for (var n=0; n < tags.length; ++n) {
		var tag = tags[n];
		var itemKey = tag.getAttribute("k");
		if (itemKey == key) {
			tagValue = tag.getAttribute("v");
		}
	}
	return tagValue;
}

function parseNodeHarbour(item) {
	var infoName = getTag(item, "name") ;
	var infoPhone =  getTag(item, "phone");
	var infoEmail =  getTag(item, "email");
	var infoWeb =  getTag(item, "website");
	var infoText = "-1";
	if (infoName != "-1") {
		infoText = "<b>" + infoName +  "</b><br><br>";
	}
	if (infoPhone != "-1") {
		infoText += "<b>" + localize("%phone", "Phone") + ": </b>" +  infoPhone +  "<br>";
	}
	if (infoEmail != "-1") {
		infoText += "<b>" + localize("%email", "E-Mail") + ":  </b><a href=\"mailto:" + infoEmail + "\"> " + infoEmail + "</a><br>";
	}
	if (infoWeb != "-1") {
		infoText += "<b>" + localize("%web", "Web") + ":  </b><a href=\"";
		if (infoWeb.match('http')) {
			infoText +=  infoWeb;
		} else {
			infoText += "http://" + infoWeb;
		}

		infoText +=  "\" target=\"_blank\"> " + infoWeb + "</a><br>";
	}

	return infoText;
}

function showWeatherPng(a, b) {
	showActionDialog(localize("%weather", "Weather"), "<img alt=\"" + localize("%loading_data", "loading data") +"\" src=" + "http://openportguide.org/cgi-bin/weather/weather.pl/weather.png?var=meteogram&nx=614&ny=750&lat=" + a + "&lon=" + b + "&lang=" +  localize("%locale", "en") + "&unit=metric&label=" + localize("%harbour", "Harbour") + " height=\"600\">");
}