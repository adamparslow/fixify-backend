import express from "express";
import path from "path";
import process from "process";

// const express = require('express');
// const path = require('path');

const router = express.Router();

// router.get("/", (req, res) => {
// 	res.sendFile(path.join(process.cwd(), "views/index.html"));
// });

router.get("/feature/collage", (req, res) => {
	res.sendFile(path.join(process.cwd(), "views/collage.html"));
});

router.get("/feature/*", (req, res) => {
	console.log(req.originalUrl);
	res.send("Not yet implemented");
});

// router.get("/shared/*", (req, res) => {
//     console.log(req.url);
//     console.log(req.baseUrl);
//     console.log(path.join(__dirname, req.url));
//     res.sendFile(path.join(__dirname, '..', req.url));
// });

router.get("*", (req, res) => {
	let url = req.originalUrl.slice(1);
	if (url === "") url = "dist/index.html";
	res.sendFile(path.join(process.cwd(), "frontend", url));
});

export default router;
