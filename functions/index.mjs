import functions from 'firebase-functions';
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import generalRoutes from "./routes/general.mjs";
import authRoutes from "./routes/spotifyOauth.mjs";
import megamixRoutes from "./routes/megamix.mjs";
import spotifyRoutes from "./routes/spotifyApi.mjs";
import concertWatchRoutes from "./routes/concertWatch.mjs";

import megamixStorage from "./models/megamixStorage.mjs";
import scheduler from "./models/scheduler.mjs";

const expressApp = express();
const port = process.env.NODE_ENV == "production" ? process.env.PORT : 3000;

scheduler.scheduleMegamixes();

expressApp.use(express.static("client/build"))
	.use(express.json({strict: false}))
	.use(cors())
	.use(cookieParser())
	.use("/auth", authRoutes)
	.use("/megamix", megamixRoutes)
	.use("/spotify", spotifyRoutes)
	.use("/concert_watch", concertWatchRoutes)
	.use("/", generalRoutes);

expressApp.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});

export const app = functions.https.onRequest(expressApp);
