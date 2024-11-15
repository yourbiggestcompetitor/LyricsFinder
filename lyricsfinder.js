const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const favoritesContainer = document.getElementById("favorites");

const apiURL = "https://api.lyrics.ovh";

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchValue = search.value.trim();

  if (!searchValue) {
    alert("You did not search for anything!");
  } else {
    searchSong(searchValue);
  }
});

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

result.addEventListener("click", (e) => {
  const clickElement = e.target;

  if (clickElement.classList.contains("favorite-btn")) {
    const artist = clickElement.getAttribute("data-artist");
    const songTitle = clickElement.getAttribute("data-songtitle");

    addToFavorites(artist, songTitle);
  }

  if (clickElement.classList.contains("get-lyrics-btn")) {
    const artist = clickElement.getAttribute("data-artist");
    const songTitle = clickElement.getAttribute("data-songtitle");
    getLyrics(artist, songTitle);
  }
});

function addToFavorites(artist, songTitle) {
  const songExists = favorites.some(
    (song) => song.artist === artist && song.title === songTitle
  );
  if (!songExists) {
    const song = { artist, title: songTitle };
    favorites.push(song);

    localStorage.setItem("favorites", JSON.stringify(favorites));

    displayFavorites();
  } else {
    alert("This song is already in your favorites!");
  }
}

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

displayFavorites();

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

function goBack() {
  searchSong(search.value.trim());
}

document.getElementById("nightMode").addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    this.textContent = "Switch";
  } else {
    this.textContent = "Switch";
  }
});
