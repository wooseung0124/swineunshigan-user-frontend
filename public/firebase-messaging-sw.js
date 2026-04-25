importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDjF_2oE6RJy0baPT_EvQcB_MiJnwBI-00",
  authDomain: "resttime-af261.firebaseapp.com",
  projectId: "resttime-af261",
  storageBucket: "resttime-af261.firebasestorage.app",
  messagingSenderId: "1040594749079",
  appId: "1:1040594749079:web:5c3083459f12d0f505cbd2",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification;
  self.registration.showNotification(title, { body });
});