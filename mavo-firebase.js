(function($) {

if (!self.Mavo) {
	return;
}

var _ = Mavo.Backend.register($.Class({
	extends: Mavo.Backend,
	id: "Firebase",
	constructor: function() {
		this.permissions.on(["read", "login"]);
	},

	login: function() {
		return this.ready.then(() => {
			return (new Promise((resolve, reject) => {
				var self = this;
				var initializationCheck = setInterval(function() {
				    if (firebase.apps.length > 0) {
				        clearInterval(initializationCheck);
				        var provider = new firebase.auth.GoogleAuthProvider();
								firebase.auth().signInWithPopup(provider).then(function(result) {
									console.log(result);

									self.accessToken = result.credential.accessToken;
									self.user = result.user;
									self.permissions.on(["edit", "add", "delete", "save", "logout"]);
									$.fire(self.mavo.element, "mavo:login", {
										 backend: self,
										 name: `<a>${self.user.displayName}
						 									<img class="mv-avatar" src="${self.user.photoURL}" /> ${name}
						 								</a>`
									 });
								 }).catch(function(error) {
										this.mavo.error("There was an error when logging in");
								 });
				    }
				}, 50);
			}))
		});
	},

	logout: function() {
		delete this.accessToken;
		this.user = null;
		this.permissions.off(["edit", "add", "delete", "save"]).on("login");
		this.mavo.element._.fire("mavo:logout", {backend: this});
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

			$.fire(this.mavo.element, "mavo:login", { backend: this });
		});
	},

	/**
	 * Saves a file to the backend.
	 * @param {Object} file - An object with name & data keys
	 * @return {Promise} A promise that resolves when the file is saved.
	 */
	put: function(file = this.getFile()) {
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
