
export const firebaseConfig = {
  apiKey: "AIzaSyD9AGh8BiRDUjOEu3fkEXUwawSK8WmPfVg",
  authDomain: "yakha-bda91.firebaseapp.com",
  databaseURL: "https://yakha-bda91.firebaseio.com",
  projectId: "yakha-bda91",
  storageBucket: "yakha-bda91.appspot.com",
  messagingSenderId: "27383344134",
  appId: "1:27383344134:web:b0d24fa7e5f8a9de"
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
