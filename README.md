# mavo-firebase

A Firebase storage backend for Mavo 

# Getting started 

## Sign up for Firebase

- Sign in with your Google account (or create a new account) at https://console.firebase.google.com/
- Create a new project and click *Add Firebase to your web app*. You'll see a code snippet that looks similar to the one below (with the parameters automatically filled in). Copy and paste this code into your HTML file. 
```javascript
<script src="https://www.gstatic.com/firebasejs/3.8.0/firebase.js"></script>
<script>
  // Initialize Firebase
  var config = {
    apiKey: "%API-KEY%",
    authDomain: "%AUTH-DOMAIN%",
    databaseURL: "%DATABASE-URL%",
    projectId: "%PROJECT-ID%",
    storageBucket: "%STORAGE-BUCKET%",
    messagingSenderId: "%MESSAGING-SENDER-ID%"
  };
  firebase.initializeApp(config);
</script>
```
## How to use

Use the Firebase plugin by including the ```mv-storage``` attribute with the parameter ```firebase```. 

## Example 

```javascript
<section mv-app="firebasetest" mv-storage="firebase">
	<table>
		<tr>
			<td>
				<ul>
					<li property="country" mv-multiple>
						<span property="code">Code</span>
						<span property="name">Name</span>
					</li>
				</ul>
			</td>
		</tr>
	</table>
</section>
```


