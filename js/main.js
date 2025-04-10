const movieInput = document.getElementById("movieInput");
const searchButton = document.getElementById("searchButton");
const movieResults = document.getElementById("movieResults");

const apiKeyOne = "5e432e8ec486bc775f4a83202faf5797";  
const apiKeyTwo = "e0f7000c"; 

// fetch movies from TMDb API
const fetchMovies = (query) => {
    const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKeyOne}&query=${query}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayMovies(data.results);
        })
        .catch(error => console.error("Error fetching movies:", error));
};

// fetch movie details from OMDb API
const fetchMovieDetails = (movieTitle) => {
    const apiUrl = `https://www.omdbapi.com/?t=${movieTitle}&apikey=${apiKeyTwo}`;  
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayMovieDetails(data, movieTitle);
        })
        .catch(error => console.error("Error fetching movie details:", error));
};

// display movie results from TMDb
const displayMovies = (movies) => {
    movieResults.innerHTML = '';  // clear previous results

    if (movies.length === 0) {
        movieResults.innerHTML = "<p>No movies found. Please try another search.</p>";
        return;
    }

    movies.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        const movieImage = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        movieCard.innerHTML = `
            <img src="${movieImage}" alt="${movie.title}">
            <div class="content">
                <h3>${movie.title}</h3>
                <p>${movie.release_date}</p>
                <button class="movie-details-button" data-movie-title="${movie.title}">More Info</button>
            </div>
            <div class="movie-details-container" id="details-${movie.id}" style="display: none;"></div>
        `;

        movieResults.appendChild(movieCard);

        // add event listener "More Info" button
        const detailsButton = movieCard.querySelector(".movie-details-button");
        detailsButton.addEventListener("click", () => {
            const movieTitle = detailsButton.getAttribute("data-movie-title");
            fetchMovieDetails(movieTitle);  // fetch movie details using movie title
            toggleDetails(movieCard);  // toggle movie details
        });
    });
};

// toggle movie details 
const toggleDetails = (movieCard) => {
    const detailsContainer = movieCard.querySelector(".movie-details-container");
    const isVisible = detailsContainer.style.display === "block";
    detailsContainer.style.display = isVisible ? "none" : "block";
};

// display movie details from OMDb
const displayMovieDetails = (movieData, movieTitle) => {
    const movieCard = Array.from(movieResults.children).find(card =>
        card.querySelector("h3").textContent === movieTitle
    );
    const detailContainer = movieCard.querySelector(".movie-details-container");

    if (movieData.Response === "True") {
        detailContainer.innerHTML = `
            <div class="movie-details">
                <p><strong>Genre:</strong> ${movieData.Genre}</p>
                <p><strong>Released:</strong> ${movieData.Released}</p>
                <p><strong>Plot:</strong> ${movieData.Plot}</p>
                <a href="${movieData.Website}" target="_blank">More on Wikipedia</a>
            </div>
        `;
    } else {
        detailContainer.innerHTML = `<p>No additional details available.</p>`;
    }
};

// handle search button click
searchButton.addEventListener("click", () => {
    const query = movieInput.value.trim();
    if (query) {
        fetchMovies(query);
    } else {
        alert("Please enter a movie name");
    }
});
