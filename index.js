const searchForm = document.getElementById('search');
const inputField = document.getElementById('input-field');
const moviesList = document.getElementById('movies-list');
const startExplore = document.getElementById('start-explore');

// Add event listener to the search form
searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const query = inputField.value;
    findMovie(query);
});

// Function to display movies on the page
function displayMovies(movies) {
    startExplore.style.display = "none";
    movies.forEach(async movie => {
        const movieContainer = document.createElement('div');
        movieContainer.id = "movie-container";
        movieContainer.innerHTML = `
            <div id="movie">
                <img id="movie-img" src="${movie.Poster}" alt="${movie.Title}">
                <div id="movie-content">
                    <h3 id="movie-title">${movie.Title} <span id="movie-rating"></span> </h3>
                    <div id="movie-details">
                        <p id="movie-time"></p>
                        <p id="movie-genre"></p>
                        <button id="btn-add-movie"><span id="add">+</span>Watchlist</button>
                    </div>
                    <p id="movie-info"></p>
                </div>
            </div>
            <div id="divider"></div>
        `;

        const movieTime = movieContainer.querySelector('#movie-time');
        const movieGenre = movieContainer.querySelector('#movie-genre');
        const addButton = movieContainer.querySelector('#btn-add-movie');
        const moviePlot = movieContainer.querySelector('#movie-info');
        const movieRating = movieContainer.querySelector('#movie-rating');

        addButton.addEventListener('click', function () {
            addToWatchlist(movie);
        });

        const apiKey = '27413394';
        const movieDetailsUrl = `https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`;
        const detailsRes = await fetch(movieDetailsUrl);
        const detailsData = await detailsRes.json();

        if (detailsData.Response === "True") {
            movieRating.textContent = `⭐ ${detailsData.imdbRating}`;
            movieGenre.textContent = detailsData.Genre;
            movieTime.textContent = detailsData.Runtime;
            moviePlot.textContent = detailsData.Plot;
        }

        moviesList.appendChild(movieContainer);
    });
}

// Function to find movies
async function findMovie(query) {
    const apiKey = '27413394';
    const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    moviesList.innerHTML = ""; // Clear the previous movie list

    if (data.Response === "True") {
        displayMovies(data.Search);

        // Save movies to localStorage
        localStorage.setItem('movies', JSON.stringify(data.Search));
    } else {
        startExplore.style.display = "none";
        const movieNotFound = document.createElement('div');
        movieNotFound.id = 'movie-not-found';
        const movieError = document.createElement('p');
        movieError.id = 'movie-error';
        movieError.textContent = "Unable to find what you’re looking for. Please try another search.";
        moviesList.appendChild(movieNotFound);
        movieNotFound.appendChild(movieError);
    }
}

// Load stored movies when the page is loaded
document.addEventListener('DOMContentLoaded', function () {
    const storedMovies = localStorage.getItem('movies');

    if (storedMovies) {
        const parsedMovies = JSON.parse(storedMovies);
        displayMovies(parsedMovies);
    }
});

// Function to add movies to the watchlist
function addToWatchlist(movie) {
    let watchlist = localStorage.getItem('watchlist');

    if (watchlist) {
        watchlist = JSON.parse(watchlist);
    } else {
        watchlist = [];
    }

    const movieExists = watchlist.some(item => item.imdbID === movie.imdbID);

    if (!movieExists) {
        watchlist.push(movie);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }
}
