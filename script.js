// Song Class: Represents a Song
class Song {
    constructor(singer, songName, url) {
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
        const list = document.querySelector("#song-list");
        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${song.singer}</td>
        <td>${song.songName}</td>
        <td>${song.url}</td>
        <td><button class='fas fa-trash bg-transparent border-0 text-white delete'></button></td>
    `;
        list.appendChild(row);
    }

    static clearInputs() {
        document.querySelector("#singer").value = "";
        document.querySelector("#song-name").value = "";
        document.querySelector("#url").value = "";
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
        const container = document.querySelector(".container");
        const form = document.querySelector("#music-form");
        container.insertBefore(div, form);

        setTimeout(() => {
            div.remove();
        }, 3000);
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

    static removeSongs(url) {
        let songs = Store.getSongs();
        songs.forEach((song, index) => {
            if (song.url === url) {
                songs.splice(index, 1);
            }
        });
        localStorage.setItem("songs", JSON.stringify(songs));
    }
}

// Event : Display Songs
document.addEventListener("DOMContentLoaded", UI.displaySongs());

// Event : Add A Song
document.querySelector("#music-form").addEventListener("submit", (e) => {
    e.preventDefault();

    // Get Form Values
    const singer = document.querySelector("#singer").value;
    const songName = document.querySelector("#song-name").value;
    const url = document.querySelector("#url").value;

    // Validate
    if (singer === "" || songName === "" || url === "") {
        UI.showAlert("Please Fill In The Inputs", "danger");
    } else {
        // Instantiate A Song
        const song = new Song(singer, songName, url);

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

// Event : Remove A Song
document.querySelector("#song-list").addEventListener("click", (e) => {
    // Remove Song From UI
    UI.removeSong(e.target);
    // Remove Song From Store
    Store.removeSongs(e.target.parentElement.previousElementSibling.textContent);

    // Show Success Message
    UI.showAlert("The Song Has Been Deleted", "success");
});
