firebase.initializeApp({
  apiKey: 'AIzaSyCU2RNhm6GjhsWSt4yuwg9OF2Lv3ANzA0A',
  authDomain: 'denbar-dev.firebaseapp.com',
  projectId: 'denbar-dev',
  storageBucket: 'denbar-dev.appspot.com',
  messagingSenderId: '109263499755',
  appId: '1:109263499755:web:24ff5390a9a43ff82e69ae',
  measurementId: 'G-YLXHNF708T',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
