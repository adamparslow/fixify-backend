const canvas = document.getElementById('collage-canvas');
const ctx = canvas.getContext('2d');

export function init(width, height) {
    canvas.width = width;
    canvas.height = height;
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.fill();
}

export function drawOnCanvas(img64, x, y) {
    const img = new Image();

    img.onload = () => {
        ctx.drawImage(img, x, y);
    };
    img.src = img64;
}

export default {
    init, 
    draw: drawOnCanvas
};