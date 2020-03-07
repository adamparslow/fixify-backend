function getHash () {
    const hash = window.location.hash
        .substring(1)
        .split("&")
        .reduce(function(initial, item) {
            if (item) {
            var parts = item.split("=");
            initial[parts[0]] = decodeURIComponent(parts[1]);
            }
            return initial;
        }, {});
    window.location.hash = "";
    return hash;
}

function initSetup() {
    const hash = getHash();

    const authBtn = document.getElementById("authBtn");
    if (JSON.stringify(hash) !== JSON.stringify({})) {
        document.getElementById('authorization').style.display = 'none';
        authBtn.style.visibility = 'hidden';
        token = hash.access_token;
        return;
    }
    document.getElementById('postAuth').style.display = 'none';

    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const clientId = "791fe36d332a46dfbc596adaf06d224f";
    const redirectUri = "http://localhost:8080";
    const scopes = [
        "user-read-email",
        "user-read-private",
        "playlist-read-collaborative",
        "playlist-read-private"
    ];

    const authUrl = `${authEndpoint}?response_type=token` + 
    `&client_id=${clientId}` + 
    `&redirect_uri=${redirectUri}` +
    `&scope=${scopes.join("%20")}`;

    authBtn.href = authUrl;
}

function getUserInformation() {
    var data = {
        headers: {
            Authorization: 'Bearer ' + token
        }
    };

    fetch(apiUrl + "v1/me/", data)
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            console.log(json);
        });
}

function getPlaylists(next) {
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
        console.log(playlist);
        const button = document.createElement('button');
        button.innerHTML = playlist.name;
        button.onclick = () => {
            playlistButtonClick(playlist.href);
        };
        container.appendChild(button);
    });
}

function playlistButtonClick(href) {
    console.log(href);
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
            console.log(json);
        });
}

let token = "";
const apiUrl = "https://api.spotify.com/";

window.addEventListener('DOMContentLoaded', () => {
    initSetup();
});