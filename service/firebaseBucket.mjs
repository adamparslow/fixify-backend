import admin from 'firebase-admin'
import { getServiceAccount } from '../models/firebaseAuth.mjs';

admin.initializeApp({
	credential: admin.credential.cert(getServiceAccount()),
	storageBucket: process.env.BUCKET_URL
});

export const bucket = admin.storage().bucket();

export const doesFileExist = async (filePath) => {
    const response = await bucket.file(filePath).exists();
    return response[0];
}

export const createFile = async (filePath, data) => {
    await bucket.file(filePath).createWriteStream().end(data);
}

export const getFileContents = async (filePath) => {
    const response = await bucket.file(filePath).download();
    return JSON.parse(response);
}

export const getFilesInFolder = async (folderPath) => {
    const files = await bucket.getFiles();
    const fileNames = files[0]
                        .map(file => file.name)
                        .filter(fn => fn.includes(folderPath));
    return fileNames;
}

export const deleteFile = async (filePath) => {
    await bucket.file(filePath).delete();
}