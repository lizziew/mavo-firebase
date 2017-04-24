# mavo-firebase

A Firebase storage backend for Mavo 

# Getting started 

## Sign up for Firebase

- Sign in with your Google account (or create a new account) at https://console.firebase.google.com/
- Create a new project and click *Add Firebase to your web app*
```javascript
<script src="https://www.gstatic.com/firebasejs/3.8.0/firebase.js"></script>
<script>
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCYv77KLXeSPn7qtkKentPiWxO3guTIKnk",
    authDomain: "test-59a75.firebaseapp.com",
    databaseURL: "https://test-59a75.firebaseio.com",
    projectId: "test-59a75",
    storageBucket: "test-59a75.appspot.com",
    messagingSenderId: "168577870720"
  };
  firebase.initializeApp(config);
</script>
```

