import config from './config';

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
        authBtn.style.visibility = 'hidden';
        token = hash.access_token;
        return;
    }

    // const authEndpoint = 'https://accounts.spotify.com/authorize';
    // const clientId = "791fe36d332a46dfbc596adaf06d224f";
    // const redirectUri = "http://localhost:8080";
    const scopes = [
        "playlist-read-collaborative",
        "playlist-read-private"
    ];

    const authUrl = `${config.spotifyAuth}?response_type=token` + 
    `&client_id=${config.clientId}` + 
    `&redirect_uri=${config.redirectUri}` +
    `&scope=${scopes.join("%20")}`;

    authBtn.href = authUrl;
}

let token = "";
window.addEventListener('DOMContentLoaded', () => {
    initSetup();
});