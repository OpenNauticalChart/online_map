<div id="topmenu" style="position:absolute; top:10px; left:60px;">
    <ul class="dropdown">
        <li>
            <a href="http://www.opensource-werkstatt-stubben.org" target="blank">
                <img alt="ONCLogo" src="./resources/icons/ONC-Logo.png" width="24" height="24" border="0">
            </a>
        </li>
        <li>
            <a>
                <img alt="Suche" src="./resources/action/find.png" width="22" height="22" border="0"  onClick="nominatim(document.getElementById('searchinputbox').value)">
                <input id="searchinputbox" name="searchtext" type="text"
                    size="10" maxlength="40"
                    style="height: 18px; border: 1px solid Black"
                    onKeyPress="if (event.keyCode==13 || event.which==13) {nominatim(this.value);}"
                >
            </a>
        </li>
        <li>
            <a><img alt="Hilfe" src="./resources/action/help.png" width="22" height="22" border="0">&nbsp;Hilfe</a>
            <ul class="sub_menu">
				<li onClick="javascript:showActionDialog('Lizenz',  licenseDialog_de)"><a><img alt="CC by SA" src="./resources/action/Cc-sa-32px.png" width="22" height="22" border="0">Lizenz</a></li>
                <li onClick="javascript:showActionDialog('Über',  aboutDialog_de)"><a><img alt="info" src="./resources/action/info.png" width="22" height="22" border="0">Über</a></li>
            </ul>
        </li>
    </ul>
</div>
