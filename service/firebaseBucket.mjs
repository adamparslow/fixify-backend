import admin from 'firebase-admin'
import { getServiceAccount } from '../models/firebaseAuth.mjs';

admin.initializeApp({
	credential: admin.credential.cert(getServiceAccount()),
	storageBucket: process.env.BUCKET_URL
});

export const bucket = admin.storage().bucket();

export const doesFileExist = async (filePath) => {
    return await bucket.file(filePath).exists();
}

export const createFile = async (filePath, data) => {
    await bucket.file(filePath).createWriteStream().end(data);
}

export const getFileContents = async (filePath) => {
    const response = await bucket.file(filePath).download();
    return JSON.parse(response);
}

export const deleteFile = async (filePath) => {
    await bucket.file(filePath).delete();
}