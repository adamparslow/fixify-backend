import express from "express";
import path from "path";
import process from "process";

const router = express.Router();

router.get("/", (req, res) => {
	res.send(`<p>This is the backend for Fixify. Please go <a href="${process.env.FRONTEND_URI}">here</a> for the website.`);
})

export default router;
