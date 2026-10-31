importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAdd5J6DHFT78fOquDTh37GE1ZVmfEaLgQ",
    authDomain: "mivida-aa2a1.firebaseapp.com",
    projectId: "mivida-aa2a1",
    storageBucket: "mivida-aa2a1.firebasestorage.app",
    messagingSenderId: "304886930309",
    appId: "1:304886930309:web:53e3c78f8f37425debc2ec",
    measurementId: "G-5YT3X3419C"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title || '✨ MIVIDA App';
    const notificationOptions = {
        body: payload.notification.body || '¡Tienes una nueva actualización!',
        icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077035.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});