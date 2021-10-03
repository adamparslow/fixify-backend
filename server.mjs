import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import generalRoutes from "./routes/general.mjs";
import authRoutes from "./routes/spotifyOauth.mjs";
import megamixRoutes from "./routes/megamix.mjs";
import spotifyRoutes from "./routes/spotifyApi.mjs";

import megamixStorage from "./models/megamixStorage.mjs";
import scheduler from "./models/scheduler.mjs";

import admin from 'firebase-admin'
import { getServiceAccount } from './models/firebaseAuth.mjs';

admin.initializeApp({
	credential: admin.credential.cert(getServiceAccount()),
	storageBucket: process.env.BUCKET_URL
});

// const express = require('express');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');

// const generalRoutes = require('./routes/general');
// const authRoutes = require('./routes/spotifyOauth');
// const megamixRoutes = require('./routes/megamix');

const app = express();
const port = process.env.PORT || 3000;

megamixStorage.init();
scheduler.scheduleMegamixes();

app.use(express.static("client/build"))
	.use(express.json())
	.use(cors())
	.use(cookieParser())
	.use("/auth", authRoutes)
	.use("/megamix", megamixRoutes)
	.use("/spotify", spotifyRoutes)
	.use("/", generalRoutes);

app.locals.bucket = admin.storage().bucket();

app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});
