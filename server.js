const express = require('express');
const path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');

const authRoutes = require('./routes/spotifyOauth')

const megamixStorage = require('./serverScripts/megamixStorage');
const scheduler = require('./serverScripts/scheduler');

const app = express();
const port = process.env.PORT || 8080;


megamixStorage.init();
scheduler.scheduleMegamixes(() => { console.log("This works"); });

app.use(express.static('client/build'))
    .use(express.json())
    .use(cors())
    .use(cookieParser())
    .use('/auth', authRoutes);

app.post('/save_megamix', (req, res) => {
    const refreshToken = req.body.refresh_token;
    const userId = req.body.user_id;

    if (!refreshToken || !userId) {
        res.sendStatus(400);
    }

    megamixStorage.saveMegamix(refreshToken, userId);

    res.send(refreshToken);
});

app.post('/get_megamixes', (req, res) => {
    megamixStorage.getMegamixes();

    res.sendStatus(200);
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "html/index.html"));
});

app.get("/feature/collage", (req, res) => {
    res.sendFile(path.join(__dirname, "html/collage.html"));
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