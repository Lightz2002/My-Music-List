const container = document.querySelector(".container");
const singerInput = document.querySelector("#singer");
const songNameInput = document.querySelector("#song-name");
const urlInput = document.querySelector("#url");
const searchInput = document.querySelector(".search");
const form = document.querySelector("#music-form");
const songList = document.querySelector("#song-list");
// Song Class: Represents a Song
class Song {
    constructor(id, singer, songName, url) {
        this.id = id;
        this.singer = singer;
        this.songName = songName;
        this.url = url;
    }
}

// UI Class : Handle UI Tasks
class UI {
    static displaySongs() {
        const songs = Store.getSongs();

        songs.forEach((song) => {
            UI.AddSongToList(song);
        });
    }

    static AddSongToList(song) {
        const row = document.createElement("tr");

        row.setAttribute("data-id", song.id);
        row.classList.add("song-list-item");
        row.innerHTML = `
        <td>${song.singer}</td>
        <td>${song.songName}</td>
        <td>${song.url}</td>
        <td><button class='fas fa-trash bg-transparent border-0 text-white delete'></button></td>
        `;

        songList.appendChild(row);
    }

    static clearInputs() {
        singerInput.value = "";
        songNameInput.value = "";
        urlInput.value = "";
    }

    static removeSong(e) {
        if (e.classList.contains("delete")) {
            e.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement("div");
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        container.insertBefore(div, form);

        setTimeout(() => {
            div.remove();
        }, 3000);
    }

    static createId() {
        return "_" + Math.random().toString(36).substr(2, 9);
    }

    static filterSong(input) {
        const songs = Store.getSongs();

        songs.forEach((song) => {
            if (
                song.singer.indexOf(input) >= 0 ||
                song.songName.indexOf(input) >= 0 ||
                song.url.indexOf(input) >= 0
            ) {
                UI.AddSongToList(song);
            }
        });
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
        let songs = Store.getSongs();
        songs.push(song);
        localStorage.setItem("songs", JSON.stringify(songs));
    }

    static removeSongs(id) {
        let songs = Store.getSongs();
        songs.forEach((song, index) => {
            if (song.id === id) {
                songs.splice(index, 1);
            }
        });
        localStorage.setItem("songs", JSON.stringify(songs));
    }
}

// Event : Display Songs
document.addEventListener("DOMContentLoaded", UI.displaySongs());

// Event : Add A Song
form.addEventListener("submit", function (e) {
    e.preventDefault();
    // Get Form Values
    const id = UI.createId();
    const singer = singerInput.value;
    const songName = songNameInput.value;
    const url = urlInput.value;

    // Validate
    if (singer === "" || songName === "") {
        UI.showAlert("Please Fill In The Inputs", "danger");
    } else {
        // Instantiate A Song
        const song = new Song(id, singer, songName, url);

        // Add Song To UI
        UI.AddSongToList(song);

        // Add Song To Store
        Store.addSongs(song);

        // Clear Input
        UI.clearInputs();

        // Show Alert
        UI.showAlert("The Song Has Been Successfully Added", "success");
    }
});

// Event: Search A Song
searchInput.addEventListener("input", function (e) {
    songList.innerHTML = "";
    UI.filterSong(searchInput.value);
});

// Event : Remove A Song
songList.addEventListener("click", function (e) {
    // Remove Song From UI
    UI.removeSong(e.target);
    // Remove Song From Store
    Store.removeSongs(e.target.parentElement.parentElement.dataset.id);

    // Show Success Message
    UI.showAlert("The Song Has Been Deleted", "success");
});
