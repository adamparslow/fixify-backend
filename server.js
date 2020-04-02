const express = require('express');
let Jimp = require('jimp');
// const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const image = require('./image');

app.use(express.static('client/build'));
app.use(express.json());
// app.use(bodyParser);

const port = process.env.PORT || 8080;
// const ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
// const port = 8080;

app.post("/image", async (req, res) => {
    const images = req.body;
    const collage = await image.generateImage(images)
    const result = await collage.getBase64Async(Jimp.MIME_PNG)
    res.send(result);
});

app.get("*", (req, res) => {
    let url = req.originalUrl.slice(1);
    if (url === "") url = "index.html";
    res.sendFile(path.join(__dirname, url));
    // fs.readFile("index.html", (err, data) => {
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'text/html');
    //     res.end(data);
    // });
});


app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})