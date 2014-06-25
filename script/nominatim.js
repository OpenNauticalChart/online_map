// AJAX Nominatim Call
// 11.01.2014
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
    //alert(url);
    if (xmlhttp) {
        //alert('doit');
        xmlhttp.open("GET", url, true);
        xmlhttp.onreadystatechange=function(){
            //alert('readyState = ' + xmlhttp.readyState + ' / status = ' + xmlhttp.status);
            if ( xmlhttp.readyState == 4  ) {
                //alert(xmlhttp.responseText);
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
