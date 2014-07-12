
function setCookie(key, value) {
	var expireDate = new Date;
	expireDate.setMonth(expireDate.getMonth() + 6);
	document.cookie = key + "=" + value + ";" + "expires=" + expireDate.toGMTString() + ";";
}

function getCookie(argument) {
	var retValue = "-1"
	var buff = document.cookie;
	var args = buff.split(";");
	for(i = 0; i < args.length; i++) {
		var a = args[i].split("=");
		if(trim(a[0]) == argument) {
			retValue = trim(a[1]);
		}
	}
	return retValue;
}

function getArgument(argument) {
	var retValue = "-1"
	if(window.location.search != "") {
		// We have parameters
		var undef = document.URL.split("?");
		var args = undef[1].split("&");
		for(i = 0; i < args.length; i++) {
			var a = args[i].split("=");
			if( trim(a[0]) == argument) {
				retValue = trim(a[1]);
			}
		}
	}
	return retValue;
}

function placeDiv(divId, xPos, yPos) {
	var element = document.getElementById(divId);
	element.style.position = "absolute";
	element.style.left = xPos+'px';
	element.style.top = yPos+'px';
}

function checkKeyReturn(e) {
	var retValue = false;
	if (e.keyCode == 13) {
		retValue = true;
	}
	return retValue;
}

function trim(buffer) {
	  return buffer.replace(/^\s+/, '').replace(/\s+$/, '');
}

function convert2Web(buffer) {
	buffer = buffer.replace('&', '&amp;');
	buffer = buffer.replace('<', '&lt;');
	buffer = buffer.replace('>', '&gt;');
	buffer = buffer.replace('\'', '&apos;');
	buffer = buffer.replace('\"', '&quot;');

	return buffer
}

function convert2Ascii(buffer) {
	buffer = buffer.replace('ü', 'ue');
	buffer = buffer.replace('ö', 'oe');
	buffer = buffer.replace('ä', 'ae');
	buffer = buffer.replace('ß', 'ss');
	buffer = buffer.replace('ø', 'oe');

	return buffer
}

function convert2Locode(buffer) {
	buffer = buffer.replace('ü', 'u');
	buffer = buffer.replace('ö', 'o');
	buffer = buffer.replace('ä', 'a');
	buffer = buffer.replace('ß', 'ss');
	buffer = buffer.replace('ø', 'o');

	return buffer
}

function format2FixedLenght(number, length, fraclength) {
	var text = number.toFixed(fraclength);
	while (text.length < length) text = "0"+text;

	return text;
}

function loadFile(name, format) {
	var retValue = -1;
	if (window.XMLHttpRequest) {
		xhttp=new XMLHttpRequest();
	} else {
		xhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhttp.open("GET", name, false);
	xhttp.send();
	if (format == "xml") {
		retValue =  xhttp.responseXML;
	} else {
		retValue =  xhttp.responseText;
	}
	return retValue;
} 
