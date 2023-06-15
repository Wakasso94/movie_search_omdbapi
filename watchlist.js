const addWatchlist = document.getElementById('add-watchlist');

document.addEventListener('DOMContentLoaded', async function () {
    const apiKey = '27413394';
    const watchlistContainer = document.getElementById('watchlist');
    const watchlist = localStorage.getItem('watchlist');

    if (watchlist) {
        const movies = JSON.parse(watchlist);

        movies.forEach(async movie => {
            const movieContainer = document.createElement('div');
            movieContainer.id = `movie-${movie.imdbID}`;
            movieContainer.innerHTML = `
                <div id="movie">
                    <img id="movie-img" src="${movie.Poster}" alt="${movie.Title}">
                    <div id="movie-content">
                        <h3 id="movie-title">${movie.Title} <span id="movie-rating"></span> </h3>
                        <div id="movie-details">
                            <p id="movie-time"></p>
                            <p id="movie-genre"></p>
                            <button id="btn-add-movie"><span id="remove">-</span>remove</button>
                        </div>
                        <p id="movie-info"></p>
                    </div>
                </div>
                <div id="divider-watchlist"></div>
            `;

            const movieTime = movieContainer.querySelector('#movie-time');
            const movieGenre = movieContainer.querySelector('#movie-genre');
            const addButton = movieContainer.querySelector('#btn-add-movie');
            const moviePlot = movieContainer.querySelector('#movie-info');
            const movieRating = movieContainer.querySelector('#movie-rating');

            // Fetch additional details for the movie
            const movieDetailsUrl = `https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`;
            const detailsRes = await fetch(movieDetailsUrl);
            const detailsData = await detailsRes.json();

            if (detailsData.Response === "True") {
                movieRating.textContent = `⭐ ${detailsData.imdbRating}`;
                movieGenre.textContent = detailsData.Genre;
                movieTime.textContent = detailsData.Runtime;
                moviePlot.textContent = detailsData.Plot;
            }

            watchlistContainer.appendChild(movieContainer);

            addButton.addEventListener('click', function () {
                removeFromWatchlist(movie);
            });
        });

        if (movies.length === 0) {
            displayAddWatchlistContent();
        } else {
            addWatchlist.style.display = "none";
        }
    } else {
        displayAddWatchlistContent();
    }
});

function displayAddWatchlistContent() {
    addWatchlist.style.display = "block";
}

function removeFromWatchlist(movie) {
    const watchlist = localStorage.getItem('watchlist');

    if (watchlist) {
        let movies = JSON.parse(watchlist);
        const movieIndex = movies.findIndex(m => m.imdbID === movie.imdbID);

        if (movieIndex !== -1) {
            movies.splice(movieIndex, 1);
            localStorage.setItem('watchlist', JSON.stringify(movies));

            // Remove the movie element from the UI
            const movieElement = document.getElementById(`movie-${movie.imdbID}`);
            if (movieElement) {
                movieElement.remove();
            }

            if (movies.length === 0) {
                displayAddWatchlistContent();
            }
        }
    }
}
