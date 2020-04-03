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
    const redirectUri = "https://adamparslow-fixify.glitch.me/";
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


let token = "";
const apiUrl = "https://api.spotify.com/";

window.addEventListener('DOMContentLoaded', () => {
    initSetup();
});