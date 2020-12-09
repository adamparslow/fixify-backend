function setDimensions(width, height, size) {
	const canvas = document.getElementById("collage-canvas");

	canvas.width = width * size;
	canvas.height = height * size;
	
	console.log(window);
}

function drawImage(img64, x, y, big, size) {
	const canvas = document.getElementById("collage-canvas");
	const ctx = canvas.getContext("2d");

	const img = new Image();

	const bigSize = big ? size * 2 : size;

	img.onload = () => {
		ctx.drawImage(img, x * size, y * size, bigSize, bigSize);
	};
	img.src = img64;
}

export default {
	setDimensions,
	drawImage,
};
