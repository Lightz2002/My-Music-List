// Song Class: Represents a Song
class Song {
  constructor(singer, songName) {
    this.singer = singer;
    this.songName = songName;
  }
}

// UI Class : Handle UI Tasks
class UI {
  static displaySongs() {
    const songs = Store.getSongs();
    songs.forEach((song) => UI.addSongs(song));
  }

  static addSongs(song) {
    const list = document.querySelector("#song-list");
    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="singer">${song.singer}</td>
      <td class="songName">${song.songName}</td>
      <td><i class="fas fa-trash delete"></i></td>
    `;

    list.appendChild(row);
  }
  static clearInputs() {
    document.querySelector("#singer").value = "";
    document.querySelector("#song-name").value = "";
  }

  static deleteSong(element) {
    if (element.classList.contains("delete")) {
      element.parentElement.parentElement.remove();
    }
  }

  static searchSong(element) {
    const singers = document.querySelectorAll(".singer");
    const songNames = document.querySelectorAll(".songName");
    singers.forEach((singer) => {
      if (singer.innerText.indexOf(element) > -1 || singer.nextElementSibling.innerText.indexOf(element) > -1) {
        singer.parentElement.style.display = "";
      } else {
        singer.parentElement.style.display = "none";
      }
    });
  }

  static showAlert(message, className) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${className}`;
    alert.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#music-form");
    container.insertBefore(alert, form);

    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }
}
// Store Class : Handles Storage
class Store {
  static getSongs() {
    let songs;
    if (localStorage.getItem("songs") === null) {
      songs = [];
    } else {
      songs = JSON.parse(localStorage.getItem("songs"));
    }

    return songs;
  }

  static addSongs(song) {
    const songs = Store.getSongs();
    songs.push(song);
    localStorage.setItem("songs", JSON.stringify(songs));
  }

  static removeSongs(songName) {
    const songs = Store.getSongs();
    songs.forEach((song, index) => {
      if (song.songName === songName) {
        songs.splice(index, 1);
      }
    });

    localStorage.setItem("songs", JSON.stringify(songs));
  }
}

// Event : Display Songs
document.addEventListener("DOMContentLoaded", UI.displaySongs);

// Event : Add A Song
const form = document.querySelector("#music-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const singer = document.querySelector("#singer").value;
  const songName = document.querySelector("#song-name").value;

  // Validate
  if (singer == "" || songName == "") {
    UI.showAlert("Please fill in the inputs", "danger");
  } else {
    // Instantiate Song
    const song = new Song(singer, songName);

    // Add Songs To UI
    UI.addSongs(song);

    // Add Songs to Storage
    Store.addSongs(song);

    // Clear Inputs
    UI.clearInputs();

    UI.showAlert("The Song Has Been Added", "success");
  }
});

// Event: Search A Song
const searchForm = document.querySelector(".search-form");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let search = document.querySelector(".search").value;

  // Search Song From UI
  UI.searchSong(search);
});

// Event : Remove A Song
// Remove Song From UI
document.querySelector("#song-list").addEventListener("click", (e) => {
  UI.deleteSong(e.target);

  // Remove Song From Storage
  Store.removeSongs(e.target.parentElement.previousElementSibling.textContent);

  // Show Success Message
  UI.showAlert("The Song Has Been Deleted", "success");
});
