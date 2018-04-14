import * as firebase from 'firebase'

const config = {
    apiKey: "AIzaSyB5KIYEuL2FMOSdeJMjYCY3oiC8uZStK84",
    authDomain: "cs144-project.firebaseapp.com",
    databaseURL: "https://cs144-project.firebaseio.com",
    projectId: "cs144-project",
    storageBucket: "cs144-project.appspot.com",
    messagingSenderId: "33058663147"
  };


firebase.initializeApp(config);

const auth = firebase.auth();

export {
  auth,
};
