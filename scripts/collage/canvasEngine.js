const canvas = document.getElementById('collage-canvas');
const ctx = canvas.getContext('2d');
// Percentage of the max height/width to take up 
const shrinkFactor = 0.95;

let size = 0;

export function init(width, height, defaultSize) {
    console.log(canvas.parentElement.clientHeight);
    const heightRatio = height / canvas.parentElement.clientHeight;
    const widthRatio = width / canvas.parentElement.clientWidth;
    console.log(heightRatio);
    console.log(widthRatio);

    const sizeDown = heightRatio > widthRatio ? heightRatio : widthRatio;
    console.log(sizeDown);

    if (sizeDown < 1) {
        canvas.width = width;
        canvas.height = height;
        size = defaultSize;
    } else {
        canvas.width = width / sizeDown * shrinkFactor;
        canvas.height = height / sizeDown * shrinkFactor;
        size = defaultSize / sizeDown * shrinkFactor;
    }

    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.fill();
}

export function drawOnCanvas(img64, x, y, big) {
    const img = new Image();

    const bigSize = big ? size * 2 : size;

    img.onload = () => {
        ctx.drawImage(img, x*size, y*size, bigSize, bigSize);
    };
    img.src = img64;
}

export default {
    init, 
    draw: drawOnCanvas
};