import config from '../config.js';
import autocomplete from './autocomplete.js';
import generateImage from './imageGen.js';

let playlistInfo = [];

async function getPlaylists(next) {
    const token = localStorage.getItem('token');
    let data = {
        headers: {
            Authorization: 'Bearer ' + token
        }
    };

    const url = next !== undefined ? next : 
        config.spotifyAPI + 'v1/me/playlists?limit=50';

    const response = await fetch(url, data)
    const json = await response.json();

    if (json.items.length === json.limit) {
        getPlaylists(json.next);
    }

    playlistInfo = playlistInfo.concat(json.items);
}

async function getImages(href, size) {
    const token = localStorage.getItem('token');
    const data = {
        headers: {
            Authorization: 'Bearer ' + token
        }
    };

    const url = href + '/tracks';

    const response = await fetch(url, data);
    const songs = await response.json();
    const images = songs.items.map((song) => song.track.album.images[size]);
    return images;
}

function getSize(sizeWord) {
    switch(sizeWord) {
        case "small": 
            return 2;
        case "medium": 
            return 1;
        case "large": 
            return 0;
    }
}

function generatePlaylistContainer() {
    const acFill = playlistInfo.map(item => item.name);
    autocomplete(document.getElementById('playlist-auto'), acFill);
}

async function formHandler (event) {
    event.preventDefault();

    // Get form data
    const preFormData = new FormData(event.target);
    const formData = {};
    for (var pair of preFormData.entries()) {
        formData[pair[0]] = pair[1];
    }

    // Get image data
    const playlist = playlistInfo.filter((playlist) => playlist.name === formData.playlist)[0];
    let images = await getImages(playlist.href, getSize(formData.size));

    // Remove repeated images
    if (formData.repeats) {
        images = removeDuplicates(images);
    }

    // Randomly sort the list
    if (formData.random) {
        images = shuffle(images);
    }

    // Remove excess images
    let numberOfImages = formData.width * formData.height;
    images.splice(numberOfImages);
    console.log(images);

    // Generate image
    const collage = await generateImage(images, formData.width, formData.height, formData['bigger-boxes']);
    const collage64 = await collage.getBase64Async(Jimp.MIME_PNG);

    const downloadButton = document.getElementById('download-button');
    downloadButton.disabled = false;
    downloadButton.onclick = () => {
        downloadFile(collage64, "image.png");
    };
}

function downloadFile(data, fileName) {
    const a = document.createElement("a"); //Create <a>
    a.href = data;
    a.download = fileName; //File name Here
    a.click(); //Downloaded file
}

function removeUndefined(images) {
    return images.filter(image => image);
}

function removeDuplicates(images) {
    images = removeUndefined(images);
    return images.map(image => image.url)
        // Check if the urls first index matches the current index, if not, give undefined, otherwise return index
        .map((url, index, final) => final.indexOf(url) === index && index)
        // Removed undefined
        .filter(index => images[index])
        // Take new list of indexes and produce new array
        .map(index => images[index])
} 

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}

window.addEventListener('DOMContentLoaded', async () => {
    await getPlaylists();
    generatePlaylistContainer();

    const auto = document.getElementById('playlist-auto');
    auto.addEventListener('keyup', event => {
        if (event.keyCode == 13) {
            event.preventDefault();
            document.getElementById('playlist-submit').click();
        }
    });

    const imageForm = document.getElementById('image-form');
    imageForm.addEventListener('submit', formHandler);
});