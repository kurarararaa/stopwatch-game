import firebase from 'firebase'
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyBTM3xv6CG5GUsmSHITxl5RsFW3BJXfXAI",
    authDomain: "stopwatch-game-f5e9e.firebaseapp.com",
    databaseURL: 'https://stopwatch-game-f5e9e.firebaseio.com',
    projectId: "stopwatch-game-f5e9e",
    storageBucket: "stopwatch-game-f5e9e.appspot.com",
    messagingSenderId: "1077731748319"
  })
}
export default firebase