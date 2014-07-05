<?PHP

// Create a new instance
$utc = new Weather();

class Weather {

	function getWeatherUtc($time) {
		$value = file_get_contents("http://openportguide.org/tiles/actual/wind_vector/" .$time ."/time.txt");

		return trim($value);
	}
}

?> 