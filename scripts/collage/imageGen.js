/**
 * Generate the image using JIMP
 */

async function generateImage(urlDataArr, width, height, biggerBoxes) {
    const urls = urlDataArr.map((urlData) => urlData.url);
    const size = urlDataArr[0].width / 2;

    const imageWidth = width * size;
    const imageHeight = height * size;

    const urlsWithCoords = setCoordinates(urls, width * height, width, height, biggerBoxes);

    const image = new Jimp(imageWidth, imageHeight);

    const promises = [];
    urlsWithCoords.forEach(async (urlObj, index) => {
        promises.push(Jimp.read(urlObj.url).then(coverArt => {
            const actualSize = urlObj.big ? size * 2 : size;
            coverArt.resize(actualSize, actualSize);
            image.composite(coverArt, urlObj.x * size, urlObj.y * size);
        }));
    });
    await Promise.all(promises);        

    return image;
}

function setCoordinates(urls, maxSize, width, height, biggerBoxes) {
    console.log(width);
    console.log(maxSize);
    const squares = generateBigSquares(width, height, biggerBoxes);
    const taken = [];
    for(let i = 0; i < maxSize; i++) {
        taken[i] = false;
    }
    console.log(taken);

    const urlsWithCoords = [];
    urls.forEach((url, index) => {
        let pos = index;
        while (taken[pos]) pos++;
        console.log(pos);

        const x = pos % width;
        const y = Math.floor(pos / width);
        let big = false;
        taken[pos] = true;

        if (containsCoord(x, y, squares)) {
            taken[pos + 1] = true;
            taken[pos + width] = true;
            taken[pos + width + 1] = true;
            big = true;
        }

        urlsWithCoords.push({
            x,
            y,
            big,
            url
        });
    });
    console.log(taken);
    return urlsWithCoords;
}

function generateBigSquares(width, height, biggerBoxes) {
    const squares = [];
    for (let i = 0; i < biggerBoxes; i++) {
        squares.push({
            x: Math.floor(Math.random() * (width - 1)),
            y: Math.floor(Math.random() * (height - 1))
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

export default generateImage;