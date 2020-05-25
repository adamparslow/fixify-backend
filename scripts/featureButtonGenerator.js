import config from './config.js';

function createAuthButton() {
    const buttonBox = document.getElementById('button-box');
    const button = document.createElement('a');
    button.href = '/auth/login';
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

export default {
    createAuthButton,
    createFeatureButtons
};