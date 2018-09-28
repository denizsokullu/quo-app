import firebase from 'firebase/app';
import 'firebase/database';

const config = {
  apiKey: "AIzaSyCOJCrAjbXhyjVF94rUH6GEqoxI0jEuutM",
  authDomain: "quo-app-data.firebaseapp.com",
  databaseURL: "https://quo-app-data.firebaseio.com",
  storageBucket: "quo-app-data.appspot.com",
};

firebase.initializeApp(config);

const database = firebase.database();

export {
  database,
}
