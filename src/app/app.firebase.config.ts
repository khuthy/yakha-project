
export const firebaseConfig = {
  apiKey: "AIzaSyBzOcm8O2Z6ce8bDgNLlA3sPkeOS-lLAo4",
  authDomain: "yakha-project.firebaseapp.com",
  databaseURL: "https://yakha-project.firebaseio.com",
  projectId: "yakha-project",
  storageBucket: "yakha-project.appspot.com",
  messagingSenderId: "587617081134",
  appId: "1:587617081134:web:a9314c5c7e4bbf54e3ccbf",
  measurementId: "G-RPG9BJSC5R"
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
