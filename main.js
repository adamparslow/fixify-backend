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

    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const clientId = "791fe36d332a46dfbc596adaf06d224f";
    const redirectUri = "http://localhost:8080";
    const scopes = [
        "user-read-email",
        "user-read-private"
    ];

    const authUrl = `${authEndpoint}?response_type=token` + 
    `&client_id=${clientId}` + 
    `&redirect_uri=${redirectUri}` +
    `&scope=${scopes.join("%20")}`;

    authBtn.href = authUrl;
}

function getUserInformation() {
    var headers = {
        headers: {
            Authorization: 'Bearer ' + token
        }
    };
    console.log(headers);
    fetch(apiUrl + "v1/me/", headers)
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            console.log(json);
        });
    console.log(token);
}

let token = "";
const apiUrl = "https://api.spotify.com/";

window.addEventListener('DOMContentLoaded', () => {
    initSetup();
});