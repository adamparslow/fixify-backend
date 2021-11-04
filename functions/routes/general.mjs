import express from "express";
import path from "path";
import process from "process";
import config from "../config/index.mjs";

const router = express.Router();

router.get("/", (req, res) => {
	res.send(`<p>This is the backend for Fixify. Please go <a href="${config.fixify.frontend_uri}">here</a> for the website.`);
})

export default router;
