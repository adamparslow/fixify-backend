import fs from 'fs';
import sqlite3 from 'sqlite3';

// const fs = require('fs');
// const sqlite3 = require('sqlite3').verbose();

const databaseFileLocation = "./.data/sqlite.db";
let database;

export default {
    init: () => {
        const exists = databaseExists();
        database = new sqlite3.Database(databaseFileLocation); 

        if (!exists) {
            console.log("Creating megamix table");
            createMegamixTable();
        } 
    },
    saveMegamix: (refreshToken, userId) => {
        database.serialize(() => {
            database.run(`INSERT INTO Megamix Values ('${userId}', '${refreshToken}')`);
        });
        console.log("Data saved");
    },
    getMegamixes: (callback) => {
        database.serialize(() => {
            database.all("SELECT * FROM Megamix", (error, data) => {
                callback(data);
            });
        });
    },
    clearMegamixes: () => {
        database.serialize(() => {
            database.run("DELETE FROM Megamix");
        });
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