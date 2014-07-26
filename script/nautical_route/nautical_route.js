/******************************************************************************
 Copyright 2014 Olaf Hannemann
 
 This file is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 
 This file is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 
 You should have received a copy of the GNU General Public License
 along with this file.  If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************

 ******************************************************************************
 This file implements the nautical route service to the OpenNauticalChart map.
 Version 0.0.2  26.07.2014
 ******************************************************************************/

var editPanel;
var routeDraw;
var routeEdit;
var routeObject;

var style_edit = {	strokeColor: "#CD3333", strokeWidth: 3, fillColor: "blue",  pointRadius: 4};

function addNauticalRoute() {
	var htmlText =  "<table border=\"0\" width=\"370px\">";
	htmlText += "<tr><td>" + localize('%start', 'Start') + "</td><td id=\"routeStart\">- - -</td></tr>";
	htmlText += "<tr><td>" + localize('%finish', 'Finish') + "</td><td id=\"routeEnd\">- - -</td></tr>";
	htmlText += "<tr><td>" + localize('%distance', 'Distance') + "</td><td id=\"routeDistance\">- - -</td></tr>";
	htmlText += "<tr><td>" + localize('%format', 'Format') + "</td><td><select id=\"routeFormat\"><option value=\"CSV\"/>CSV<option value=\"GML\"/>GML<option value=\"KML\"/>KML</select></td></tr>";
	htmlText += "<tr><td id=\"routePoints\" colspan = 2> </td></tr>";
	htmlText += "</table>";
	showActionDialog(localize("%trip_planner", "Trip planner"), htmlText, "closeNauticalRoute()", "NauticalRoute_DownloadTrack()", "clearNauticalRoute()");
	document.getElementById('buttonActionDlgClear').value =localize('%new', 'New');
	addLayerNauticalRoute();
	NauticalRoute_startEditMode();
}

function addLayerNauticalRoute() {
	if (layer_nautical_route == -1) {
		var defaultStyle = {strokeColor: "blue", strokeOpacity: "0.8", strokeWidth: 3, fillColor: "blue", pointRadius: 3, cursor: "pointer"};
		var style = OpenLayers.Util.applyDefaults(defaultStyle, OpenLayers.Feature.Vector.style["default"]);
		var routeStyle = new OpenLayers.StyleMap({'default': style, 'select': {strokeColor: "red", fillColor: "red"}});
		layer_nautical_route = new OpenLayers.Layer.Vector("nautical_route", {styleMap: routeStyle, visibility: true, eventListeners: {"featuresadded": NauticalRoute_routeAdded, "featuremodified": NauticalRoute_routeModified}});
		map.addLayer(layer_nautical_route);
		// Register featureselect for download tool
		selectControl.addLayer(layer_nautical_route);
		layer_nautical_route.events.register("featureselected", layer_nautical_route, onFeatureSelectNauticalRoute);
	}
}

function closeNauticalRoute() {
	layer_nautical_route.setVisibility(false);
	map.removeLayer(layer_nautical_route);
	layer_nautical_route = -1;
	closeActionDialog();
	NauticalRoute_stopEditMode();
}

function clearNauticalRoute() {
	closeNauticalRoute();
	addNauticalRoute();
}

function NauticalRoute_initControls() {
	editPanel = new OpenLayers.Control.Panel();
	routeDraw = new OpenLayers.Control.DrawFeature(layer_nautical_route, OpenLayers.Handler.Path, {title: 'Draw line'});
	routeEdit = new OpenLayers.Control.ModifyFeature(layer_nautical_route, {title: 'Edit feature'}),
	editPanel.addControls([routeDraw, routeEdit]);
	editPanel.defaultControl = routeDraw;
	map.addControl(editPanel);
	routeEdit.standalone = true;
}

function NauticalRoute_startEditMode() {
	NauticalRoute_initControls();
}

function NauticalRoute_stopEditMode() {
	routeDraw.deactivate();
	routeEdit.deactivate();
}

function NauticalRoute_addMode() {
	routeDraw.activate();
	routeEdit.deactivate();
}

function NauticalRoute_editMode() {
	routeDraw.deactivate();
	routeEdit.activate();
}

function NauticalRoute_getPoints(points) {
	var htmlText = "<br/><table>";
	var latA, latB, lonA, lonB, distance, bearing;
	var totalDistance = 0;
	document.getElementById("routeStart").innerHTML = lat2DegreeMinute(y2lat(points[0].y)) + " - " + lon2DegreeMinute(x2lon(points[0].x));
	htmlText += "<tr bgcolor=\"#CCCCCC\"><td width=\"20\" align=\"center\"></td><td width=\"60\" align=\"center\">" + localize('%bearing', 'Bearing') + "</td><td width=\"70\" align=\"center\">" + localize('%distance', 'Distance') + "</td><td width=\"200\" align=\"center\">" + localize('%coordinate', 'Coordinate') + "</td></tr>"
	for(i = 0; i < points.length - 1; i++) {
		latA = y2lat(points[i].y);
		lonA = x2lon(points[i].x);
		latB = y2lat(points[i + 1].y);
		lonB = x2lon(points[i + 1].x);
		distance = getDistance(latA, latB, lonA, lonB).toFixed(2);
		bearing = getBearing(latA, latB, lonA, lonB).toFixed(2);
		totalDistance += parseFloat(distance);
		htmlText += "<tr><td width=\"20\" align=\"right\">" + parseInt(i+1) + ". </td>";
		htmlText += "<td width=\"60\" align=\"right\">" + bearing + "°</td>";
		htmlText += "<td width=\"70\" align=\"right\">" + distance + "nm</td>";
		htmlText += "<td width=\"200\" align=\"left\">&nbsp&nbsp" + lat2DegreeMinute(latB) + " - " + lon2DegreeMinute(lonB) + "</td></tr>";
	}
	htmlText += "</table>"
	document.getElementById("routeEnd").innerHTML = lat2DegreeMinute(latB) + " - " + lon2DegreeMinute(lonB);
	document.getElementById("routeDistance").innerHTML = totalDistance.toFixed(2) + "nm";
	document.getElementById("routePoints").innerHTML = htmlText;
	document.getElementById('buttonActionDlgDownload').disabled = false;
	document.getElementById('buttonActionDlgClear').disabled = false;
}

function NauticalRoute_routeAdded(event) {
	routeObject = event.object.features[0];
	var routeTrack = routeObject.geometry.getVertices();
	routeDraw.deactivate();
	routeEdit.activate();
	NauticalRoute_getPoints(routeTrack);
	// Select element for editing
	routeEdit.selectFeature(routeObject);
}

function NauticalRoute_routeModified(event) {
	routeObject = event.object.features[0];
	var routeTrack = routeObject.geometry.getVertices();
	NauticalRoute_getPoints(routeTrack);
}

function onFeatureSelectNauticalRoute(event) {
	feature = event.feature;
	feature.style = style_edit;
}

// Download------------------------------------------------------------------------------
function NauticalRoute_DownloadTrack() {
	var format = document.getElementById("routeFormat").value;
	var mimetype, filename;

	switch (format) {
		case 'CSV':
			mimetype = 'text/csv';
			filename = 'route.csv';
			content = NauticalRoute_getRouteCsv( routeObject.geometry.getVertices());
			break;
		case 'KML':
			mimetype = 'application/vnd.google-earth.kml+xml';
			filename = 'route.kml';
			content = NauticalRoute_getRouteKml( routeObject.geometry.getVertices());
			break;
		case 'GPX':
			mimetype = 'application/gpx+xml';
			filename = 'route.gpx';
			content = NauticalRoute_getRouteGpx(routeObject);
			break;
		case 'GML':
			mimetype = 'application/gml+xml';
			filename = 'route.gml';
			content = NauticalRoute_getRouteGml(routeObject);
			break;
	}
	form = document.createElement('form');
	form.id = this.id + '_export_form';
	form.method = 'post';
	form.action = './api/export.php';
	document.getElementById('actionDialog').appendChild(form);
	div = document.createElement('div');
	div.className = this.displayClass + "Control";
	form.appendChild(div);
	input = document.createElement('input');
	input.id = this.id + '_export_input_mimetype';
	input.name = 'mimetype';
	input.type = 'hidden';
	div.appendChild(input);
	input = document.createElement('input');
	input.id = this.id + '_export_input_filename';
	input.name = 'filename';
	input.type = 'hidden';
	div.appendChild(input);
	input = document.createElement('input');
	input.id = this.id + '_export_input_content';
	input.name = 'content';
	input.type = 'hidden';
	div.appendChild(input);
	$(this.id + '_export_input_mimetype').value = mimetype;
	$(this.id + '_export_input_filename').value = filename;
	$(this.id + '_export_input_content').value = content;
	$(this.id + '_export_form').submit();
}

function NauticalRoute_getRouteCsv(points) {
	var buffText = ";" +  localize('%bearing', 'Bearing') + ";" + localize('%distance', 'Distance') + ";" + localize('%coordinate', 'Coordinate') + "\n";
	var latA, latB, lonA, lonB, distance, bearing;
	var totalDistance = 0;

	for(i = 0; i < points.length - 1; i++) {
		latA = y2lat(points[i].y);
		lonA = x2lon(points[i].x);
		latB = y2lat(points[i + 1].y);
		lonB = x2lon(points[i + 1].x);
		distance = getDistance(latA, latB, lonA, lonB).toFixed(2);
		bearing = getBearing(latA, latB, lonA, lonB).toFixed(2);
		totalDistance += parseFloat(distance);
		buffText += parseInt(i+1)+ ";" + bearing + "°;" + distance + "nm;\"" + lat2DegreeMinute(latB) + " - " + lon2DegreeMinute(lonB) + "\"\n";
	}

	return convert2Text(buffText);
}

function NauticalRoute_getRouteKml(points) {
	var latA, lonA;
	var buffText = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<kml xmlns=\"http://earth.google.com/kml/2.0\">\n";
	buffText += "<Folder>\n<name>OpenSeaMap Route</name>\n<description>test</description>";
	buffText += "<Placemark>\n<name>OpenSeaMap</name>\n<description>No description available</description>";
	buffText += "<LineString>\n<coordinates>\n";
	for(i = 0; i < points.length; i++) {
		latA = y2lat(points[i].y);
		lonA = x2lon(points[i].x);
		buffText += lonA + "," + latA + " ";
	}
	buffText += "\n</coordinates>\n</LineString>\n</Placemark>\n</Folder>\n</kml>";
	
	return buffText;
}

function NauticalRoute_getRouteGpx(feature) {
	var parser = new OpenLayers.Format.GPX({
		internalProjection: map.projection,
		externalProjection: proj4326
	});
	
	return parser.write(feature);
}

function NauticalRoute_getRouteGml(feature) {
	var parser = new OpenLayers.Format.GML.v2({
		internalProjection: map.projection,
		externalProjection: proj4326
	});
	
	return parser.write(feature);
}
