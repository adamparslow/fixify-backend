import fs from "fs";

export const storeLikedSongs = (userId, likedSongs) => {
    if (!fs.existsSync(".data")) {
        fs.mkdirSync(".data");
    }

    if (!fs.existsSync(".data/likedSongs")) {
        fs.mkdirSync(".data/likedSongs");
    }

    fs.writeFileSync(filePath(userId), JSON.stringify(likedSongs));
};

export const getLikedSongs = (userId) => {
    const stringData = fs.readFileSync(filePath(userId));
    return JSON.parse(stringData);
};

export const doesLikedSongsExist = (userId) => {
    return fs.existsSync(filePath(userId));
}

const filePath = (userId) => {
    return `.data/likedSongs/${userId}_likedSongs.json`;
}