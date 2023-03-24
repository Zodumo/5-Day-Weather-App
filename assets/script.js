var APIKey = "c828ba608f878d909ac2c8a1fd874157";
var weatherURL = "https://api.openweathermap.org/";
var cityQueryCall;

var SearchForCity = JSON.parse(localStorage.getItem("search")) || [];

function citySearch(e) {
    //prevent default for user input function to search for city 
    e.preventDefault();


    //take user input and store it in a variable.
    var userInput = $("#search-input").val().trim();
    //if user input is not equal to null and is also not an empty string, 
    //we're calling a function that will give us the coordinates.
    if (userInput != null && userInput != " ") {
        getCoords(userInput);
    } else {
        console.log("Let's goooo");
    }
    $("#search-input").val("");
}
//create event click for search button using search-button id from HTML.
$("#search-button").on("click", citySearch);

//use API URL to get longitude and longitude coordinates.
function getCoords(userSearch) {
    //call from API to get the city coords based on user search
    var searchCoordsURL = `${weatherURL}geo/1.0/direct?q=${userSearch}&limit=5&appid=${APIKey}`;
    // first GET Ajax call to get coordinates
    $.ajax({
        url: searchCoordsURL,
        method: "GET",
    }).then(function (response) {
        //retrieving the name of the city
        cityQueryCall = response[0].name;
        //retieving the weather of the city which will be called in the function to save it
        saveWeather(response[0].name);

        //fetching longitude and latitude data
        var lat = response[0].lat;
        var lon = response[0].lon;
        //saving the longitude and latitude data to function getting current weather.
        getCurrWeather(lat, lon);
    });
}

//Function to fetch current weather 
function getCurrWeather(lat, lon) {
    // call from the API lat and lon to retrive the current weather
    var CurrentWeatherURL = `${weatherURL}data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${APIKey}&units=metric`;
    $.ajax({
        url: CurrentWeatherURL,
        method: "GET",
    }).then(function (response) {
        //The response will be passed to a function that will display the data.
        displayCurrentWeather(response);
    });
}

//function to display the current weather
function displayCurrentWeather(weather) {
    //accessing the object (weather data) and fetching the date
    var date = weather.current.dt;

    //convert date to dd/mm/yyyy format using moment.
    var dateFormat = moment.unix(date).format("DD/MM/YYYY");

    //get forecast and today's weather IDs from index.html. 
    var todayData = $("#today").empty();

    var forecastData = $("#forecast").empty();

    //dynamically created divs for cards
    var card = $("<div>")
        .addClass(" card border border-info")
        .css({ width: "60rem", height: "300px"});

    //adding a section for the forecast section
    var cardElement = $("<div>").addClass(" d-flex space-between ");

    //possibly create <p> element to store the weather forecast content in the card
    var contentParagraph = $("<h3>");
    contentParagraph.text("5-Day Forecast");

    //the forecast being appended to the cards so it displays
    forecastData.append(contentParagraph);
    forecastData.append(cardElement);

    //apending today's data to a card
    todayData.append(card);

    //creating a section to show a weather icon
    //dynamically creating an image tag
    var icon = $("<img>");
    icon.attr(
        "src",

        `http://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`
    );

    // The Following Section is Forming an Unordered List To Store Different Weather Conditions. 
    //this list will store all data includind city, humidity, temperature and wind
    var list = $("<ul>").addClass("list-unstyled pl-5 ");
    card.append(list);

    //Storing data about the city the user entered 
    var cityItem = $("<li>").addClass("h2 pb-4");
    // fetch from the API the city user will search
    var city = cityQueryCall;
    // displaying city
    cityItem.text(city + " (" + dateFormat + ")");

    //storing data about temperature and ensuring it is in degrees celcius
    var tempItem = $("<li>").addClass("pb-2");
    var celsiusTemperature = weather.current.temp;
    tempItem.text("Temp: " + celsiusTemperature + "°C");

    //storing data about wind speed
    var windItem = $("<li>").addClass("pb-2");
    var wind = weather.current.wind_speed;
    windItem.text("wind: " + wind + " m/s");

    //storing data on humidity levels
    var humidityItem = $("<li>");
    var humidity = weather.current.humidity;
    humidityItem.text("humidity: " + humidity + "%");
    todayData.innerHTML = "";
    
    //displaying the above items on the html page
    list.append(cityItem);
    list.append(icon);
    list.append(tempItem);
    list.append(windItem);
    list.append(humidityItem);

    //A separate div for forecast data list with the date
    for (var i = 0; i < 5; i++) {
        var forecastList = $("<ul>")
            .addClass("list-unstyled card mr-5 bg-info")
            .css({ height: "250px", padding: "24px" });
        cardElement.append(forecastList);

        // iterating through the data object to retrieve the date
        // again, we're using moment to format the date to DD/MM/YYYY
        var dailyDate = $("<li>");
        var dateElement = weather.daily[i].dt;
        var dateformatElement = moment.unix(dateElement).format("DD/MM/YYYY");
        dailyDate.text(dateformatElement);
        forecastList.append(dailyDate);

        var iconElement = $("<img>");
        iconElement.attr(
            "src",

            `http://openweathermap.org/img/wn/${weather.daily[i].weather[0].icon}.png`
        );

        forecastList.append(iconElement);
        //creating list element for temperature forecast
        var TempForecast = $("<li>");
        var tempElement = weather.daily[i].temp.day;
        TempForecast.text("Temp: " + tempElement + "°C");
        forecastList.append(TempForecast);
        console.log(weather.daily[i].temp.day);
        //create list element for wind forcast
        var windForecast = $("<li>");
        var windForecastEl = weather.daily[i].wind_speed;
        windForecast.text("wind: " + windForecastEl + " m/s");
        forecastList.append(windForecast);
        console.log(weather.daily[i].wind_speed);
         //create list element for humidity forecast
        var humidityForecast = $("<li>");
        var humidityForecastEl = weather.daily[i].humidity;
        humidityForecast.text("humidity: " + humidityForecastEl + "%");
        forecastList.append(humidityForecast);
    }
}

// A function to ensure a search isn't duplicated
function saveWeather(search) {
    console.log(search);

    var duplicate = SearchForCity.find((item) => search == item);

    if (duplicate) {
        return;
    } else {
        //for latest search to be at the top
        SearchForCity.unshift(search);
        $("#history").empty();
        localStorage.setItem("search", JSON.stringify(SearchForCity));
        searchHistory();
    }
}

function searchHistory() {
    $("#history").css({
        display: "flex",
        "flex-direction": "column",
    });
    //dynamically creating button element
    var clearButton = $("<button>");
    clearButton.text("Clear History").addClass(" btn btn-info mb-2");
    // search to occur for 10 seconds
    SearchForCity.splice(10);

    SearchForCity.forEach((element) => {
        var searchLi = $("<button>")
            .text(element)
            .addClass("btn btn-outline-info mb-2 ");
        searchLi.on("click", function () {
            var value = $(this).text();
            getCoords(value);
        });
        $("#history").prepend(clearButton);
        $("#history").append(searchLi);
    });

      // creating a clear history button to clear the user's search history
    clearButton.on("click", function () {
        localStorage.clear();
        $("#history button").remove();
        SearchForCity = [];
    });
}

searchHistory();