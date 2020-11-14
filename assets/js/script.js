var movieFormEl = document.querySelector("#movie-form");
var movieInputEl = document.querySelector("#movie-search-input");
var resultsContainerEl = document.querySelector("#search-results-container");
/* var watchlistContainerEl = document.querySelector("#watch-list-container") */

//array to hold watchlist movies
var watchlist = JSON.parse(localStorage.getItem("watchList")) || [];

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

          localStorage.setItem("watchList", JSON.stringify(watchlist));

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

var getImdbId = function (moviedbId) {
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

var getMovie = function (movie) {
  var apiUrl =
    "http://www.omdbapi.com/?s=" +
    JSON.stringify(movie.replace(/\s/g, "-")) +
    "&type=movie&apikey=65b2c758";
  // make a request to the url
  console.log(apiUrl);
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          //add movie to watchlist array
          getSearchImdbID(data);
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

var getSearchMovieInfo = function (movieID) {
  //console.log(movieID);
  var apiUrl = `http://www.omdbapi.com/?i=${movieID}&apikey=65b2c758`;
  // make a request to the url
  //console.log(apiUrl);
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          //add movie to watchlist array
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

var getSearchImdbID = function (movie) {
  resultsContainerEl.innerHTML = "";
  //console.log(movie);

  for (var i = 0; i < movie.Search.length; i++) {
    var movieID = movie.Search[i].imdbID;
    //console.log(movieID);
    getSearchMovieInfo(movieID);
  }
};

var displayMovieSearch = function (movie) {
  console.log(movie);

  var movieContainerEl = document.createElement("div");
  movieContainerEl.setAttribute("id", "movie-container");
  movieContainerEl.classList = "columns";

  var posterContainerEl = document.createElement("div");
  posterContainerEl.classList = "column is-two-fifths";
  movieContainerEl.prepend(posterContainerEl);

  var movieInfoContainerEl = document.createElement("div");
  movieInfoContainerEl.setAttribute("id", "movie-info");
  // movieInfoContainerEl.classList =
  movieContainerEl.appendChild(movieInfoContainerEl);

  var movieHeaderContainerEl = document.createElement("div");
  movieHeaderContainerEl.setAttribute("id", "movie-header");
  movieHeaderContainerEl.classList = "column is-full p-0";
  movieInfoContainerEl.appendChild(movieHeaderContainerEl);

  resultsContainerEl.appendChild(movieContainerEl);

  if (movie.Poster === "N/A") {
    var noPoster = document.createElement("img");
    noPoster.setAttribute("src", "/assets/images/oh-snap.jpg");
    // poster.classList = "image is-3by4 pt-0";
    posterContainerEl.prepend(noPoster);
  } else {
    var poster = document.createElement("img");
    // console.log(movie.Poster);
    poster.setAttribute("src", movie.Poster);
    poster.classList = "image is-3by4 pt-0";
    posterContainerEl.prepend(poster);
  }

  var title = document.createElement("h2");
  title.classList = "is-size-6 has-text-weight-bold";
  title.textContent = movie.Title + " " + "(" + movie.Year + ")";

  var rating = document.createElement("p");
  rating.classList = "is-size-7 has-text-weight-semibold";
  rating.textContent = "Rated: " + movie.Rated;

  var director = document.createElement("p");
  director.classList = "is-size-7 has-text-weight-semibold";
  director.textContent = "Directed By: " + movie.Director;

  var genre = document.createElement("p");
  genre.classList = "is-size-7 has-text-weight-semibold";
  genre.textContent = "Genre: " + movie.Genre;

  var runtime = document.createElement("p");
  runtime.classList = "is-size-7 has-text-weight-semibold";
  runtime.textContent = "Runtime: " + movie.Runtime;

  movieHeaderContainerEl.append(title, rating, director, genre, runtime);

  var plot = document.createElement("p");
  plot.classList = "is-size-7 has-text-weight-semibold";
  plot.textContent = movie.Plot;

  movieInfoContainerEl.append(plot);

  var scoreContainerEl = document.createElement("div");
  scoreContainerEl.setAttribute("id", "search-score-container");
  movieInfoContainerEl.append(scoreContainerEl);

  var scores = document.createElement("p");
  scores.classList = "is-size-6 has-text-weight-semibold";
  scores.textContent = "IMDB Score: " + movie.imdbRating;

  scoreContainerEl.append(scores);

  var btnContainerEl = document.createElement("div");
  btnContainerEl.classList = "columns my-3";
  //!! adding each movies individual moviedbId to the buttons parent so it can be easily sent to getImdbId function
  btnContainerEl.setAttribute("id", movie.imdbID);
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
};

var displayWatchlist = function () {
  console.log(watchlist);
  //clear watch list container
  var watchlistContainerEl = $("#watch-list-container");
  watchlistContainerEl.empty();

  for (i = 0; i < watchlist.length; i++) {
    var movieContainerEl = $("<div>").addClass("card p-3 is-flex");
    watchlistContainerEl.append(movieContainerEl);

    var posterEl = $("<img>")
      .attr("src", watchlist[i].Poster)
      .addClass("watch-poster mr-3");
    var textContainer = $("<div>");
    movieContainerEl.append(posterEl, textContainer);

    var titleEl = $("<h2>")
      .addClass("is-size-1 has-text-weight-semibold")
      .text(`${watchlist[i].Title} (${watchlist[i].Year})`);
    var directorEl = $("<p>")
      .addClass("is-size-3")
      .text(`Directed by ${watchlist[i].Director}`);
    var genreEl = $("<p>")
      .addClass("is-size-3")
      .text(`Genre: ${watchlist[i].Genre}`);

    var subtextContainer = $("<div>").addClass("is-flex");
    var runtimeEl = $("<p>")
      .addClass("is-size-4 mr-6 mb-1")
      .text(`Runtime: ${watchlist[i].Runtime}`);
    var ratingEl = $("<p>")
      .addClass("is-size-4")
      .text(`Rated: ${watchlist[i].Rated}`);
    subtextContainer.append(runtimeEl, ratingEl);

    var plotEl = $("<p>")
      .addClass("is-size-4 movie-plot py-2")
      .text(watchlist[i].Plot);

    var scoreContainer = $("<div>").addClass(
      "is-flex is-justify-content-space-around score mt-3"
    );
    var imdbScore = $("<p>")
      .addClass("is-size-4")
      .text(`Imdb Score: ${watchlist[i].imdbRating}`);
    var rtScore = $("<p>")
      .addClass("is-size-4")
      .text(`Tomatometer: ${watchlist[i].Ratings[1].Value}`);
    scoreContainer.append(imdbScore, rtScore);

    textContainer.append(
      titleEl,
      directorEl,
      genreEl,
      subtextContainer,
      plotEl,
      scoreContainer
    );
  }
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

//click on add to watchlist
$("#search-results-container").on(
  "click",
  "#add-to-watch-list-btn",
  function () {
    //set movieid to the clicked button's parent's id. use same method to send movieId to seen list page
    var movieId = $(this).parent().attr("id");

    getImdbId(movieId);
  }
);

movieFormEl.addEventListener("submit", formSubmitHandler);
displayWatchlist();
