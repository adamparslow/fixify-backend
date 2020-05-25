const express = require('express');
const path = require('path');

const router = express.Router();

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/index.html"));
});

router.get("/feature/collage", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/collage.html"));
});

router.get("/feature/*", (req, res) => {
    console.log(req.originalUrl);
    res.send("Not yet implemented");
});

router.get("*", (req, res) => {
    let url = req.originalUrl.slice(1);
    if (url === "") url = "index.html";
    res.sendFile(path.join(__dirname, "../public", url));
});

module.exports = router;