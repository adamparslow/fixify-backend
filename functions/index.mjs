import functions from 'firebase-functions';
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import generalRoutes from "./routes/general.mjs";
import authRoutes from "./routes/spotifyOauth.mjs";
import megamixRoutes from "./routes/megamix.mjs";
import spotifyRoutes from "./routes/spotifyApi.mjs";
import concertWatchRoutes from "./routes/concertWatch.mjs";

import megamixCreator from "./models/megamixCreator.mjs";
import * as artistHasher from './service/artistHasher.mjs';

const megamixSchedule = "0 19 * * *";

export const megamix = functions.pubsub.schedule(megamixSchedule).onRun(async () => {
	console.log("Running schedule");
	await megamixCreator.generateMegamixes();
});

artistHasher.genNewArtistHashes();
const webHasherSchedule = "0 20 * * *";

export const webHasher = functions.pubsub.schedule(webHasherSchedule).onRun(async () => {
	await artistHasher.genNewArtistHashes();
});

const expressApp = express();

expressApp.use(express.static("client/build"))
	.use(express.json({strict: false}))
	.use(cors())
	.use(cookieParser())
	.use("/auth", authRoutes)
	.use("/megamix", megamixRoutes)
	.use("/spotify", spotifyRoutes)
	.use("/concert_watch", concertWatchRoutes)
	.use("/", generalRoutes);

export const app = functions.runWith({
	timeoutSeconds: 300
}).https.onRequest(expressApp);
