import featureButtonGenerator from './featureButtonGenerator.js';
import tokenHandler from './tokenHandler.js';

window.addEventListener('DOMContentLoaded', () => {
    initSetup();
});

function initSetup() {
    getHashAndStoreTokens();
    generateButtons();
}

function generateButtons() {
    if (tokenHandler.getRefreshToken() !== null) {
        featureButtonGenerator.createFeatureButtons();
    } else {
        featureButtonGenerator.createAuthButton();
    }
}

function getHashAndStoreTokens() {
    const hash = getHash();

    moveTokensToStorage(hash.access_token, hash.refresh_token);
}

function getHash() {
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
    history.pushState("", document.title, window.location.pathname + window.location.search);
    return hash;
}

function moveTokensToStorage(access, refresh) {
    tokenHandler.setAccessToken(access);
    tokenHandler.setRefreshToken(refresh);
}