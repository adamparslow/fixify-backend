import { doesFileExist, createFile, getFileContentsAsJson, getFilesInFolder } from './firebaseBucket.mjs';

export const registerArtistConcertPage = async (artistId, data) => 
    await createFile(filePath(artistId), JSON.stringify(data));

export const getArtistsConcertPage = async (artistId) => 
    await getFileContentsAsJson(filePath(artistId));

export const isArtistConcertPageRegistered = async (artistId) => 
    await doesFileExist(filePath(artistId));

export const getListOfArtists = async () => 
    await getFilesInFolder('artistConcertPage');

const filePath = (artistId) => `artistConcertPage/${artistId}.json`;