<div id="topmenu" style="position:absolute; top:10px; left:60px;">
	<ul class="dropdown">
		<li>
			<a href="https://github.com/OpenNauticalChart" target="blank">
				<img alt="ONCLogo" src="./resources/icons/ONC-Logo.png" width="24" height="24" border="0">
			</a>
		</li>
		<li>
			<a>
				<img alt="Search" src="./resources/dialog/find.png" width="22" height="22" border="0"  onClick="nominatim(document.getElementById('searchinputbox').value)">
				<input id="searchinputbox" name="searchtext" type="text"
					size="10" maxlength="40"
					style="height: 18px; border: 1px solid Black"
					onKeyPress="if (event.keyCode==13 || event.which==13) {nominatim(this.value);}"
				>
			</a>
		</li>
		<li>
			<a><img alt="view" src="./resources/dialog/view.png" width="22" height="22" border="0"><span id="menu_view">View</span></a>
			<ul class="sub_menu">
				<li><a href="weather_index.php"><img alt="weather" src="./resources/dialog/layer_weather.png" width="24" height="24" border="0"><span id="menu_layer_weather">Weather</span></a></li>
				<li onClick="showLayer(layer_seamarks)"><a><input type="checkbox" id="checkLayerSeaMarks"><img alt="seamarks" src="./resources/dialog/layer_seamarks.png" width="22" height="22" border="0"><span id="menu_layer_seamarks">Sea Marks</span></a></li>
				<li onClick="showLayer(layer_grid)"><a><input type="checkbox" id="checkLayerCordinateGrid"><img alt="grid" src="./resources/dialog/layer_grid.png" width="22" height="22" border="0"><span id="menu_layer_coordinate_grid">Coordinate grid</span></a></li>
				<!--<li onClick="refreshTidalScales();"><a><input type="checkbox" id="checkLayerTidalScale"><img alt="grid" src="./resources/dialog/layer_tidal_scale.png" width="22" height="22" border="0"><span id="menu_layer_tidal_scale">Tidal scale</span></a></li>-->
			</ul>
		</li>
		<li>
			<a><img alt="tools" src="./resources/dialog/tools.png" width="22" height="22" border="0"><span id="menu_tools">Tools</span></a>
			<ul class="sub_menu">
				<li onClick="javascript:createPermalink();"><a><img alt="permalink" src="./resources/dialog/permalink.png" width="22" height="22" border="0"><span id="menu_tools_permalink">Permalink</span></a></li>
				<li onClick="javascript:addMapDownload();"><a><img alt="map_download" src="./resources/dialog/layer_download_map.png" width="22" height="22" border="0"><span id="menu_tools_map_download">Download chart</span></a></li>
				<li onClick="javascript:addNauticalRoute();"><a><img alt="route" src="./resources/dialog/layer_route.png" width="22" height="22" border="0"><span id="menu_tools_trip_planner">Trip planner</span></a></li>
			</ul>
		</li>
		<li>
			<a><img alt="Help" src="./resources/dialog/help.png" width="22" height="22" border="0"><span id="menu_help">Help</span></a>
			<ul class="sub_menu">
				<li onClick="javascript:showActionDialog(localize('%license', 'License'), loadFile('./dialog_pages/main_license/main_license_' + localize('%locale', 'en') + '.html', 'txt'));"><a><img alt="CC by SA" src="./resources/dialog/Cc-sa-32px.png" width="22" height="22" border="0"><span id="menu_help_license">License</span></a></li>
				<li><a href="https://github.com/OpenNauticalChart/online_map/issues?state=open" target="blank"><img alt="info" src="./resources/dialog/report_bugs.png" width="22" height="22" border="0"><span id="menu_report_bugs">Report bugs</span></a></li>
				<li onClick="javascript:showActionDialog(localize('%about', 'About'),  localize('%about_dialog', 'About'));"><a><img alt="info" src="./resources/dialog/info.png" width="22" height="22" border="0"><span id="menu_help_about">About</span></a></li>
			</ul>
		</li>
	</ul>
</div>
