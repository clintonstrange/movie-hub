var movieFormEl = document.querySelector("#movie-form");
var movieInputEl = document.querySelector("#movie-search-input");
var resultsContainerEl = document.querySelector("#movie-container");

var displayMovies = function (movie) {
  console.log(movie);
  resultsContainerEl.innerHTML = "";

  for (var i = 0; i < movie.Search.length; i++) {
    var movieContainerEl = document.createElement("div");

    resultsContainerEl.appendChild(movieContainerEl);

    // var poster = document.createElement("img");
    // poster.setAttribute(
    //   "src",
    //   "https://image.tmdb.org/t/p/w500" + movie.results[i].poster_path
    // );
    // poster.classList = "poster";
    // movieContainerEl.appendChild(poster);

    var title = document.createElement("h2");
    title.textContent = movie.Search[i].Title;
    movieContainerEl.appendChild(title);

    var release = document.createElement("p");
    release.textContent = movie.Search[i].Year;
    movieContainerEl.appendChild(release);

    // var overview = document.createElement("p");
    // overview.textContent = movie[i].plot;
    // movieContainerEl.appendChild(overview);
  }
};

var getMovie = function (movie) {
  var apiUrl =
    // "https://api.themoviedb.org/3/search/movie?query=" +
    // JSON.stringify(movie.replace(/\s/g, "-")) +
    // "&api_key=b2b7dc79b0696d3f9c1db98685b5b36f";
    "http://www.omdbapi.com/?s=" +
    JSON.stringify(movie.replace(/\s/g, "-")) +
    "&apikey=65b2c758";
  console.log(apiUrl);
  // // make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          displayMovies(data);
        });
      } else {
        // error message if an invalid entery/city is submitted
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      // catch set up incase Open Weather is down or internet is disconnected
      alert("Unable to connect to The Movie Database");
    });
};

var formSubmitHandler = function (event) {
  event.preventDefault();

  // get value from input element
  var movieTitle = movieInputEl.value.trim();
  if (movieTitle) {
    getMovie(movieTitle);
    movieInputEl.value = "";
  } else {
    alert("Please enter a movie title.");
  }
};

movieFormEl.addEventListener("submit", formSubmitHandler);