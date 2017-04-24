(function($) {

if (!self.Mavo) {
	return;
}

var _ = Mavo.Backend.register($.Class({
	extends: Mavo.Backend,
	id: "Firebase",
	constructor: function() {
		this.permissions.on(["read", "login"]);
		this.login(true);
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
								self.user = result.user;
								self.permissions.on(["edit", "add", "delete", "save", "logout"]);
								self.getUser();
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
			console.log(JSON.stringify(snapshot.val()));
			return JSON.stringify(snapshot.val());
		}));
		return null;
	},

	getUser: function() {
		console.log(this.user);

		if (this.user) {
			return Promise.resolve(this.user);
		}

		return this.request("user").then(info => {
			this.user = {
				username: info.displayName,
				name: info.email,
				avatar: info.photoURL,
				info
			};

			// TODO: avator not showing up
			$.fire(this.mavo.element, "mavo:login", {
				backend: this,
				name: `<a>${info.displayName}
								 <img class="mv-avatar" src="${info.photoURL}" /> ${name}
							 </a>`
			});
		});
	},

	store: function(data, {path, format = this.format} = {}) {
		return this.ready.then(() => {
			console.log(data);
			return data;
		});
	},

	/**
	 * Saves a file to the backend.
	 * @param {String} serialized - Serialized data
	 * @param {String} path - Optional file path
	 * @return {Promise} A promise that resolves when the file is saved.
	 */
	put: function(serialized, path = this.path, o = {}) {
		// TODO: how to get file
		file = this.getFile();
		console.log(serialized);
		console.log(file['data']);
		firebase.database().ref('data/').set(file['data']);
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
