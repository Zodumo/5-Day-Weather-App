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

//Function to display current weather 


//convert date to dd/mm/yyyy format using moment.


//get forecast and today's weather IDs from index.html. 


//possiblity create cards in a div?


//possibly create <p> element to store the weather forecast content in the card?


//append forecast and weather to cards?




