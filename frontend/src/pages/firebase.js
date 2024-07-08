import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBK5jYhHHCxMNSnI5JBTEEpS6-gmbO0Yxs",
    authDomain: "ltp-nft.firebaseapp.com",
    projectId: "ltp-nft",
    storageBucket: "ltp-nft.appspot.com",
    messagingSenderId: "668434192847",
    appId: "1:668434192847:web:af9f2b063aa4db6a3edaba",
    measurementId: "G-3VLG6J5JZ4"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);

export { storage, ref, uploadBytesResumable, getDownloadURL, collection, addDoc, firestore };
