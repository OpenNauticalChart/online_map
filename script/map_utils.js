// Constants-------------------------------------------------------------------
var earthRadius = 6371.221; //Km

// Projections-----------------------------------------------------------------
var projMerc = new OpenLayers.Projection("EPSG:900913");
var proj4326 = new OpenLayers.Projection("EPSG:4326");

// Zoom------------------------------------------------------------------------
var zoomUnits= [
	30*3600,	// zoom=0
	30*3600,
	15*3600,
	10*3600,
	5*3600,
	5*3600,
	2*3600,
	1*3600,
	30*60,
	20*60,
	10*60,		// zoom=10
	5*60,
	2*60,
	1*60,
	30,
	30,
	12,
	6,
	6,
	3			// zoom=19
];

// Transformations-------------------------------------------------------------
function Lon2Merc(value) {
	return 20037508.34 * value / 180;
}

function Lat2Merc(value) {
	var PI = 3.14159265358979323846;
	lat = Math.log(Math.tan( (90 + value) * PI / 360)) / (PI / 180);
	return 20037508.34 * value / 180;
}

function plusfacteur(a) {
	return a * (20037508.34 / 180);
}

function moinsfacteur(a) {
	return a / (20037508.34 / 180);
}

function y2lat(a) {
	return 180/Math.PI * (2 * Math.atan(Math.exp(moinsfacteur(a)*Math.PI/180)) - Math.PI/2);
}

function lat2y(a) {
	return plusfacteur(180/Math.PI * Math.log(Math.tan(Math.PI/4+a*(Math.PI/180)/2)));
}

function x2lon(a) {
	return moinsfacteur(a);
}

function lon2x(a) {
	return plusfacteur(a);
}

function km2nm(a) {
	return a * 0.540;
}

function lat2DegreeMinute(buffLat) {
	var ns = buffLat >= 0 ? 'N' : 'S';
	var lat_m = Math.abs(buffLat*60).toFixed(3);	
	var lat_d = Math.floor (lat_m/60);
	lat_m -= lat_d*60;
	return ns + lat_d + "°" + format2FixedLenght(lat_m, 6, 3) + "'";
}

function lon2DegreeMinute(buffLon) {
	var we = buffLon >= 0 ? 'E' : 'W';
	var lon_m = Math.abs(buffLon*60).toFixed(3);
	var lon_d = Math.floor (lon_m/60);
	lon_m -= lon_d*60;
	return we + lon_d + "°" + format2FixedLenght(lon_m, 6, 3) + "'";
}

function lonLatToMercator(ll) {
	return new OpenLayers.LonLat(lon2x(ll.lon), lat2y(ll.lat));
}

// shorten coordinate to 5 digits in decimal fraction
function shorter_coord(coord) {
	return Math.round(coord*100000)/100000;
}

// Route handling--------------------------------------------------------------
function getDistance(latA, latB, lonA, lonB) {
	var dLat = OpenLayers.Util.rad(latB - latA);
	var dLon = OpenLayers.Util.rad(lonB - lonA);
	var lat1 = OpenLayers.Util.rad(latA);
	var lat2 = OpenLayers.Util.rad(latB);

	var a = Math.PI/2-lat2;
	var b = Math.PI/2-lat1;
	var c = Math.acos(Math.cos(a)*Math.cos(b)+Math.sin(a)*Math.sin(b)*Math.cos(dLon));
	var d = km2nm(earthRadius * c);
	
	return d;
}

function getBearing(latA, latB, lonA, lonB) {
	var dLat = OpenLayers.Util.rad(latB-latA);
	var dLon = OpenLayers.Util.rad(lonB-lonA);
	var lat1 = OpenLayers.Util.rad(latA);
	var lat2 = OpenLayers.Util.rad(latB);
	
	var y = Math.sin(dLon) * Math.cos(lat2);
	var x = Math.cos(lat1)*Math.sin(lat2) -
		Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
	var brng = OpenLayers.Util.deg(Math.atan2(y, x));
	
	return (brng + 360) % 360;
}

// Utilities-------------------------------------------------------------------
function jumpTo(lon, lat, zoom) {
	var lonlat = new OpenLayers.LonLat(lon, lat);
	lonlat.transform(proj4326, projMerc);
	map.setCenter(lonlat, zoom);
}

function getTileURL(bounds) {
	var res = this.map.getResolution();
	var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
	var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
	var z = this.map.getZoom();
	var limit = Math.pow(2, z);
	if (y < 0 || y >= limit) {
		return null;
	} else {
		x = ((x % limit) + limit) % limit;
		url = this.url;
		path= z + "/" + x + "/" + y + "." + this.type;
		if (url instanceof Array) {
			url = this.selectUrl(path, url);
		}
		return url+path;
	}
}

// OpenLayers tweaking---------------------------------------------------------

OpenLayers.Control.MousePositionDM = OpenLayers.Class (OpenLayers.Control.MousePosition, {

	formatOutput: function (lonLat) {
		var ns = lonLat.lat >= 0 ? 'N' : 'S';
		var we = lonLat.lon >= 0 ? 'E' : 'W';
		var lon_m = Math.abs(lonLat.lon*60).toFixed(3);
		var lat_m = Math.abs(lonLat.lat*60).toFixed(3);
		var lon_d = Math.floor (lon_m/60);
		var lat_d = Math.floor (lat_m/60);
		lon_m -= lon_d*60;
		lat_m -= lat_d*60;

		return	"Zoom:" + zoom + " " + ns + lat_d + "&#176;" + format2FixedLenght(lat_m,6,3) + "'" + "&#160;" +
			we + lon_d + "&#176;" + format2FixedLenght(lon_m,6,3) + "'" ;
       	},

	CLASS_NAME:"OpenLayers.Control.MousePositionDM"
    }
);

OpenLayers.Layer.GridWGS = OpenLayers.Class (OpenLayers.Layer.Vector, {
	initialize: function (name, options){
		OpenLayers.Layer.Vector.prototype.initialize.apply(this, [name, options]);
	},
	gridSizeText: null,
	gridSizeDiv: null,
	zoomUnits: null,
	getGridUnit: function (distance) {
		if (this.zoomUnits) return this.zoomUnits[this.map.zoom];
		for (var i=0; i<this.gridUnits.length; i++) {
			if (distance<this.gridUnits[i])
				return this.gridUnits[i];
		}
		return null;
	},
	gridUnits: [
		//3,		// 0.05'
		6, 12, 30,	// 0.1'  0.2'  0.5'
		1*60, 2*60, 3*60, 5*60, 10*60, 20*60, 30*60,
		1*3600, 2*3600, 3*3600, 4*3600, 6*3600, 10*3600, 15*3600, 30*3600, 45*3600],

	gridPixelDistance: 100,

	dd: function (n) {
		return parseInt(n)>=10 ? n : '0'+n;
	},

	formatGridSize: function (s) {
		var h = Math.floor(s/3600);
		var m = s%3600/60;
		return (h?h+"°":"")+(m?m+"'":"");
	},

	formatDegrees: function (s, unit) {
		return Math.floor(s/3600) + "°"
			+ (unit%3600?this.dd(s%3600/60)+"'":"")
	},

	moveTo: function (bounds, zoomChanged, dragging) {
		if (dragging) return;
		this.destroyFeatures();
		var mapBounds = bounds.clone().
			transform(this.map.getProjectionObject(), this.map.displayProjection);
		var seconds = 3600 * (mapBounds.top-mapBounds.bottom);
		var unit = this.getGridUnit (seconds / this.map.getSize().h * this.gridPixelDistance);
		if (this.gridSizeText && !this.gridSizeDiv) {
			this.gridSizeDiv=OpenLayers.Util.createDiv(this.id);
			this.gridSizeDiv.className='olControlGridWGS';
			this.gridSizeDiv.style.zIndex=map.Z_INDEX_BASE['Control']+ map.controls.length;
			this.gridSizeDiv.setAttribute("unselectable","on");
			this.map.viewPortDiv.appendChild (this.gridSizeDiv);
		}
		if (this.gridSizeDiv) this.gridSizeDiv.style.display='none';
		if (unit) {
			var x1 = Math.max (-180.0*3600, Math.ceil  (3600 * mapBounds.left  / unit) * unit);
			var x2 = Math.min (+180.0*3600, Math.floor (3600 * mapBounds.right / unit) * unit);
			var y1 = Math.max ( -90.0*3600, Math.ceil  (3600 * mapBounds.bottom/ unit) * unit);
			var y2 = Math.min ( +90.0*3600, Math.floor (3600 * mapBounds.top   / unit) * unit);
			var features = [];
			for (var x=x1; x<=x2; x+= unit) {
				var p1 = new OpenLayers.LonLat (x/3600, Math.min(+85, mapBounds.top))
					.transform(map.displayProjection, map.getProjectionObject());
				var p2 = new OpenLayers.LonLat (x/3600, Math.max(-85, mapBounds.bottom))
					.transform(map.displayProjection, map.getProjectionObject());
				v1 = new OpenLayers.Feature.Vector ( new OpenLayers.Geometry.LineString( [
					new OpenLayers.Geometry.Point (p1.lon, p1.lat),
					new OpenLayers.Geometry.Point (p2.lon, p2.lat)
				]));
				v1.style={
					label: this.formatDegrees (Math.abs(x), unit),
					labelAlign: "lt",
					strokeColor: "#666666",
					strokeWidth: 1,
					strokeOpacity: 0.8
				};
				features.push (v1);
			}
			for (var y=y1; y<=y2; y+=unit) {
				var p1 = new OpenLayers.LonLat (Math.max(-180, mapBounds.left), y/3600)
					.transform(map.displayProjection, map.getProjectionObject());
				var p2 = new OpenLayers.LonLat (Math.min(+180, mapBounds.right), y/3600)
					.transform(map.displayProjection, map.getProjectionObject());
				v1 = new OpenLayers.Feature.Vector ( new OpenLayers.Geometry.LineString( [
					new OpenLayers.Geometry.Point (p1.lon, p1.lat),
					new OpenLayers.Geometry.Point (p2.lon, p2.lat)
				]));
				v1.style={
					label: this.formatDegrees (Math.abs(y), unit),
					labelAlign: "lb",
					strokeColor: "#666666",
					strokeWidth: 1,
					strokeOpacity: 0.8
				};
				features.push (v1);
			}
			this.addFeatures(features);
			if (this.gridSizeDiv) {
				this.gridSizeDiv.innerHTML = OpenLayers.String.format(this.gridSizeText,
					{grid: this.formatGridSize(unit)});
				this.gridSizeDiv.style.display=null;
			}
		}
		OpenLayers.Layer.Vector.prototype.moveTo.apply(this,arguments);
	},
	CLASS_NAME: "OpenLayers.Layer.GridWGS"
});
