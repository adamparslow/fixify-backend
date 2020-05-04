const express = require('express');
let Jimp = require('jimp');
// const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const image = require('./oldSite/image');

app.use(express.static('client/build'));
app.use(express.json());

const port = process.env.PORT || 8080;

app.post("/image", async (req, res) => {
    const images = req.body;
    const collage = await image.generateImage(images)
    const result = await collage.getBase64Async(Jimp.MIME_PNG)
    res.send(result);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "html/index.html"));
});

app.get("/feature/*", (req, res) => {
    console.log(req.originalUrl);
    res.send("Not yet implemented");
});

app.get("*", (req, res) => {
    let url = req.originalUrl.slice(1);
    if (url === "") url = "index.html";
    res.sendFile(path.join(__dirname, url));
});



app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})