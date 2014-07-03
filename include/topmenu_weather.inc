<div id="topmenu" style="position:absolute; top:10px; left:12px;">
	<ul>
		<li>
			<a href="./index.php">
				<img alt="ONCLogo" src="./resources/icons/ONC-Logo.png" width="24" height="24" border="0"><span id="menu_nautical_chart">Nautical Chart</span></img>
			</a>
		</li>
		<li>&nbsp;|&nbsp;</li>
		<li id="buttonWind" onClick="showWind()" onMouseover="this.style.background='#ADD8E6'" onMouseout="if(!showWindLayer) {this.style.background='#FFFFFF'} else {this.style.background='#ADD8E6'}"><input type="checkbox" id="checkWind"/><IMG src="./resources/dialog/weather/WindIcon.png" width="24" height="24" align="center" border="0"><span id="menu_wind">Wind</span></img></li>
		<li>&nbsp;&nbsp;</li>
		<li id="buttonPressure" onClick="showPressure()" onMouseover="this.style.background='#ADD8E6'" onMouseout="if(!showPressureLayer) {this.style.background='#FFFFFF'} else {this.style.background='#ADD8E6'}"><input type="checkbox" id="checkPressure"/><IMG src="./resources/dialog/weather/AirPressureIcon.png" width="24" height="24" align="center" border="0"><span id="menu_air_pressure">Air Pressure</span></img></li>
		<li>&nbsp;&nbsp;</li>
		<li id="buttonAirTemperature" onClick="showAirTemperature()" onMouseover="this.style.background='#ADD8E6'" onMouseout="if(!showAirTemperatureLayer) {this.style.background='#FFFFFF'} else {this.style.background='#ADD8E6'}"><input type="checkbox" id="checkAirTemperature"/><IMG src="./resources/dialog/weather/AirTemperatureIcon.png" width="24" height="24" align="center" border="0"><span id="menu_air_temperature">Air Temperature</span></img></li>
		<li>&nbsp;&nbsp;</li>
		<li id="buttonPrecipitation" onClick="showPrecipitation()" onMouseover="this.style.background='#ADD8E6'" onMouseout="if(!showPrecipitationLayer) {this.style.background='#FFFFFF'} else {this.style.background='#ADD8E6'}"><input type="checkbox" id="checkPrecipitation"/><IMG src="./resources/dialog/weather/PrecipitationIcon.png" width="24" height="24" align="center" border="0"><span id="menu_precipitation">Precipitation</span></img></li>
		<li>&nbsp;&nbsp;</li>
		<li id="buttonSignificantWaveHeight" onClick="showSignificantWaveHeight()" onMouseover="this.style.background='#ADD8E6'" onMouseout="if(!showSignificantWaveHeightLayer) {this.style.background='#FFFFFF'} else {this.style.background='#ADD8E6'}"><input type="checkbox" id="checkSignificantWaveHeight"/><IMG src="./resources/dialog/weather/WaveIcon.png" width="24" height="24" align="center" border="0"><span id="menu_wave_height">Wave Height</span></img></li>
		<li>&nbsp;|&nbsp;</li>
		<li onClick="zoomIn()"><IMG src="./resources/dialog/zoom-in.png" width="24" height="24" align="center" border="0">Zoom +</img></li>
		<li onClick="zoomOut()"><IMG src="./resources/dialog/zoom-out.png" width="24" height="24" align="center" border="0">Zoom -</img></li>
	</ul>
</div>