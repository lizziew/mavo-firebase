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
