import fs from "fs";
import sqlite3 from "sqlite3";
import sqlite from "sqlite";

// const fs = require('fs');
// const sqlite3 = require('sqlite3').verbose();

const databaseFileLocation = "./.data/sqlite.db";
let database;

const isRegistered = async (userId) => {
	const database = await openDatabase();
	const response = await database.get(
		"SELECT * FROM Megamix WHERE userId = ?",
		userId
	);

	return response !== null && response !== undefined;
};

function databaseExists() {
	return fs.existsSync(databaseFileLocation);
}

async function createMegamixTable() {
	const database = await openDatabase();
	database.exec(
		"CREATE TABLE Megamix (userId TEXT PRIMARY KEY, refreshToken TEXT)"
	);
	console.log("Table created");
}

async function openDatabase() {
	fs.writeFile("./.data/sqlite.db");
	return await sqlite.open({
		filename: "./.data/sqlite.db",
		driver: sqlite3.Database,
	});
}

export default {
	init: async () => {
		const exists = databaseExists();
		// const database = await openDatabase();
		// database = new sqlite3.Database(databaseFileLocation);

		if (!exists) {
			console.log("Creating megamix table");
			createMegamixTable();
		}
	},
	registerUser: async (refreshToken, userId) => {
		const database = await openDatabase();

		if (await isRegistered(userId)) {
			await database.exec(
				`UPDATE Megamix SET refreshToken = '${refreshToken}' WHERE userId = '${userId}'`
			);
		} else {
			await database.exec(
				`INSERT INTO Megamix Values ('${userId}', '${refreshToken}')`
			);
		}

		console.log("Data saved");
	},
	deregisterUser: async (userId) => {
		const database = await openDatabase();

		await database.exec(`DELETE FROM Megamix WHERE userId = '${userId}'`);
	},
	getMegamixes: async () => {
		const database = await openDatabase();
		return await database.all("SELECT * FROM Megamix");
	},
	clearMegamixes: async () => {
		const database = await openDatabase();
		database.exec("DELETE FROM Megamix");
		console.log("cleared");
	},
	isRegistered: isRegistered,
};
