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
			infoText = parseNodeHarbour(item);
		}
	}
	if (itemType == "-1") {
		items = root.getElementsByTagName("node");
		for (var i=0; i < items.length; ++i) {
			var item = items[i];
			itemType = getTag(item, "seamark:type");
			if (itemType == "harbour") {
				infoText = parseNodeHarbour(item);
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
	var infoPhone =  getTag(item, "phone");
	var infoEmail =  getTag(item, "email");
	var infoWeb =  getTag(item, "website");
	var infoText = "<b>" + getTag(item, "name") +  "</b><br><br>";
	if (infoPhone != "-1") {
		infoText += "<b>" + localize("%phone", "Phone") + ": </b>" +  infoPhone +  "<br>";
	}
	if (infoEmail != "-1") {
		infoText += "<b>" +localize("%email", "E-Mail") + ":  </b><a href=\"mailto:" + infoEmail + "\"> " + infoEmail + "</a><br>";
	}
	if (infoWeb != "-1") {
		infoText += "<b>" +localize("%web", "Web") + ":  </b><a href=\"" + infoWeb + "\" target=\"_blank\"> " + infoWeb + "</a><br>";
	}

	return infoText;
}