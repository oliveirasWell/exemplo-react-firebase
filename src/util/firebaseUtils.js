import firebase from 'firebase';

const config = {
    apiKey: "**************************",
    authDomain: "**************************",
    databaseURL: "**************************",
    projectId: "**************************",
    storageBucket: "**************************",
    messagingSenderId: "**************************"
};

console.log("entrou");

export const firebaseImpl = firebase.initializeApp(config);
export const firebaseDatabase = firebase.database();
export const firebaseAuth = firebase.auth();