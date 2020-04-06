// const height = 13;
// const width = 6;

async function createCollage(images) {
    console.log(images);
    // console.log(new Jimp());

    showImagesDiv();
    const img = await generateImage(images);
    const imgData = await img.getBase64Async(Jimp.MIME_PNG);
    console.log(imgData);
    document.getElementById('resultImage').src = imgData;
    // window.location.href = imgData;
    // downloadFile(imgData, "collage.png");
    var a = document.createElement("a"); //Create <a>
    a.href = imgData;
    a.download = "Image.png"; //File name Here
    a.click(); //Downloaded file

    // fetch("http://localhost:8080/image", { 
    //     method: "POST",
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(images)
    // })
    //     .then((response) => {
    //         return response.text();
    //     })
    //     .then((imgData) => {
    //         showImagesDiv();
    //         console.log(imgData);
    //         document.getElementById('resultImage').src = imgData;
    //         // window.location.href = imgData;
    //         // downloadFile(imgData, "collage.png");
    //         var a = document.createElement("a"); //Create <a>
    //         a.href = imgData;
    //         a.download = "Image.png"; //File name Here
    //         a.click(); //Downloaded file
    //     });
}

function downloadFile(data, fileName, type="image/png") {
  // Create an invisible A element
  const a = document.createElement("a");
  a.style.display = "none";
  document.body.appendChild(a);

  // Set the HREF to a Blob representation of the data to be downloaded
  a.href = window.URL.createObjectURL(
    new Blob([data], { type })
  );

  // Use download attribute to set set desired file name
  a.setAttribute("download", fileName);

  // Trigger the download by simulating click
  a.click();

  // Cleanup
  window.URL.revokeObjectURL(a.href);
  document.body.removeChild(a);
}

function createImage(image) {
    const imageEl = document.createElement('img');
    imageEl.src = image.url;
    imageEl.width = image.width;
    return imageEl
}

function removeDuplicates(images) {
    return images.map(image => image.url)
        // Check if the urls first index matches the current index, if not, give undefined, otherwise return index
        .map((url, index, final) => final.indexOf(url) === index && index)
        // Removed undefined
        .filter(index => images[index])
        // Take new list of indexes and produce new array
        .map(index => images[index])
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
        console.log(newDistance);
        
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

function populateCanvas(images, width, height, context) {
    // const imageData = images[0];
    // const newImage = new Image();
    // newImage.src = imageData.src;
    // console.log(context);
    // context.drawImage(newImage, 0, 0);

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if (images.length > x * width + y) {
                const imageData = images[x * width + y];
                console.log(x);
                console.log(y);
                console.log(imageData);
                const image = new Image();
                image.src = imageData.url;
                context.drawImage(image, 
                    x * imageData.width, y * imageData.width);
            }
        }
    }
}