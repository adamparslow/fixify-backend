const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const databaseFileLocation = "./.data/sqlite.db";
let database;

exports.init = () => {
    const exists = databaseExists();
    database = new sqlite3.Database(databaseFileLocation); 

    if (!exists) {
        console.log("Creating megamix table");
        createMegamixTable();
    } 
}

function databaseExists() {
    return fs.existsSync(databaseFileLocation);
}

function createMegamixTable() {
    database.serialize(() => {
        database.run("CREATE TABLE Megamix (userId TEXT PRIMARY KEY, refreshToken TEXT)");
    });
    console.log("Table created");
}

exports.saveMegamix = (refreshToken, userId) => {
    database.serialize(() => {
        database.run(`INSERT INTO Megamix Values (${userId}, ${refreshToken})`);
    });
    console.log("Data saved");
}

exports.getMegamixes = () => {
    database.serialize(() => {
        database.all("SELECT * FROM Megamix", (error, data) => {
            console.log(data);
        });
    });
}