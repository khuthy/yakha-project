
export const firebaseConfig = {
    apiKey: "AIzaSyAH_4qSdZUBa_dL39kA2HDeWN8GYIDqIrk",
  authDomain: "yakha-eccb9.firebaseapp.com",
  databaseURL: "https://yakha-eccb9.firebaseio.com",
  projectId: "yakha-eccb9",
  storageBucket: "yakha-eccb9.appspot.com",
  messagingSenderId: "1001029779379",
  appId: "1:1001029779379:web:5ddca013a311b59a2dd5c6",
  measurementId: "G-G57RNJ3DMG"
  }


  export const snapshotToArray = snapshot => {
    let returnArray = [];

    snapshot.forEach(element => {
    let list = element.val();
    list.key = element.key;
    returnArray.push(list)

    });

    return returnArray;
  }
