import canvasEngine from "@/model/canvasEngine.js";

/**
 * Generate the image using JIMP
 */

async function generate(urlDataArr, width, height, biggerBoxes) {
	const urls = urlDataArr.map((urlData) => urlData.url);
	const size = urlDataArr[0].width / 2;

	const imageWidth = width * size;
	const imageHeight = height * size;

	const urlsWithCoords = setCoordinates(urls, width, height, biggerBoxes);

	const image = new window.Jimp(imageWidth, imageHeight);

	const promises = [];
	urlsWithCoords.forEach(async (urlObj) => {
		promises.push(
			window.Jimp.read(urlObj.url).then((coverArt) => {
				const actualSize = urlObj.big ? size * 2 : size;
				coverArt.resize(actualSize, actualSize);
				image.composite(coverArt, urlObj.x * size, urlObj.y * size);

				// Integrating with the canvas
				coverArt
					.getBase64Async(window.Jimp.MIME_PNG)
					.then((img) =>
						canvasEngine.drawImage(img, urlObj.x, urlObj.y, urlObj.big, size)
					);
			})
		);
	});
	await Promise.all(promises);

	return image;
}

function setCoordinates(urls, width, height, biggerBoxes) {
	const squares = generateBigSquares(width, height, biggerBoxes, urls.length);
	const urlsWithCoords = [];

	const taken = [];
	for (let x = 0; x < width; x++) {
		taken[x] = [];
		for (let y = 0; y < height; y++) {
			taken[x][y] = false;
		}
	}

	// Set the taken values for the squares
	for (const square of squares) {
		const url = urls[square.y * width + square.x];
		if (!url) {
			continue;
		}

		taken[square.x][square.y] = true;
		taken[square.x + 1][square.y] = true;
		taken[square.x][square.y + 1] = true;
		taken[square.x + 1][square.y + 1] = true;

		urlsWithCoords.push({
			x: square.x,
			y: square.y,
			big: true,
			url,
		});
	}

	// Set the rest with taken offset
	urls.forEach((url, index) => {
		let pos = index;
		let x = index % width;
		let y = Math.floor(pos / width);

		if (containsCoord(x, y, squares)) {
			return;
		}

		while (taken[x][y]) {
			x++;
			if (x === Number(width)) {
				x = 0;
				y++;
			}
		}

		taken[x][y] = true;

		urlsWithCoords.push({
			x,
			y,
			big: false,
			url,
		});
	});
	return urlsWithCoords;
}

function generateBigSquares(width, height, biggerBoxes, arrayLength) {
	const squares = [];
	const taken = [];
	for (let x = 0; x < width; x++) {
		taken[x] = [];
		for (let y = 0; y < height; y++) {
			taken[x][y] = false;
		}
	}

	for (let i = 0; i < biggerBoxes; i++) {
		let x = Math.floor(Math.random() * (width - 1));
		let y = Math.floor(Math.random() * (height - 1));
		const limit = 100;
		let i = 0;

		while (
			(taken[x][y] ||
				taken[x + 1][y] ||
				taken[x][y + 1] ||
				taken[x + 1][y + 1] ||
				y * width + x >= arrayLength) &&
			!(i == limit)
		) {
			x = Math.floor(Math.random() * (width - 1));
			y = Math.floor(Math.random() * (height - 1));
			i++;
		}

		if (i === limit) {
			continue;
		}

		taken[x][y] = true;
		taken[x + 1][y] = true;
		taken[x][y + 1] = true;
		taken[x + 1][y + 1] = true;

		squares.push({
			x,
			y,
		});
	}
	return squares;
}

function containsCoord(x, y, squares) {
	let val = false;
	squares.forEach((square) => {
		if (x == square.x && y == square.y) {
			val = true;
		}
	});
	return val;
}

export default {
	generate,
};
