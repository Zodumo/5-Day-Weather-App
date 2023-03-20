//store variables for weather url and API key.
var weatherURL = "https://api.openweathermap.org/";
var APIKey = "5a609858f03bac94b2c90ec3da9a0ffe"
var cityQueryCall;

var SearchForCity = JSON.parse(localStorage.getItem("search")) || [];

function citySearch(e) {
    //prevent default for user input function to search for city 
    e.preventDefault();

    //take user input and store it in a variable.

    var userInput = $("#search-input").val().trim();
    //if user input is not equal to null and is also not an empty string, 
    //we're calling a function that will give us the coordinates.
    if (userInput != null && userInput != "") {
        getCoords(userInput);
    }

    $("#search-input").val("");
}

//create event click for search button using search-button id from HTML. 
$("search-button").on("click", citySearch);

//use API URL to get longitude and longitude coordinates.
function getCoords(search) {
    //call from API to get the city coords based on user search 
    var searchCoordsURL = `${queryURL}geo/1.0/direct?q=${search}&limit=5&appid=${APIKey}`;
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
        getCurrWeather(lat, lon)
    });
}

//Function to fetch current weather 
function getCurrWeather(lat, lon) {
    //Second GET Ajax call to get current weather based on coordinates
    var CurrentWeatherURL = `${queryURL}data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${APIKey}&units=metric`;
    $.ajax({
        url: CurrentWeatherURL,
        method: "GET",
    }).then(function (response) {
        //The response will be passed to a function that will display the data.
        displayCurrentWeather(response);
    })
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
        .css({ width: "60rem", height: "300px" });
    //adding a section for the forecast section
    var cardElement = $("<div>").addClass(" d-flex space-between ");
    //possibly create <p> element to store the weather forecast content in the card
    var contentParagraph = $("<h3>")
    contentParagraph.text("5-Day Weather Forecast");

    //the forecast being appended to the cards so it displays
    forecastData.append(contentParagraph);
    forecastData.append(cardElement);

    //apending today's data to a card
    todayData.append(card);

    //creating a section to show a weather icon

    //dynamically creating an image tag
    var icon = $("<img>");
    //call icon data from API url
    icon.attr(
        "src",
        `http://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`
    );

    // The Following Section is Forming an Unordered List To Store Different Weather Conditions. 
    //this list will store all data includind city, humidity, temperature and wind
    var list = $("<ul>").addClass("list-unstyled pl-5 ");
    //this list will append to a today card
    card.append(list);

    //Storing data about the city the user entered 
    var cityItem = $("<li>").addClass("h2 pb-4");
    // fetch from the API the city user will saerch
    var city = cityQueryCall
    // Will show the city
    cityItem.text(city + " (" + dateFormat + ")");

    //storing data about temperature and ensuring it is in degrees celcius
    var tempItem = $("<li>").addClass("pb-2");
    // fech from the API the temperature
    var celsiusTemperature = weather.current.temp;
    // will show the temperature in celsios
    tempItem.text("Temp: " + celsiusTemperature + "°C");

    //storing data about wind speed
    var windItem = $("<li>").addClass("pb-2");
    // fech from the API the wind
    var wind = weather.current.wind_speed;
    // will show the temperatue in m/s
    windItem.text("wind: " + wind + " m/s");

    //storing data on humidity levels
    var humidityItem = $("<li>");
    // fech from the API the humidity
    var humidity = weather.current.humidity;
    // will show the humidity in %
    humidityItem.text("humidity: " + humidity + "%");

    //displaying the above items on the html page
    todayData.innerHTML = "";
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
        var dateEl = weather.daily[i].dt;
        var dateFormatEl = moment.unix(dateEl).format("DD/MM/YYYY");
        dailyDate.text(dateFormatEl);
        forecastList.append(dailyDate);

        var iconElement = $("<img>");
        iconElement.attr(
            "src",

            `http://openweathermap.org/img/wn/${weather.daily[i].weather[0].icon}.png`
        );
    }


