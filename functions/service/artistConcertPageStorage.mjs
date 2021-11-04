import { doesFileExist, createFile, getFileContentsAsJson } from './firebaseBucket.mjs';

export const registerArtistConcertPage = async (artistId, likedSongs) => 
    await createFile(filePath(artistId), JSON.stringify(likedSongs));

export const getArtistsConcertPage = async (artistId) => 
    await getFileContentsAsJson(filePath(artistId));

export const isArtistConcertPageRegistered = async (artistId) => 
    await doesFileExist(filePath(artistId));

const filePath = (artistId) => `artistConcertPage/${artistId}_likedSongs.json`;