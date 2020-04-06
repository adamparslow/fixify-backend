function getPlaylists(next) {
    showPlaylistsDiv();

    var data = {
        headers: {
            Authorization: 'Bearer ' + token
        }
    };

    url = next !== undefined ? next : 
        apiUrl + 'v1/me/playlists?limit=50';

    fetch(url, data)
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            if (json.items.length === json.limit) {
                getPlaylists(json.next);
            }
            generatePlaylistContainer(json);
        });
}

function generatePlaylistContainer(playlistJson) {
    const container = document.getElementById('playlistContainer');
    playlistJson.items.forEach((playlist) => {
        const button = document.createElement('button');
        button.innerHTML = playlist.name;
        button.onclick = () => {
            playlistButtonClick(playlist.href);
        };
        container.appendChild(button);
    });
}

function playlistButtonClick(href) {
    getPlaylistTracks(href);
}

function getPlaylistTracks(href) {
    const data = {
        headers: {
            Authorization: 'Bearer ' + token
        }
    };

    const url = href + '/tracks';

    fetch(url, data)
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            const images = extractImages(json.items);
            createCollage(images);
        });
}

function extractImages(songs) {
    return songs.map((song) => song.track.album.images[1]);
}

function showPlaylistsDiv() {
    const playlist = document.getElementById('playlistContainer');
    playlist.style.display = "";
    playlist.innerHTML = "";
    document.getElementById('imageContainer').style.display = "none";
}

function showImagesDiv() {
    document.getElementById('playlistContainer').style.display = "none";
    const image = document.getElementById('imageContainer');
    image.style.display = "";
    // image.innerHTML = "";
}