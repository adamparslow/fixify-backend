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