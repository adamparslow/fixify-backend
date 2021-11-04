import fs from "fs";
import Database from "better-sqlite3";
import { info } from "console";
import * as firebaseBucket from '../service/firebaseBucket.mjs';

// const databaseFileLocation = "./.data/sqlite.db";

const isRegistered = async (userId) => 
	await firebaseBucket.doesFileExist(filePath(userId));

const registerUser = async (refreshToken, userId) => {
	const data = {
		refreshToken
	};
	await firebaseBucket.createFile(filePath(userId), JSON.stringify(data));
};

const deregisterUser = async (userId) => 
	await firebaseBucket.deleteFile(filePath(userId));

const getMegamixes = async () => {
	const megamixes = [];

	const fileNames = await firebaseBucket.getFilesInFolder('megamix');	
	for (const name of fileNames) {
		const data = await firebaseBucket.getFileContentsAsJson(name);
		const userId = name.split("/")[1].split(".")[0];
		const refreshToken = data.refreshToken;
		megamixes.push({
			userId,
			refreshToken
		});
	}
	
	return megamixes;
};

const clearMegamixes = async () => {
	const fileNames = await firebaseBucket.getFilesInFolder('megamix');
	fileNames.forEach(async name => {
		await firebaseBucket.deleteFile(name);
	});
	console.log("cleared");
};

const filePath = (userId) => `megamix/${userId}.json`;

export default {
	registerUser,
	deregisterUser,
	getMegamixes,
	clearMegamixes,
	isRegistered,
};
