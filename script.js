let movieObject = {
    1: {
        title: "jurassic park",
        rating: 0,
        upvote: 10,
        downvote: 2
    },
    2: {
        title: "back to the future 2",
        rating: 0,
        upvote: 13,
        downvote: 4
    },
    3: {
        title: "raiders of the lost arc",
        rating: 0,
        upvote: 33,
        downvote: 4,
    },
    4:
    {
        title: "robocop",
        rating: 0,
        upvote: 7,
        downvote: 1
    },
    5:
    {
        title: "love actually",
        rating: 0,
        upvote: 9,
        downvote: 13
    }
}

const movieSection = document.getElementById("add-movie-section");
const hiddenSection = document.getElementById("hidden");

movieSection.addEventListener("click", () => { hiddenSection.classList.toggle("on") });

const movieListUL = document.getElementById("movie-list");
let userAlert = document.getElementById("user-alert");
document.getElementById("add-movie").addEventListener("click", (e) => { addMovie(e) });

function clearInput(input) {
    input.value = "";
    userAlert.innerHTML = "&nbsp";
}

generateMovies()

function generateMovies() {
    for (const properties in movieObject) {
        new Movie(properties).Initialize();
    }
}

function movieScore(upvote, downvote) {
    return Math.round(upvote/(upvote + downvote) * 100)
}

console.log(movieScore(993, 13))

function Movie(key) {
    let movieId = [key];
    let movieTitle = movieObject[key].title;
    // let movieRating = movieObject[key].upvote - movieObject[key].downvote
    let movieRating = movieScore(movieObject[key].upvote, movieObject[key].downvote)

    this.Initialize = initialize;

    return;

    function initialize() {

        // create li and spans with classes
        const liNode = document.createElement("li");
        liNode.setAttribute("data-id", movieId);
        const titleSpan = document.createElement("span");
        titleSpan.setAttribute("class", "movie-title");
        const ratingSpan = document.createElement("span");
        ratingSpan.setAttribute("class", "rating");
        const thumbsSpan = document.createElement("span");
        const thumbUp = document.createElement("span");
        thumbUp.setAttribute("class", "thumb-up");
        const thumbDown = document.createElement("span");
        thumbDown.setAttribute("class", "thumb-down");

        // add event listeners to thumbs
        thumbUp.addEventListener("click", (e) => { findMovie(e, "up") });
        thumbDown.addEventListener("click", (e) => { findMovie(e, "down") });

        // populating new dom elements with text and thumb emojis
        const titleText = document.createTextNode(movieTitle);
        const ratingNumber = document.createTextNode(movieRating);
        thumbUp.innerHTML = "👍";
        thumbDown.innerHTML = "👎";

        // building li and placing spans
        liNode.appendChild(titleSpan);
        titleSpan.appendChild(titleText);
        ratingSpan.appendChild(ratingNumber);
        liNode.append(ratingSpan);
        thumbsSpan.append(thumbUp, thumbDown);
        liNode.append(thumbsSpan);

        // sort movies if there are more than one, otherwise add first movie
        if (movieListUL.children.length > 0) {
            sortMovies(liNode);
        } else {
            movieListUL.append(liNode);
        }
    }
}

function sortMovies(movie) {
    // currentMovieRating = movieObject[movie.dataset.id].upvote - movieObject[movie.dataset.id].downvote;
    currentMovieRating = movieScore(movieObject[movie.dataset.id].upvote, movieObject[movie.dataset.id].downvote)
    previousMovie = movieListUL.firstChild;
    do {
        previousMovieRating = parseInt(previousMovie.querySelector(".rating").innerHTML);
        if (currentMovieRating > previousMovieRating) {
            previousMovie.before(movie)
        }
        else if (previousMovie === movieListUL.lastChild) {
            previousMovie.after(movie)
            return
        }
        else {
            previousMovie = previousMovie.nextElementSibling;
        }
    } while (currentMovieRating <= previousMovieRating)
}

function findMovie(e, vote) {
    selectedMovie = movieObject[e.target.parentNode.parentNode.dataset.id];
    movieLi = e.target.parentNode.parentNode;

    if (vote === "up") {
        selectedMovie.upvote += 1
    } else if (vote === "down") {
        selectedMovie.downvote += 1
    }

    // selectedMovieRating = selectedMovie.upvote - selectedMovie.downvote;
    selectedMovieRating = movieScore(selectedMovie.upvote, selectedMovie.downvote)
    
    movieLi.querySelector(".rating").innerHTML = selectedMovieRating;

    if (movieLi === movieListUL.firstChild) {
        prevMovie = NaN
    } else {
        prevMovie = parseInt(movieLi.previousElementSibling.querySelector(".rating").innerHTML);
    }
    if (movieLi === movieListUL.lastChild) {
        nextMovie = NaN
    } else {
        nextMovie = parseInt(movieLi.nextElementSibling.querySelector(".rating").innerHTML);
    }

    if (selectedMovieRating > prevMovie || selectedMovieRating < nextMovie && (selectedMovieRating != parseInt(movieLi.nextElementSibling.querySelector(".rating").innerHTML))) {
        movieLi.classList.add("move");
        setTimeout(() => {
            sortMovies(movieLi);
        }, 250)
        setTimeout(() => {
            movieLi.classList.remove("move");
        }, 500)
    } else {
        movieListUL.querySelectorAll('.move').forEach((element) => {
            element.classList.remove('move');
        });
        return
    }

}

function addMovie(event) {
    event.preventDefault();

    let movieName = document.getElementById("movie-name").value.trim().toLowerCase();
    let movieId = (Object.keys(movieObject).length + 1)
    let movieList = Object.values(movieObject);

    if (movieList.find(({ title }) => title === movieName)) {
        userAlert.innerHTML = "Movie already listed";
    } else if (movieName === "" || movieName == "enter movie title") {
        userAlert.innerHTML = "Enter a valid movie title";
    } else {
        movieObject[movieId] = { title: movieName, rating: 0, upvote: 0, downvote: 0 };
        movieListUL.innerHTML = "";
        userAlert.innerHTML = "Movie added";
        generateMovies()
    }
}
