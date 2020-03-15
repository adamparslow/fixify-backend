let Jimp = require('jimp');
let fs = require('fs');

const height = 13;
const width = 6;

fs.readFile("dummyData.json", (err, data) => {
    main(JSON.parse(data));
})

async function main(urlDataArr) {
    const urls = urlDataArr.map((urlData) => urlData.url);
    const size = urlDataArr[0].width / 4;
    console.log(urls.length);

    // const [smallFactor, largeFactor] = getRatio(urlDataArr.length);
    const smallFactor = 6;
    const largeFactor = 13;

    const imageWidth = smallFactor * size;
    const imageHeight = largeFactor * size;

    const urlsWithCoords = setCoordinates(urls, smallFactor * largeFactor);

    new Jimp(imageWidth, imageHeight, 0x0, (err, image) => {
        const promises = [];
        urlsWithCoords.forEach(async (urlObj, index) => {
            promises.push(Jimp.read(urlObj.url).then(coverArt => {
                console.log(urlObj);
                const actualSize = urlObj.big ? size * 2 : size;
                coverArt.resize(actualSize, actualSize);
                image.composite(coverArt, urlObj.x * size, urlObj.y * size);
            }));
        });
        Promise.all(promises).then(result => {
            image.write('test.png');
        });
        // Jimp.read(urls[0],(err, coverArt) => {
        //     image.composite(coverArt, 0, 0);
        // });
    });
}

function generateBigSquares() {
    const number = 5;
    const squares = [];
    for (let i = 0; i < number; i++) {
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
        console.log(square);
        console.log(x, y);
        if (x == square.x && y == square.y) {
            val = true;
        }
    });
    return val;
}

function setCoordinates(urls, maxSize) {
    const squares = generateBigSquares();
    const taken = [];
    for(let i = 0; i < maxSize; i++) {
        taken[i] = false;
    }

    const urlsWithCoords = [];
    urls.forEach((url, index) => {
        let pos = index;
        while (taken[pos]) pos++;

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
    console.log(urlsWithCoords);
    return urlsWithCoords;
}

function getRatio(length) {
    if (length%2 === 1) length += 3;
    const ratio = height > width ? height/width : width/height;

    // get all factors of length
    const factors = (number => Array
    .from(Array(number + 1), (_, i) => i)
    .filter(i => number % i === 0))(length);

    let i = 1;
    let j = factors.length - 2;

    let distance = length;
    let smallFactor = 1;
    let largeFactor = length;

    // find out which pair gets closest to the desired ratio
    while (i <= j) {
        const newDistance = Math.abs(factors[j]/factors[i] - ratio);
        
        if (newDistance < distance) {
            distance = newDistance;
            smallFactor = factors[i];
            largeFactor = factors[j];
        }

        i++;
        j--;
    }

    return [smallFactor, largeFactor];
}