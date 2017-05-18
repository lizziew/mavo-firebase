(function($) {

if (!self.Mavo) {
	return;
}

var _ = Mavo.Backend.register($.Class({
	extends: Mavo.Backend,
	id: "Firebase",
	constructor: function() {
		console.log(this.mavo.id);

		this.setPermissions();
	},

	setPermissions() {
		firebase.database().ref('admin').once('value').then(function(snapshot) {
			var permissions_key = snapshot.val()["permissions_key"]

			var test_xhr_get = new XMLHttpRequest();
			test_xhr_get.open('GET', permissions_key, true);
			test_xhr_get.send();
			test_xhr_get.onreadystatechange = processRequest;
			function processRequest(e) {
		    if (test_xhr_get.readyState == 4 && test_xhr_get.status == 200) {
		        console.log(test_xhr_get.responseText);
		    }
			}

			var test_xhr_put = new XMLHttpRequest();
			test_xhr_put.open('PUT', permissions_key, true);
			test_xhr_put.send('{ "rules": { ".read": true, ".write": true} }');
			test_xhr_put.onreadystatechange = processRequest;
			function processRequest(e) {
		    if (test_xhr_put.readyState == 4 && test_xhr_put.status == 200) {
		        console.log(test_xhr_put.responseText);
		    }
			}
		});

		if(this.mavo.id.includes("public-read")) {
			this.permissions.on(["read"]);
		}

		if(this.mavo.id.includes("public-write")) {
			this.permissions.on(["edit", "add", "delete", "save"]);
		}
		else if(this.mavo.id.includes("user-write")){
			this.permissions.on(["login"]);
			this.login(true);
		}
	},

	isAuthenticated: function() {
		return !!this.accessToken;
	},

	login: function(passive) {
		return this.ready.then(() => {
			if(this.isAuthenticated()) {
				return Promise.resolve();
			}

			return (new Promise((resolve, reject) => {
				if (passive) {
					if (this.accessToken) {
						resolve(this.accessToken);
					}
				}

				var self = this;
				var initializationCheck = setInterval(function() {
				    if (firebase.apps.length > 0) {
			        clearInterval(initializationCheck);
			        var provider = new firebase.auth.GoogleAuthProvider();
							firebase.auth().signInWithPopup(provider).then(function(result) {
								self.accessToken = result.credential.accessToken;
								self.getUser(result.user);
								self.permissions.on(["edit", "add", "delete", "save", "logout"]);
							 }).catch(function(error) {
									self.mavo.error("There was an error when logging in");
							 });
				    }
				}, 50);
			}))
		});
	},

	logout: function() {
		if (this.isAuthenticated()) {
			delete this.accessToken;
			this.user = null;
			this.permissions.off(["edit", "add", "delete", "save"]).on("login");
			this.mavo.element._.fire("mavo:logout", {backend: this});
		}
		return Promise.resolve();
	},

	get: function() {
		return Promise.resolve(firebase.database().ref('data').once('value').then(function(snapshot) {
			return JSON.stringify(snapshot.val());
		}));
		return null;
	},

	getUser: function(info) {
		if (this.user) {
			return Promise.resolve(this.user);
		}

		if (info) {
			this.user = {
				username: info.displayName,
				name: info.email,
				avatar: info.photoURL,
				info
			};
		}
		else {
			return this.request("user").then(info => {
				this.getUser(info);

				$.fire(this.mavo.element, "mavo:login", { backend: this });
			});
		}
	},

	store: function(data, {path, format = this.format} = {}) {
		return this.ready.then(() => {
			firebase.database().ref('data/').set(data);
			return data;
		});
	},

	static: {
		test: function(url) {
			if(url.indexOf("firebase") !== -1) {
				return url;
			}
			else {
				return false;
			}
		},
	}
}));

})(Bliss);
