import firebase from 'firebase/app';//This line is a must, to use firebase as given here - https://firebase.google.com/docs/web/setup?authuser=0
                                    //The above should always be the first line
import 'firebase/storage';//From this point we should import the perticular services we want to use

//firebase - Becasue had the blaze plan already, so scalabilty - if needed, will not be a problem as won't have to pay a fixed amount every month (like in cloudinary). It will automatically charge as per the app usge. And even cheaper than cloudniary 

  // Initialize Firebase
  firebase.initializeApp(process.env.REACT_APP_FIREBASE_CONFIG);

  const storage = firebase.storage();

  export {
    storage//, firebase as default 
  }
