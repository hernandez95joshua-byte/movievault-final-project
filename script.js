// ======================================
// OMDb API
// ======================================

const API_KEY = "adda212e";
const BASE_URL = "https://www.omdbapi.com/";


// ======================================
// DOM ELEMENTS
// ======================================

const searchForm =
  document.getElementById("searchForm");

const searchInput =
  document.getElementById("searchInput");

const movieGrid =
  document.getElementById("movieGrid");

const loader =
  document.getElementById("loader");

const message =
  document.getElementById("message");

const sortSelect =
  document.getElementById("sortSelect");

const resultsTitle =
  document.getElementById("resultsTitle");

const popularButtons =
  document.querySelectorAll(
    ".popular-searches button"
  );


// Store current movies
let currentMovies = [];


// ======================================
// SHOW LOADING
// ======================================

function showLoader() {
  loader.style.display = "block";
  movieGrid.style.display = "none";
  message.style.display = "none";
}


// ======================================
// HIDE LOADING
// ======================================

function hideLoader() {
  loader.style.display = "none";
  movieGrid.style.display = "grid";
}


// ======================================
// SHOW MESSAGE
// ======================================

function showMessage(text) {

  message.textContent = text;
  message.style.display = "block";

}


// ======================================
// SEARCH MOVIES
// ======================================

async function searchMovies(movieName) {

  if (!movieName.trim()) {
    showMessage(
      "Please enter a movie name."
    );
    return;
  }

  showLoader();

  try {

    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(movieName)}&type=movie`
    );

    if (!response.ok) {
      throw new Error(
        "Network response was not successful."
      );
    }

    const data = await response.json();

    if (data.Response === "False") {

      currentMovies = [];

      hideLoader();

      movieGrid.innerHTML = "";

      resultsTitle.textContent =
        "No Results";

      showMessage(
        `No movies found for "${movieName}". Try another title.`
      );

      return;
    }

    currentMovies = data.Search;

    resultsTitle.textContent =
      `Results for "${movieName}"`;

    sortSelect.value = "default";

    displayMovies(currentMovies);

  } catch (error) {

    console.error(error);

    hideLoader();

    movieGrid.innerHTML = "";

    showMessage(
      "Something went wrong while loading the movies. Please try again."
    );

  }

}


// ======================================
// DISPLAY MOVIES
// ======================================

function displayMovies(movies) {

  hideLoader();

  message.style.display = "none";

  movieGrid.innerHTML = "";

  movies.forEach((movie) => {

    const card =
      document.createElement("article");

    card.classList.add("movie-card");


    // If OMDb has no poster
    const poster =
      movie.Poster !== "N/A"
        ? movie.Poster
        : "https://placehold.co/400x600/151a24/ffffff?text=No+Poster";


    card.innerHTML = `

      <div class="poster-container">

        <img
          class="movie-poster"
          src="${poster}"
          alt="${movie.Title} poster"
          loading="lazy"
        />

        <span class="movie-type">
          ${movie.Type}
        </span>

      </div>


      <div class="movie-info">

        <h3>
          ${movie.Title}
        </h3>

        <p class="movie-year">
          ${movie.Year}
        </p>

        <p class="movie-id">
          ${movie.imdbID}
        </p>

      </div>

    `;

    movieGrid.appendChild(card);

  });

}


// ======================================
// SEARCH FORM
// ======================================

searchForm.addEventListener(
  "submit",
  function (event) {

    event.preventDefault();

    const movieName =
      searchInput.value.trim();

    searchMovies(movieName);

    document
      .getElementById("movies")
      .scrollIntoView({
        behavior: "smooth"
      });

  }
);


// ======================================
// POPULAR MOVIE BUTTONS
// ======================================

popularButtons.forEach((button) => {

  button.addEventListener(
    "click",
    function () {

      const movie =
        button.dataset.movie;

      searchInput.value = movie;

      searchMovies(movie);

      document
        .getElementById("movies")
        .scrollIntoView({
          behavior: "smooth"
        });

    }
  );

});


// ======================================
// SORT MOVIES
// ======================================

sortSelect.addEventListener(
  "change",
  function () {

    const sortValue =
      sortSelect.value;

    let sortedMovies =
      [...currentMovies];


    // A - Z
    if (sortValue === "az") {

      sortedMovies.sort(
        (a, b) =>
          a.Title.localeCompare(b.Title)
      );

    }


    // Z - A
    else if (sortValue === "za") {

      sortedMovies.sort(
        (a, b) =>
          b.Title.localeCompare(a.Title)
      );

    }


    // NEWEST
    else if (
      sortValue === "newest"
    ) {

      sortedMovies.sort(
        (a, b) =>
          getYear(b.Year) -
          getYear(a.Year)
      );

    }


    // OLDEST
    else if (
      sortValue === "oldest"
    ) {

      sortedMovies.sort(
        (a, b) =>
          getYear(a.Year) -
          getYear(b.Year)
      );

    }

    displayMovies(sortedMovies);

  }
);


// ======================================
// GET YEAR
// Handles values such as:
// 2008
// 2008–2012
// ======================================

function getYear(year) {

  const parsedYear =
    parseInt(year, 10);

  return Number.isNaN(parsedYear)
    ? 0
    : parsedYear;

}


// ======================================
// LOAD DEFAULT MOVIES
// ======================================

window.addEventListener(
  "DOMContentLoaded",
  () => {

    searchMovies("Batman");

  }
);