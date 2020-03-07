function createCollage(images) {
    showImages();
    const container = document.getElementById('imageContainer');
    images.forEach((image) => {
        const imageEl = createImage(image);
        container.appendChild(imageEl);
    })
}

function createImage(image) {
    const imageEl = document.createElement('img');
    console.log(image);
    imageEl.src = image.url;
    imageEl.width = 100;
    return imageEl
}