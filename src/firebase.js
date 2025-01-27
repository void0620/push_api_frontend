// firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCP4PpwYto4mVulz_9tOzntKcM6fZXOWlI",
    authDomain: "notification-73748.firebaseapp.com",
    projectId: "notification-73748",
    storageBucket: "notification-73748.firebasestorage.app",
    messagingSenderId: "786794008863",
    appId: "1:786794008863:web:043f6304d44979c749a02a",
    measurementId: "G-BZYZ2VHB9J"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const requestNotificationPermission = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BGJFCXX1smeCkxvpRbURA5Jwx2LEyWOt8dds1wvlRooL0hEGbgPe_BfmYRSXN9CMH-1kN6atTAqj3kiiFfnWEPY",
    });
    if (currentToken) {
      console.log("FCM Token:", currentToken);
      return currentToken;
    } else {
      console.log("No registration token available.");
    }
  } catch (error) {
    console.error("Error fetching FCM token:", error);
  }
};

export const onNotificationListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Message received: ", payload);
      resolve(payload);
    });
  });
