import fs from "fs";
import Database from "better-sqlite3";
import { info } from "console";

const databaseFileLocation = "./.data/sqlite.db";

const isRegistered = (userId) => {
	const database = openDatabase();
	const info = database
		.prepare("SELECT * FROM Megamix WHERE userId = ?")
		.all(userId);

	return info.length > 0;
};

function databaseExists() {
	return fs.existsSync(databaseFileLocation);
}

function createMegamixTable() {
	const database = openDatabase();
	database.exec(
		"CREATE TABLE Megamix (userId TEXT PRIMARY KEY, refreshToken TEXT)"
	);
	console.log("Table created");
}

function openDatabase() {
	if (!databaseExists()) {
		if (!fs.existsSync(".data")) {
			fs.mkdir(".data", () => {});
		}

		const cs = fs.createWriteStream(".data/sqlite.db");
		cs.end();
	}

	return new Database("./.data/sqlite.db");
}

const init = () => {
	const exists = databaseExists();
	// const database = await openDatabase();
	// database = new sqlite3.Database(databaseFileLocation);

	if (!exists) {
		console.log("Creating megamix table");
		createMegamixTable();
	}
};

const registerUser = (refreshToken, userId) => {
	const database = openDatabase();

	if (isRegistered(userId)) {
		database
			.prepare("UPDATE Megamix SET refreshToken = ? WHERE userID = ?")
			.run(refreshToken, userId);
	} else {
		database
			.prepare("INSERT INTO Megamix Values (?, ?)")
			.run(userId, refreshToken);
	}

	console.log("Data saved");
};

const deregisterUser = (userId) => {
	const database = openDatabase();

	database.prepare("DELETE FROM Megamix WHERE userId = ?").run(userId);
};

const getMegamixes = () => {
	const database = openDatabase();
	return database.prepare("SELECT * FROM Megamix").all();
};

const clearMegamixes = () => {
	const database = openDatabase();
	database.prepare("DELETE FROM Megamix").run();
	console.log("cleared");
};

export default {
	init,
	registerUser,
	deregisterUser,
	getMegamixes,
	clearMegamixes,
	isRegistered,
};
