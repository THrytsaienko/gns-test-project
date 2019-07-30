import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
        apiKey: "AIzaSyCxAKVes_12KzEnt7C-RTIVCKY9z9buDHc",
        authDomain: "gns-test-ed442.firebaseapp.com",
        databaseURL: "https://gns-test-ed442.firebaseio.com",
        projectId: "gns-test-ed442",
        storageBucket: "gns-test-ed442.appspot.com",
        messagingSenderId: "383653697678",
        appId: "1:383653697678:web:63c5e952e5afd057"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export const loadDataToDB = (item) => {
    db.collection("data").add(item)
        .then(() => {
        })
        .catch((error) => {
            alert("Error adding document: ", error);
        });
};

export const getDataFromDB = async () => {
    const dataFromDB = await db.collection("data").get()
        .then((querySnapshot) => querySnapshot.docs)
        .then((documents) => {
            return documents.map(item => Object.assign({"doc_id": item.id}, item.data()));
        })
        .catch((error) => {
            alert("Error while reading documents from database: ", error);
        });
    return dataFromDB;
};

export const deleteDataFromDB = async (doc_id) => {
    await db.collection("data").doc(doc_id).delete().then(() => {
    }).catch((error) => {
        alert("Error removing document: ", error);
    });
};

export const addDataToDB = async (newItem) => {
    db.collection("data").doc().set(newItem)
        .then(() => {
        })
        .catch((error) => {
            alert("Error writing document: ", error);
        });
};

export const updateDataToDB = async (doc_id, newItem) => {
    db.collection("data").doc(doc_id).set(newItem, { merge: true })
        .then(() => {
        })
        .catch((error) => {
            alert("Error writing document: ", error);
        });
};
