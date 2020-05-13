/**
 * Generate the image using JIMP
 */

async function generateImage(urlDataArr, width, height, biggerBoxes) {
    const urls = urlDataArr.map((urlData) => urlData.url);
    const size = urlDataArr[0].width / 2;

    const imageWidth = width * size;
    const imageHeight = height * size;

    const urlsWithCoords = setCoordinates(urls, width, height, biggerBoxes);

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

function setCoordinates(urls, width, height, biggerBoxes) {
    const squares = generateBigSquares(width, height, biggerBoxes);
    const urlsWithCoords = [];

    console.log(urls.length);

    const taken = [];
    for (let x = 0; x < width; x++) {
        taken[x] = [];
        for (let y = 0; y < height; y++) {
            taken[x][y] = false;
        }
    }

    // Set the taken values for the squares
    for (const square of squares) {
        taken[square.x][square.y] = true;
        taken[square.x+1][square.y] = true;
        taken[square.x][square.y+1] = true;
        taken[square.x+1][square.y+1] = true;

        urlsWithCoords.push({
            x: square.x,
            y: square.y,
            big: true,
            url: urls[square.y*width + square.x]
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
            url
        });
    });
    return urlsWithCoords;
}

function generateBigSquares(width, height, biggerBoxes) {
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

        while (taken[x][y] || taken[x+1][y] || taken[x][y+1] || taken[x+1][y+1]) {
            x = Math.floor(Math.random() * (width - 1));
            y = Math.floor(Math.random() * (height - 1));
        }
        taken[x][y] = true;
        taken[x+1][y] = true;
        taken[x][y+1] = true;
        taken[x+1][y+1] = true;

        squares.push({
            x,
            y
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