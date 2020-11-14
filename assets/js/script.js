var movieFormEl = document.querySelector("#movie-form");
var movieInputEl = document.querySelector("#movie-search-input");
var resultsContainerEl = document.querySelector("#search-results-container");

//array to hold watchlist movies
var watchlist = [];

var getOmdb = function (movieId) {
  
  var apiUrl = `http://www.omdbapi.com/?i=${movieId}&apikey=65b2c758`;
  // make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          //add movie to watchlist array
          watchlist.push(data);
          displayWatchlist();
        });
      } else {
        // error message if an invalid entery/movie is submitted
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      // catch set up incase Open Weather is down or internet is disconnected
      alert("Unable to connect to The Movie Database");
    });
};

var getImdbId = function(moviedbId) {
  var apiUrl = `https://api.themoviedb.org/3/movie/${moviedbId}/external_ids?api_key=b2b7dc79b0696d3f9c1db98685b5b36f`;
  // // make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          //send imdb id to getOmdb function to retrieve that specific movies data
          var imdbId = data.imdb_id;
          getOmdb(imdbId);
        });
      } else {
        // error message if an invalid entery/movie is submitted
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      // catch set up incase Open Weather is down or internet is disconnected
      alert("Unable to connect to The Movie Database");
    });
};

var getMovie = function(movie) {
  var apiUrl = `https://api.themoviedb.org/3/search/movie?query=${movie}&api_key=b2b7dc79b0696d3f9c1db98685b5b36f`;
  // // make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          //console.log(data);
          displayMovieSearch(data);
        });
      } else {
        // error message if an invalid entery/movie is submitted
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      // catch set up incase Open Weather is down or internet is disconnected
      alert("Unable to connect to The Movie Database");
    });
};

var displayMovieSearch = function(movie) {
  resultsContainerEl.innerHTML = "";

  for (var i = 0; i < movie.results.length; i++) {
    var movieContainerEl = document.createElement("div");
    movieContainerEl.setAttribute("id", "movie-container");
    movieContainerEl.classList = "columns";

    var posterContainerEl = document.createElement("div");
    posterContainerEl.classList = "column is-two-fifths";
    movieContainerEl.prepend(posterContainerEl);

    var movieInfoContainerEl = document.createElement("div");
    movieInfoContainerEl.setAttribute("id", "movie-info");
    //movieInfoContainerEl.classList = "columns";
    movieContainerEl.appendChild(movieInfoContainerEl);

    var movieHeaderContainerEl = document.createElement("div");
    movieHeaderContainerEl.setAttribute("id", "movie-header");
    movieHeaderContainerEl.classList = "column is-full p-0";
    movieInfoContainerEl.appendChild(movieHeaderContainerEl);

    resultsContainerEl.appendChild(movieContainerEl);

    var poster = document.createElement("img");
    poster.setAttribute(
      "src",
      "https://image.tmdb.org/t/p/original/" + movie.results[i].poster_path
    );
    poster.classList = "image is-3by4 pt-0";
    posterContainerEl.prepend(poster);

    var title = document.createElement("h2");
    title.classList = "has-text-weight-bold";
    title.textContent = movie.results[i].title;
    movieHeaderContainerEl.appendChild(title);

    var release = document.createElement("p");
    release.classList = "is-size-7 has-text-weight-medium";
    release.textContent = movie.results[i].release_date;
    movieHeaderContainerEl.appendChild(release);

    var overview = document.createElement("p");
    overview.classList = "column is-full is-size-7 px-0 pt-0 pb-1";
    overview.textContent = movie.results[i].overview;
    movieInfoContainerEl.appendChild(overview);

    var btnContainerEl = document.createElement("div");
    btnContainerEl.classList = "columns my-3";
    //!! adding each movies individual moviedbId to the buttons parent so it can be easily sent to getImdbId function
    btnContainerEl.setAttribute("id", movie.results[i].id);
    movieInfoContainerEl.appendChild(btnContainerEl);

    var addToWatchListBtn = document.createElement("button");
    addToWatchListBtn.classList = "addBtn m-1 column is-two-fifths";
    addToWatchListBtn.setAttribute("id", "add-to-watch-list-btn");
    addToWatchListBtn.textContent = "Add To Watch List";
    btnContainerEl.appendChild(addToWatchListBtn);

    var addToSeenListBtn = document.createElement("button");
    addToSeenListBtn.classList = "addBtn m-1 column is-two-fifths";
    addToSeenListBtn.setAttribute("id", "add-to-seen-list-btn");
    addToSeenListBtn.textContent = "Add To Seen List";
    btnContainerEl.appendChild(addToSeenListBtn);
  }
};

var displayWatchlist = function() {
  console.log(watchlist)
};

var formSubmitHandler = function(event) {
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

//click on add to watchlist
$("#search-results-container").on("click", "#add-to-watch-list-btn", function() {
  //set movieid to the clicked button's parent's id. use same method to send movieId to seen list page
  var movieId = $(this).parent().attr("id");
  getImdbId(movieId);
});


movieFormEl.addEventListener("submit", formSubmitHandler);
