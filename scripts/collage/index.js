import config from '../config.js';
import generateImage from './imageGen.js';
import spotifyApi from '../spotifyApi.js';

let playlistInfo = [];

async function getPlaylists(next) {
    const token = localStorage.getItem('access_token');
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

// async function getCoverArt(playlistUrl, size) {
//     // const token = localStorage.getItem('access_token');
//     // const data = {
//     //     headers: {
//     //         Authorization: 'Bearer ' + token
//     //     }
//     // };

//     // const url = href + '/tracks';

//     // const response = await fetch(url, data);
//     // const songs = await response.json();
//     const coverArtAllSizes = await spotifyApi.getPlaylistCoverArt(playlistUrl);
//     const coverArt = coverArtAllSizes.items.map((song) => song.track.album.images[size]);
//     return coverArt;
// }

function getSize(sizeWord) {
    switch(sizeWord) {
        case "low": 
            return 2;
        case "medium": 
            return 1;
        case "high": 
            return 0;
    }
}

function generatePlaylistContainer() {
    // const acFill = playlistInfo.map(item => item.name);
    // autocomplete(document.getElementById('playlist-auto'), acFill);

    const select = document.getElementById('playlist');
    for (const playlist of playlistInfo) {
        const option = document.createElement('option');
        option.value = playlist.name;
        option.innerHTML = playlist.name;
        select.appendChild(option);
    }
}

async function formHandler (event) {
    event.preventDefault();

    // Get form data
    const preFormData = new FormData(event.target);
    const formData = {};
    for (var pair of preFormData.entries()) {
        formData[pair[0]] = pair[1];
    }

    if (!formData.custom) {
        const [width, height] = formData.ratio.split("x");
        formData.width = width;
        formData.height = height;
    }

    // Get image data
    const playlist = playlistInfo.filter((playlist) => playlist.name === formData.playlist)[0];
    let images = await spotifyApi.getPlaylistCoverArt(playlist, getSize(formData.size));

    // Remove repeated images
    if (formData.repeats) {
        images = removeDuplicates(images);
    }

    // Fill with duplicates 
    if (formData.fill) {
        images = fillWithDuplicates(images, formData.width * formData.height);
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

function fillWithDuplicates(images, finalSize) {
    let i = 0;
    let originalLen = images.length;
    let newImages = shuffle([...images]);
    while(images.length < finalSize) {
        images.push(newImages[i % originalLen]);
        i++;
    }

    return images;
}

function advancedClickHandler() {
    const box = document.getElementById('advanced-box');
    box.style.display = box.style.display === "block" ? "none" : "block";
}

function toggleCustomDisplay(event) {
    const customDiv = document.getElementById('custom');
    const ratioField = document.getElementById('ratio');
    const checked = event.target.checked;
    customDiv.style.display = checked ? "block" : "none";
    ratioField.disabled = checked;
}

window.addEventListener('DOMContentLoaded', async () => {
    await getPlaylists();
    generatePlaylistContainer();

    const imageForm = document.getElementById('image-form');
    imageForm.addEventListener('submit', formHandler);

    const advancedBtn = document.getElementById('advanced-button');
    advancedBtn.addEventListener('click', advancedClickHandler);

    const customCheckbox = document.getElementById('custom-checkbox');
    customCheckbox.addEventListener('change', toggleCustomDisplay);
});