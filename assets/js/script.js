var movieFormEl = document.querySelector("#movie-form");
var movieInputEl = document.querySelector("#movie-search-input");
var resultsContainerEl = document.querySelector("#search-results-container");

//array to hold watchlist movies
var watchlist = JSON.parse(localStorage.getItem("watchList")) || [];
var seenlist = JSON.parse(localStorage.getItem("seenList")) || [];

var getOmdb = function (movieId, check) {
  var apiUrl = `http://www.omdbapi.com/?i=${movieId}&apikey=65b2c758`;
  // make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          //check if movie beind added is already on list
          if (watchlist.some(movie => movie.imdbID === data.imdbID)) {
            console.log("success")
          } else {
            //based on check (0 or 1) taken from on click functions from buttons choose to
            if (!check) {
              console.log(data)
              watchlist.unshift(data);
              localStorage.setItem("watchList", JSON.stringify(watchlist));
              displayMovieList(check);
            } else {
              seenlist.unshift(data);
              localStorage.setItem("seenList", JSON.stringify(seenlist));
              displayMovieList(check);
            }
          }  
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

var getImdbId = function (moviedbId, check) {
  var apiUrl = `https://api.themoviedb.org/3/movie/${moviedbId}/external_ids?api_key=b2b7dc79b0696d3f9c1db98685b5b36f`;
  // // make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          //send imdb id to getOmdb function to retrieve that specific movies data
          var imdbId = data.imdb_id;
          getOmdb(imdbId, check);
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
  console.log(movie);
  var apiUrl =
    "https://api.themoviedb.org/3/search/movie?query=" +
    JSON.stringify(movie.replace(/\s/g, "-")) +
    "&api_key=b2b7dc79b0696d3f9c1db98685b5b36f";
  // // make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data)
          getSearchImdbID(data);
        });
      } else {
        // error message if an invalid entery/movie is submitted
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to The Movie Database");
    });
};

var getSearchMovieInfo = function (movieID) {
  var apiUrl =
    "https://api.themoviedb.org/3/movie/" +
    movieID +
    "?api_key=b2b7dc79b0696d3f9c1db98685b5b36f";
  // make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          displayMovieSearch(data);
        });
      } else {
        // error message if an invalid entery/movie is submitted
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to The Movie Database");
    });
};

var getSearchImdbID = function (movie) {
  if (movie.total_results === 0) {
    resultsContainerEl.textContent = "No Search Results Found";
  } else {
    for (var i = 0; i < movie.results.length; i++) {
      var movieID = movie.results[i].id;
      getSearchMovieInfo(movieID);
    }
  }
};

var displayMovieSearch = function (movie) {
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

  if (movie.poster_path === null) {
    var noPoster = document.createElement("img");
    noPoster.setAttribute("src", "assets/images/oh-snap.jpg");
    posterContainerEl.prepend(noPoster);
  } else {
    var poster = document.createElement("img");
    poster.setAttribute(
      "src",
      "https://image.tmdb.org/t/p/original/" + movie.poster_path
    );
    poster.classList = "search-poster is-3by4 pt-0";
    posterContainerEl.prepend(poster);
  }

  var title = document.createElement("h2");
  title.classList =
    "is-size-4 has-text-centered has-text-white has-text-weight-bold";
  title.textContent = movie.title;
  movieHeaderContainerEl.appendChild(title);

  var release = document.createElement("p");
  release.classList =
    "has-text-centered is-size-6 has-text-white has-text-weight-medium";
  release.textContent =
    "Released: " +
    movie.release_date +
    " / Runtime: " +
    movie.runtime +
    " minutes";
  movieHeaderContainerEl.appendChild(release);

  var overview = document.createElement("p");
  overview.classList =
    "has-text-white has-text-centered column is-full is-size-6 px-0 pt-0 pb-1";
  overview.textContent = movie.overview;
  movieInfoContainerEl.appendChild(overview);

  var btnContainerEl = document.createElement("div");
  btnContainerEl.classList = "is-flex is-justify-content-space-around";
  //!! adding each movies individual moviedbId to the buttons parent so it can be easily sent to getImdbId function
  btnContainerEl.setAttribute("id", movie.imdb_id);
  movieInfoContainerEl.appendChild(btnContainerEl);

  var addToWatchListBtn = document.createElement("button");
  addToWatchListBtn.classList = "btn m-1 p-3 watch-btn-styling";
  addToWatchListBtn.setAttribute("id", "add-to-watch-list-btn");
  addToWatchListBtn.textContent = "Add To Watch List";
  btnContainerEl.appendChild(addToWatchListBtn);

  var addToSeenListBtn = document.createElement("button");
  addToSeenListBtn.classList = "btn m-1 p-3 seen-btn-styling";
  addToSeenListBtn.setAttribute("id", "add-to-seen-list-btn");
  addToSeenListBtn.textContent = "Add To Seen List";
  btnContainerEl.appendChild(addToSeenListBtn);
};

var displayMovieList = function (check) {
  //checks if function needs to display watchlist or seenlist
  if (!check) {
    var list = watchlist;
    var listContainerEl = $("#watch-list-container");
    // console.log("watch");
  } else {
    var list = seenlist;
    var listContainerEl = $("#seen-list-container");
    // console.log("seen");
  }

  //clear list container
  listContainerEl.empty();

  for (i = 0; i < list.length; i++) {
    var movieContainerEl = $("<div>").addClass("card p-3 is-flex");
    listContainerEl.append(movieContainerEl);

    var posterEl = $("<img>").addClass("watch-poster mr-3");
    if (list[i].Poster === "N/A") {
      posterEl.attr("src", "assets/images/oh-snap.jpg");
    } else {
      posterEl.attr("src", list[i].Poster);
    }
    var textContainer = $("<div>");
    movieContainerEl.append(posterEl, textContainer);

    var titleEl = $("<h2>")
      .addClass("is-size-1 has-text-weight-semibold")
      .text(`${list[i].Title} (${list[i].Year})`);
    var directorEl = $("<p>")
      .addClass("is-size-3")
      .text(`Directed by ${list[i].Director}`);
    var genreEl = $("<p>")
      .addClass("is-size-3")
      .text(`Genre: ${list[i].Genre}`);

    var subtextContainer = $("<div>").addClass("is-flex");
    var runtimeEl = $("<p>")
      .addClass("is-size-4 mr-6 mb-1")
      .text(`Runtime: ${list[i].Runtime}`);
    var ratingEl = $("<p>")
      .addClass("is-size-4")
      .text(`Rated: ${list[i].Rated}`);
    subtextContainer.append(runtimeEl, ratingEl);

    var plotEl = $("<p>")
      .addClass("is-size-4 movie-plot py-2")
      .text(list[i].Plot);

    var scoreContainer = $("<div>").addClass(
      "is-flex is-justify-content-space-around score mt-3"
    );
    var imdbScore = $("<p>")
      .addClass("is-size-4")
      .text(`Imdb Score: ${list[i].imdbRating}`);
    var rtScore = $("<p>").addClass("is-size-4");
    if (!list[i].Ratings[1]) {
      rtScore.text(`Tomatometer: N/A`);
    } else {
      rtScore.text(`Tomatometer: ${list[i].Ratings[1].Value}`);
    }
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

$("#search-btn").on("click", function () {
  var movieTitle = movieInputEl.value.trim();
  if (movieTitle) {
    event.preventDefault();

    $("#search-modal").addClass("is-active");
    resultsContainerEl.innerHTML = "";
    getMovie(movieTitle);
    movieInputEl.value = "";
  } else if (!movieTitle) {
    event.preventDefault();
    $("#search-modal").addClass("is-active");
    resultsContainerEl.textContent = "Please Enter a Movie Title";
  }
});
$(".delete").on("click", function () {
  $("#search-modal").removeClass("is-active");
});

//determines which html page is on and loads correct list
var loadMovieList = function () {
  if (document.URL.includes("index.html")) {
    displayMovieList(0);
  } else if (document.URL.includes("seen-list.html")) {
    displayMovieList(1);
  }
};

//click on add to watchlist
$("#search-results-container").on(
  "click",
  "#add-to-watch-list-btn",
  function () {
    //set movieid to the clicked button's parent's id. use same method to send movieId to seen list page
    var movieId = $(this).parent().attr("id");
    //second number being sent tells getImdbId wether to add to watch(0) or seen(1)
    getImdbId(movieId, 0);
  }
);

//click on add to seenlist
$("#search-results-container").on(
  "click",
  "#add-to-seen-list-btn",
  function () {
    //set movieid to the clicked button's parent's id. use same method to send movieId to seen list page
    var movieId = $(this).parent().attr("id");
    //second number being sent tells getImdbId wether to add to watch(0) or seen(1)
    getImdbId(movieId, 1);
  }
);

//click hanlders for random button and modal buttons
$("#random-btn").on("click", function () {
  $("#random-modal").addClass("is-active");
  pickRandomMovie();
});
$(".delete").on("click", function () {
  $("#random-modal").removeClass("is-active");
});
$("#random-watch-btn").on("click", function () {
  console.log("add to watchlist");
});
$("#random-seen-btn").on("click", function () {
  console.log("add to seenlist");
});

$(document).ready(function () {
  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function () {
    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });
});

loadMovieList();
