import { doesFileExist, createFile, getFileContents } from './firebaseBucket.mjs';

export const storeLikedSongs = async (userId, likedSongs) => 
    await createFile(filePath(userId), JSON.stringify(likedSongs));

export const getLikedSongs = async (userId) => 
    await getFileContents(filePath(userId));

export const doesLikedSongsExist = async (userId) => 
    await doesFileExist(filePath(userId));

const filePath = (userId) => `likedSongs/${userId}_likedSongs.json`;
