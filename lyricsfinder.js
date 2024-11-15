const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const favoritesContainer = document.getElementById("favorites");

// API URL for lyrics
const apiURL = "https://api.lyrics.ovh";

// Create an empty array for storing favorite songs
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Event listener for form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchValue = search.value.trim();

  if (!searchValue) {
    alert("You did not search for anything!");
  } else {
    searchSong(searchValue);
  }
});

// Function to search for songs
async function searchSong(searchValue) {
  try {
    const searchResult = await fetch(`${apiURL}/suggest/${searchValue}`);
    const data = await searchResult.json();
    if (data && data.data) {
      showData(data);
    } else {
      alert("No results found");
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}

// Function to display search results
function showData(data) {
  result.innerHTML = `
    <ul class="song-list">
      ${data.data
        .map(
          (song) => `
        <li>
          <div>
            <img src="${song.artist.picture}" alt="${song.artist.name}" width="50" />
            <strong>${song.artist.name}</strong>
          </div>
          <div>
            <span><strong>${song.title}</strong></span>
            <button class="get-lyrics-btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
            <button class="favorite-btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Add to Favorites</button>
          </div>
        </li>
      `
        )
        .join("")}
    </ul>
  `;
}

// Event listener for clicking on the "Add to Favorites" button and "Get Lyrics" button
result.addEventListener("click", (e) => {
  const clickElement = e.target;

  // Check if clicked element is the "Add to Favorites" button
  if (clickElement.classList.contains("favorite-btn")) {
    const artist = clickElement.getAttribute("data-artist");
    const songTitle = clickElement.getAttribute("data-songtitle");

    addToFavorites(artist, songTitle);
  }

  // Check if clicked element is the "Get Lyrics" button
  if (clickElement.classList.contains("get-lyrics-btn")) {
    const artist = clickElement.getAttribute("data-artist");
    const songTitle = clickElement.getAttribute("data-songtitle");
    getLyrics(artist, songTitle);
  }
});

// Add song to favorites
function addToFavorites(artist, songTitle) {
  // Check if the song is already in the favorites
  const songExists = favorites.some(
    (song) => song.artist === artist && song.title === songTitle
  );
  if (!songExists) {
    const song = { artist, title: songTitle };
    favorites.push(song);

    // Save to localStorage
    localStorage.setItem("favorites", JSON.stringify(favorites));

    // Display the updated favorites
    displayFavorites();
  } else {
    alert("This song is already in your favorites!");
  }
}

// Display the favorites list
function displayFavorites() {
  if (favorites.length === 0) {
    favoritesContainer.innerHTML = "<p>No favorite songs yet.</p>";
  } else {
    favoritesContainer.innerHTML = `
      <h2>Your Favorites</h2>
      <ul class="song-list">
        ${favorites
          .map(
            (song) => `
          <li>
            <div>
              <strong>${song.artist}</strong> - ${song.title}
            </div>
          </li>
        `
          )
          .join("")}
      </ul>
    `;
  }
}

// Initial call to display the favorites when the page loads
displayFavorites();

// Fetch lyrics for a song
async function getLyrics(artist, songTitle) {
  try {
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();

    if (data.lyrics) {
      const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");

      result.innerHTML = `
        <div class="full-lyrics">
          <h2>${artist} - ${songTitle}</h2>
          <p>${lyrics}</p>
        </div>
        <button class="back-btn" onclick="goBack()">Back to Search Results</button>
      `;
    } else {
      alert("Lyrics not found");
    }
  } catch (error) {
    console.error("Error fetching lyrics: ", error);
  }
}

// Back button functionality to go back to the search results
function goBack() {
  searchSong(search.value.trim()); // Refetch results using the current search term
}

// JavaScript for toggling between light and dark mode
document.getElementById("nightMode").addEventListener("click", function () {
  // Toggle dark mode class on the body
  document.body.classList.toggle("dark-mode");

  // Change the text of the button based on the mode
  if (document.body.classList.contains("dark-mode")) {
    this.textContent = "Switch";
  } else {
    this.textContent = "Switch";
  }
});
