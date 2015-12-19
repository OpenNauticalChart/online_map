<div id="topmenu" style="position:absolute; top:10px; left:50px;">
	<ul>
		<li>
			<a href="./index.php">
				<img alt="ONCLogo" src="./resources/icons/ONC-Logo.png" style="width:24px; height:24px;margin-top:5px;"><span id="menu_nautical_chart" style="margin-right:10px;">Nautical Chart</span></img>
			</a>
		</li>
		<li><img src="./resources/dialog/weather/BlueDivider.png" style="width:2px; height:24px;margin-top:3px;"></li>
		<li id="buttonWind" onClick="showWind()" onMouseover="this.style.background='#ADD8E6'" onMouseout="if(!showWindLayer) {this.style.background='#FFFFFF'} else {this.style.background='#ADD8E6'}"><input type="checkbox" id="checkWind"/><img src="./resources/dialog/weather/WindIcon.png" style="width:24px; height:24px;margin-left: -20px;"><span id="menu_wind" style="margin-right: 10px;">Wind</span></img></li>
		<li id="buttonPressure" onClick="showPressure()" onMouseover="this.style.background='#ADD8E6'" onMouseout="if(!showPressureLayer) {this.style.background='#FFFFFF'} else {this.style.background='#ADD8E6'}"><input type="checkbox" id="checkPressure"/><img src="./resources/dialog/weather/AirPressureIcon.png" style="width:24px; height:24px;margin-left: -20px;"><span id="menu_air_pressure" style="margin-right: 10px;">Air Pressure</span></img></li>
		<li id="buttonAirTemperature" onClick="showAirTemperature()" onMouseover="this.style.background='#ADD8E6'" onMouseout="if(!showAirTemperatureLayer) {this.style.background='#FFFFFF'} else {this.style.background='#ADD8E6'}"><input type="checkbox" id="checkAirTemperature"/><img src="./resources/dialog/weather/AirTemperatureIcon.png" style="width:24px; height:24px;margin-left: -20px;"><span id="menu_air_temperature" style="margin-right: 10px;">Air Temperature</span></img></li>
		<li id="buttonPrecipitation" onClick="showPrecipitation()" onMouseover="this.style.background='#ADD8E6'" onMouseout="if(!showPrecipitationLayer) {this.style.background='#FFFFFF'} else {this.style.background='#ADD8E6'}"><input type="checkbox" id="checkPrecipitation"/><img src="./resources/dialog/weather/PrecipitationIcon.png" style="width:24px; height:24px;margin-left: -20px;"><span id="menu_precipitation" style="margin-right: 10px;">Precipitation</span></img></li>
		<li id="buttonSignificantWaveHeight" onClick="showSignificantWaveHeight()" onMouseover="this.style.background='#ADD8E6'" onMouseout="if(!showSignificantWaveHeightLayer) {this.style.background='#FFFFFF'} else {this.style.background='#ADD8E6'}"><input type="checkbox" id="checkSignificantWaveHeight"/><img src="./resources/dialog/weather/WaveIcon.png" style="width:24px; height:24px;margin-left: -20px;"><span id="menu_wave_height" style="margin-right: 10px;">Wave Height</span></img></li>
		<li><img src="./resources/dialog/weather/BlueDivider.png" style="width:2px; height:24px;margin-top:3px;"></li>
		<li onClick="showActionDialog(localize('%help', 'Help'), loadFile('./dialog_pages/weather_help/weather_help_main_' + localize('%locale', 'en') + '.html', 'txt'));"><img src="./resources/dialog/info.png" style="width:24px; height:24px;margin-top:3px;"><span id="menu_help" style="margin-right: 10px;">Help</span></img></li>
	</ul>
</div>