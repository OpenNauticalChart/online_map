// AJAX Nominatim Call
// 27.06.2014
// Olaf Hannemann

function GetXmlHttpObject() {
    try {
        // Firefox. Opera, Sarafi
        try {  // get firefox to do cross domain ajax
            netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        } catch (err) {
            //alert("Error initializing XMLHttpRequest.\n"+err); // show error
        }
        xmlHttp = new XMLHttpRequest(); // instantiate it regardless of security
    }
    catch(err) {
        // Internet Explorer
        try {
            xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
        } catch(err) {
            xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    return xmlHttp;
}

function ajax(url, callback, infotext) {
    var xmlhttp = GetXmlHttpObject();
    if (xmlhttp) {
        xmlhttp.open("GET", url, true);
        xmlhttp.onreadystatechange=function(){
            if ( xmlhttp.readyState == 4  ) {
                callback(xmlhttp, infotext);
            }
        }
        xmlhttp.send(null);
    }
}

function nominatim(searchtext) {
    var url='./api/nominatim.php?q='+searchtext;
    ajax(url, nominatim_callback, infotext=searchtext);
}

function nominatim_callback(xmlHttp, infotext) {
    if ( xmlHttp.status == 0 ) {
        alert('"'+infotext+' not found.');
    } else if ( xmlHttp.status == 200 ) {
        if ( xmlHttp.responseXML.getElementsByTagName('place')[0] ) {   // is one place returned?
            addSearchResults(xmlHttp);
        } else {
            alert('"'+infotext+'" not found.');
        }
    }
}

// Show search results in dialog window
 function addSearchResults(xmlHttp) {
	var items = xmlHttp.responseXML.getElementsByTagName("place");
	var placeName, description, placeLat, placeLon;
	var buff, pos;
	var htmlText = "<table border=\"0\" width=\"370px\">";
	for(i = 0; i < items.length; i++) {
		buff = xmlHttp.responseXML.getElementsByTagName('place')[i].getAttribute('display_name');
		placeLat = xmlHttp.responseXML.getElementsByTagName('place')[i].getAttribute('lat');
		placeLon = xmlHttp.responseXML.getElementsByTagName('place')[i].getAttribute('lon');
		pos = buff.indexOf(",");
		placeName = buff.substring(0, pos);
		description = buff.substring(pos +1).trim();
		htmlText += "<tr style=\"cursor:pointer;\" onmouseover=\"this.style.backgroundColor = '#ADD8E6';\"onmouseout=\"this.style.backgroundColor = '#FFF';\" onclick=\"jumpTo(" + placeLon + ", " + placeLat + ", " + zoom + ");\"><td  valign=\"top\"><b>" + placeName + "</b></td><td>" + description + "</td></tr>";
	}
	htmlText += "</table>";
	showActionDialog(localize("%search_results", "Search results"), htmlText);
}

function josm_call() {
  var left    = x2lon( map.getExtent().left   ).toFixed(5);
  var right   = x2lon( map.getExtent().right  ).toFixed(5);
  var top    = y2lat( map.getExtent().top    ).toFixed(5);
  var bottom  = y2lat( map.getExtent().bottom ).toFixed(5);
  var baseUrl = 'http://127.0.0.1:8111/load_and_zoom?left='+left+'&right='+right+'&top='+top+'&bottom='+bottom;
  document.getElementById('josm_call_iframe').src=baseUrl;
}
