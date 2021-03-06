var movieFormEl = document.querySelector("#movie-form");
var movieInputEl = document.querySelector("#movie-search-input");
var resultsMovieContainerEl = document.querySelector(
  "#search-results-container"
);
var trendingMovieContainerEl = document.querySelector(
  "#trending-movie-container"
);

// array to hold watchlist movies
var watchlist = JSON.parse(localStorage.getItem("watchList")) || [];
// array to hold seenlist movies
var seenlist = JSON.parse(localStorage.getItem("seenList")) || [];

// use open movie database with the IMDB ID to send ID to display and save movies to appropriate list 
var getOmdb = function (movieId, check) {
  var apiUrl = `https://www.omdbapi.com/?i=${movieId}&apikey=65b2c758`;
  if (!check) {
    var list = watchlist;
  } else {
    var list = seenlist;
  }
  // make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          //check if movie being added is already on list
          if (list.some((movie) => movie.imdbID === data.imdbID)) {
            sameMovieClicked();
          } else {
            //remove clicked on class from button so it cant be affected later
            $(".clicked-on").removeClass("clicked-on");
            //based on check (0 or 1) taken from on click functions from buttons choose to
            if (check === 0) {
              watchlist.unshift(data);
              localStorage.setItem("watchList", JSON.stringify(watchlist));
              displayMovieList(check);
            } else if (check === 1) {
              seenlist.unshift(data);
              localStorage.setItem("seenList", JSON.stringify(seenlist));
              displayMovieList(check);
            } else {
              var item = $(`#${movieId}`);
              var placement = $(".list-item-container").index(item);
              seenlist.splice(placement, 0, data);
              localStorage.setItem("seenList", JSON.stringify(seenlist));
              displayMovieList(1);
            }
          }
        });
      } else {
        // error message if an invalid entery/movie is submitted
        console.log("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      // catch set up incase Open Weather is down or internet is disconnected
      alert("Unable to connect to The Open Movie Database");
    });
};

// get IMDB ID from the movie database in search results and send to Open Movie Database
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
        console.log("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      // catch set up incase Open Weather is down or internet is disconnected
      alert("Unable to connect to The Movie Database");
    });
};

// take search input and search the movie database for relevant results
var getMovie = function (movie) {
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
          getSearchImdbID(data);
        });
      } else {
        // error message if an invalid entery/movie is submitted
        console.log("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to The Movie Database");
    });
};

// take trending form criteria and search the move datebase for relevant results
var getTrendingMovie = function (trendingGenre, trendingCertification) {
  var apiUrl =
    "https://api.themoviedb.org/3/discover/movie?with_genres=" +
    trendingGenre +
    "&certification_country=US&certification=" +
    trendingCertification +
    "&sort_by=popularity.desc" +
    "&api_key=b2b7dc79b0696d3f9c1db98685b5b36f";
  // // make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          getTrendingImdbID(data);
        });
      } else {
        // error message if an invalid entery/movie is submitted
        console.log("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to The Movie Database");
    });
};

// use the open movie database and IMDB ID to push data to display movies on appropriate list
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
        console.log("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to The Movie Database");
    });
};

//use the open movie database and IMDB ID to push data to display movies on appropriate list
var getTrendingMovieInfo = function (movieID) {
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
          displayTrendingMovie(data);
        });
      } else {
        // error message if an invalid entery/movie is submitted
        console.log("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to The Movie Database");
    });
};

// use for loop to capture all movies in search results to display
var getSearchImdbID = function (movie) {
  if (movie.total_results === 0) {
    resultsMovieContainerEl.textContent = "No Search Results Found";
  } else {
    for (var i = 0; i < movie.results.length; i++) {
      var movieID = movie.results[i].id;
      getSearchMovieInfo(movieID);
    }
  }
};

// use for loop to capture all mocies in search results to display
var getTrendingImdbID = function (movie) {
  if (movie.total_results === 0) {
    resultsMovieContainerEl.textContent = "No Search Results Found";
  } else {
    for (var i = 0; i < movie.results.length; i++) {
      var movieID = movie.results[i].id;
      getTrendingMovieInfo(movieID);
    }
  }
};

// get reddit api
$.ajax("https://www.reddit.com/r/movies/hot.json", {
  success: function (responseData) {
    displayReddit(responseData);
  },
  error: function () {
    alert("Unable to connect to reddit!");
  },
});

// display reddit movie artiles
var displayReddit = function (posts) {
  //starts from 2 because pinned posts could also make if statement to check if post is pinned
  for (i = 2; i < posts.data.children.length; i++) {
    var newsContainer = $("#news-container");
    var postContainer = $("<div>").addClass(
      "post-item-container is-flex is-align-items-center p-3"
    );
    newsContainer.append(postContainer);
    if (posts.data.children[i].data.thumbnail !== "self") {
      var thumbnailEl = $("<img>")
        .addClass("post-img")
        .attr("src", posts.data.children[i].data.thumbnail);
      postContainer.append(thumbnailEl);
    }
    var textContainer = $("<div>").addClass("ml-2 is-size-5");
    var postTitle = $("<p>").text(posts.data.children[i].data.title);
    var postLink = $("<a>")
      .text("Go to post")
      .attr({
        href: `https://www.reddit.com${posts.data.children[i].data.permalink}`,
        target: "_blank",
      });
    textContainer.append(postTitle, postLink);
    postContainer.append(textContainer);
    //increase this number if you want more posts
    if (i > 6) {
      break;
    }
  }
};

// check if move already exists on lists
var sameMovieClicked = function () {
  $(".error-message").remove();
  var clickedMovie = $(".clicked-on").parent().parent();
  var errorMessage = $("<p>")
    .addClass("has-text-danger-dark error-message")
    .text("This movie is already on your list!");
  clickedMovie.append(errorMessage);
  $(".clicked-on").removeClass("clicked-on");
};

// delete movie from watchlist
var deleteWatchMovie = function (movieId) {
  var filteredList = watchlist.filter((imdbId) => imdbId.imdbID != movieId);
  watchlist = filteredList;
  localStorage.setItem("watchList", JSON.stringify(watchlist));
  loadMovieList();
};

// delete movie from seenlist
var deleteSeenMovie = function (movieId) {
  var filteredList = seenlist.filter((imdbId) => imdbId.imdbID != movieId);
  seenlist = filteredList;
  localStorage.setItem("seenList", JSON.stringify(seenlist));
  loadMovieList();
};

// display search results from the movie database in search modal
var displayMovieSearch = function (movie) {
  var movieContainerEl = document.createElement("div");
  movieContainerEl.setAttribute("id", "movie-container");
  movieContainerEl.classList = "columns";

  var posterContainerEl = document.createElement("div");
  posterContainerEl.classList = "column is-two-fifths";
  movieContainerEl.prepend(posterContainerEl);

  var movieInfoContainerEl = document.createElement("div");
  movieInfoContainerEl.setAttribute("id", "movie-info");
  movieContainerEl.appendChild(movieInfoContainerEl);

  var movieHeaderContainerEl = document.createElement("div");
  movieHeaderContainerEl.setAttribute("id", "movie-header");
  movieHeaderContainerEl.classList = "column is-full p-0";
  movieInfoContainerEl.appendChild(movieHeaderContainerEl);

  resultsMovieContainerEl.appendChild(movieContainerEl);

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

// dispay trending results from the movie database in trending modal
var displayTrendingMovie = function (movie) {
  var movieContainerEl = document.createElement("div");
  movieContainerEl.setAttribute("id", "movie-container");
  movieContainerEl.classList = "columns";

  var posterContainerEl = document.createElement("div");
  posterContainerEl.classList = "column is-two-fifths";
  movieContainerEl.prepend(posterContainerEl);

  var movieInfoContainerEl = document.createElement("div");
  movieInfoContainerEl.setAttribute("id", "movie-info");
  movieContainerEl.appendChild(movieInfoContainerEl);

  var movieHeaderContainerEl = document.createElement("div");
  movieHeaderContainerEl.setAttribute("id", "movie-header");
  movieHeaderContainerEl.classList = "column is-full p-0";
  movieInfoContainerEl.appendChild(movieHeaderContainerEl);

  trendingMovieContainerEl.appendChild(movieContainerEl);

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

// display movies in watch list or seen list
var displayMovieList = function (check) {
  //checks if function needs to display watchlist or seenlist
  if (!check) {
    var list = watchlist;
    var listContainerEl = $("#watch-list-container");
  } else {
    var list = seenlist;
    var listContainerEl = $("#seen-list-container")
  }
  //set var for ranking
  var rank = 1;
  //clear list container
  listContainerEl.addClass("m-3").empty();

  for (i = 0; i < list.length; i++) {
    var movieContainerEl = $("<li>")
      .attr("id", list[i].imdbID)
      .addClass(
        "card mb-1 is-flex has-background-white-ter list-item-container"
      );
    listContainerEl.append(movieContainerEl);
    var posterContainer = $("<div>").addClass("is-3by4");

    var posterEl = $("<img>").addClass("watch-poster mr-3");
    if (list[i].Poster === "N/A") {
      posterEl.attr("src", "assets/images/oh-snap.jpg");
    } else {
      posterEl.attr("src", list[i].Poster);
    }
    posterContainer.append(posterEl);

    var textContainer = $("<div>").addClass("text-container");
    movieContainerEl.append(posterContainer, textContainer);

    var titleEl = $("<h2>")
      .addClass("movie-title is-size-1 has-text-weight-semibold")
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

    var scoreContainer = $("<div>")
      .addClass("score mt-3")
      .attr("id", "score-container");
    var imdbScore = $("<p>")
      .addClass("is-size-4")
      .text(`Imdb Score: ${list[i].imdbRating}`);
    var rtScore = $("<p>").addClass("is-size-4");
    if (!list[i].Ratings[1]) {
      rtScore.text(`Tomatometer: N/A`);
    } else {
      rtScore.text(`Tomatometer: ${list[i].Ratings[1].Value}`);
    }
    //add buttons to delete and move, check if 0 or 1 to either append both or just delete
    var btnContainer = $("<div>")
      .attr("id", list[i].imdbID)
      .addClass("is-flex is-justify-content-space-between button-container");
    var deleteBtn = $("<button>")
      .addClass("btn is-size-4 px-2 has-background-danger trash-btn m-1")
      .attr("id", "delete-movie-btn")
      .html("<i class='far fa-trash-alt'></i>");
    var seenBtn = $("<button>")
      .addClass("btn is-size-4 px-1 seen-btn-styling m-1")
      .attr("id", "add-to-seen-list-btn")
      .html("Seen-it <i class='fas fa-arrow-right'></i>");
    if (!check) {
      btnContainer.append(deleteBtn, seenBtn);
    } else {
      btnContainer.append(deleteBtn);
    }

    scoreContainer.append(imdbScore, rtScore, btnContainer);

    //create html for rank then add 1 to number
    var rankContainer = $("<div>").addClass(
      "is-flex is-align-items-center is-size-4"
    );
    var rankEl = $("<div>")
      .addClass("sort-container handle")
      .html(
        `<p class="p-3"> ${rank}. </br> <i class="fas fa-align-justify"></i></p>`
      );
    rankContainer.append(rankEl);
    rank++;
    if (check) {
      movieContainerEl.append(rankContainer);
    }

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

// apply draggable to seen list
const sortable = new Draggable.Sortable(document.querySelectorAll("ol"), {
  draggable: "li",
  handle: ".handle",
});
sortable.on("sortable:stop", () => sortHandler());
var sortHandler = function () {
  var id = $(".draggable-source--is-dragging").attr("id");
  var newList = seenlist.filter((imdbId) => imdbId.imdbID != id);
  seenlist = newList;
  getOmdb(id, 3);
};


// click hanlders for search submit button and close modal buttons
$("#search-btn").on("click", function () {
  var movieTitle = movieInputEl.value.trim();
  if (movieTitle) {
    event.preventDefault();

    $("#search-modal").addClass("is-active");
    resultsMovieContainerEl.innerHTML = "";
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
  $("#search-results-container").html("");
});

// determines which html page is on and loads correct list
var loadMovieList = function () {
  if (document.URL.includes("index.html")) {
    displayMovieList(0);
  } else if (document.URL.includes("seen-list.html")) {
    displayMovieList(1);
  }
};

// click on to add from search results to watchlist
$("#search-results-container").on(
  "click",
  "#add-to-watch-list-btn",
  function () {
    //set movieid to the clicked button's parent's id. use same method to send movieId to seen list page
    var movieId = $(this).parent().attr("id");
    //added class that tells sameMovieClicked function which
    $(this).addClass("clicked-on");
    //second number being sent tells getImdbId wether to add to watch(0) or seen(1)
    getImdbId(movieId, 0);
  }
);

// click on to add from search results to seenlist
$("#search-results-container").on(
  "click",
  "#add-to-seen-list-btn",
  function () {
    //set movieid to the clicked button's parent's id. use same method to send movieId to seen list page
    var movieId = $(this).parent().attr("id");
    //added class that tells sameMovieClicked function which
    $(this).addClass("clicked-on");
    //second number being sent tells getImdbId wether to add to watch(0) or seen(1)
    getImdbId(movieId, 1);
  }
);

// click on to add from trending results to watchlist
$("#trending-movie-container").on(
  "click",
  "#add-to-watch-list-btn",
  function () {
    //set movieid to the clicked button's parent's id. use same method to send movieId to seen list page
    var movieId = $(this).parent().attr("id");
    //added class that tells sameMovieClicked function which
    $(this).addClass("clicked-on");
    //second number being sent tells getImdbId wether to add to watch(0) or seen(1)
    getImdbId(movieId, 0);
  }
);

// click on to add from trending results to seenlist
$("#trending-movie-container").on(
  "click",
  "#add-to-seen-list-btn",
  function () {
    //set movieid to the clicked button's parent's id. use same method to send movieId to seen list page
    var movieId = $(this).parent().attr("id");
    //added class that tells sameMovieClicked function which
    $(this).addClass("clicked-on");
    //second number being sent tells getImdbId wether to add to watch(0) or seen(1)
    getImdbId(movieId, 1);
  }
);

// click on to move movie from watchlist to seenlist
$("#watch-list-container").on("click", "#add-to-seen-list-btn", function () {
  //set movieid to the clicked button's parent's id. use same method to send movieId to seen list page
  var movieId = $(this).parent().attr("id");
  //added class that tells sameMovieClicked function which
  $(this).addClass("clicked-on");
  //second number being sent tells getImdbId wether to add to watch(0) or seen(1)
  deleteWatchMovie(movieId);
  getImdbId(movieId, 1);
});

// click on to delete movie from watch-list
$("#watch-list-container").on("click", "#delete-movie-btn", function () {
  //set movieid to the clicked button's parent's id. use same method to send movieId to seen list page
  var movieId = $(this).parent().attr("id");
  //added class that tells sameMovieClicked function which
  $(this).addClass("clicked-on");
  deleteWatchMovie(movieId);
});

// click on to delete movie from seen-list
$("#seen-list-container").on("click", "#delete-movie-btn", function () {
  //set movieid to the clicked button's parent's id. use same method to send movieId to seen list page
  var movieId = $(this).parent().attr("id");
  //added class that tells sameMovieClicked function which
  $(this).addClass("clicked-on");
  deleteSeenMovie(movieId);
});

// click hanlders for trending submit button and close modal buttons
$("#trending-btn").on("click", function () {
  event.preventDefault();
  var trendingGenre = $("#select-genre option:selected").attr("id");
  var trendingRating = $("input[type=radio][name=rating]:checked").attr("id");
  trendingMovieContainerEl.innerHTML = "";
  $("#trending-modal").addClass("is-active");
  if (!trendingGenre || !trendingRating) {
    trendingMovieContainerEl.textContent =
      "Please select a Genre AND a Rating.";
  } else {
    getTrendingMovie(trendingGenre, trendingRating);
  }
});
$(".delete").on("click", function () {
  $("#trending-modal").removeClass("is-active");
  $("#trending-movie-container").html("");
});

// nav bar burger for touch media screens
$(document).ready(function () {
  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function () {
    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });
});

loadMovieList();
