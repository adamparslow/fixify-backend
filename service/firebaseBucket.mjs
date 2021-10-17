import { initializeApp } from "firebase/app";
import fetch from "node-fetch";
import { getStorage, ref, uploadString, getDownloadURL, listAll } from "firebase/storage";

const firebaseApp = initializeApp({
  apiKey: 'AIzaSyAOmfsIq2eJcyvkpZoiyMGqpiQrUrEXjxw',
//   authDomain: 'https://fixify-backend.web.app',
  projectId: 'fixify-backend',
//   databaseURL: '<your-database-url>',
  storageBucket: 'gs://fixify-backend.appspot.com'
});

const storage = getStorage(firebaseApp);

export const doesFileExist = async (filePath) => {
  const fileRef = ref(storage, filePath);
  const downloadURL = await getDownloadURL(fileRef).catch(() => {});
  return downloadURL !== undefined;
}

export const createFile = async (filePath, data) => {
  const newFileRef = ref(storage, filePath);
  await uploadString(newFileRef, data);
}

export const getFileContents = async (filePath) => {
  const fileRef = ref(storage, filePath);
  const downloadURL = await getDownloadURL(fileRef);
  const response = await fetch(downloadURL);
  return response.text();
}

export const getFileContentsAsJson = async (filePath) => {
  const contents = await getFileContents(filePath);
  return JSON.parse(contents);
}

export const getFilesInFolder = async (folderPath) => {
  const folderRef = ref(storage, folderPath);
  const res = await listAll(folderRef);
  const files = res.items.map(item => item.fullPath);
  return files;
}

export const deleteFile = async (filePath) => {
    await bucket.file(filePath).delete();
}