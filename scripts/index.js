import config from './config.js';

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

    if (JSON.stringify(hash) !== JSON.stringify({})) {
        token = hash.access_token;
        createFeatureButtons();
        return;
    } else {
        createAuthButton();
    }

    authBtn.href = authUrl;
}

function createAuthButton() {
    const scopes = [
        "playlist-read-collaborative",
        "playlist-read-private"
    ];

    const authUrl = `${config.spotifyAuth}?response_type=token` + 
    `&client_id=${config.clientId}` + 
    `&redirect_uri=${config.redirectUri}` +
    `&scope=${scopes.join("%20")}`;

    const buttonBox = document.getElementById('button-box');
    const button = document.createElement('a');
    button.href = authUrl;
    button.className = "feature-button";
    button.innerText = "Authorise";
    buttonBox.appendChild(button);
}

function createFeatureButtons() {
    const buttonBox = document.getElementById('button-box');
    for (const pageData of config.pages) {
        const button = document.createElement('a');
        button.href = pageData.url;
        button.className = "feature-button";
        button.innerText = pageData.title; 
        buttonBox.appendChild(button);
    }
}

let token = "";
window.addEventListener('DOMContentLoaded', () => {
    initSetup();
});