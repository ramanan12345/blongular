/**
 * Source of the User model.
 */

// Exports
module.exports = {

	/**
	 * Class dependencies
	 */
	extend: ['ActiveRecord'],

	/**
	 * NPM Dependencies
	 */
	dependencies: ['bcrypt','crypto'],

	/**
	 * PRIVATE
	 */
	private: {},

	/**
	 * Public Variables
	 */
	public: {
		errors: {
			PROCESS_ERROR: 'Error during process',
			MISSING_INFO: 'All field must be fullfiled',
			INCORRECT_INFO: 'Incorrect information',
			USER_NOTFOUND: 'User not found',
			USER_EXIST: 'User already exist',
			EMAIL_INVALID: 'Invalid email',
			PASSWORD_INVALID: 'Invalid password',
			PASSWORD_UNDEFINED: 'User.password not defined',
			LOGIN_INVALID: 'User not found',
			EMAIL_INCORRECT: 'Incorrect email confirmation',
			PASSWORD_SALT: 'Failed to generate password salt',
			PASSWORD_BCRYPT: 'Failed to bcrypt password'
		}
	},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Returns the name of the associated database collection.
		 * @return string the collection name
		 */
		collectionName: function ()
		{
			return 'User';
		},

		/**
		 * User's Schema
		 */
		schema: function ()
		{
			return {
				email: {
					type: String,
					label: 'Email',
					required: true,
					unique: true,
					safe: true
				},
				username: {
					type: String,
					label: 'Username',
					require: true,
					unique: true,
					safe: true
				},
				password: {
					type: String,
					label: 'Password',
					required: true,
				},
				name: {
					type: String,
					label: 'Name',
					safe: true
				},
				displayName: {
					type: String,
					label: 'Display Name',
					safe: true
				},				
				createDate: {
					type: Date,
					label: 'Created',
					required: true,
					safe: true
				},
				gravatarEmail: {
					type: String,
					label: 'Gravatar Email',
					required: true,
					safe: true
				},
				bio: {
					type: String,
					label: 'Bio',
					safe: true
				},
				website: {
					type: String,
					label: 'Website',
					safe: true
				},
				location: {
					type: String,
					label: 'Location',
					safe: true
				}
			};
		},

		/**
		 * Validate 
		 */
		$validate: function (action::String)
		{
			switch (action)
			{
				case 'login':

					if (!this.attr('email') || !this.attr('password'))
						done.reject(new Error('MISSING_INFO'));
					else
						done.resolve(true);

				break;

				case 'cadastro':

					if (!this.attr('email') || !this.attr('password') || !this.attr('name'))
						done.reject(new Error('MISSING_INFO'));
					else
						done.resolve(true);

				break;

				default:
					done.resolve(true);
				break;
			}

			return done.promise;
		},

		/**
		 * Promise: Encrypt password
		 */
		$encryptPassword: function (pass:::String)
		{

			function genSalt(err, salt)
			{
				if (err)
					done.reject(new Error('PASSWORD_SALT'));
			    else {
					bcrypt.hash(pass, salt, cryptResult);
			    }
			}

			function cryptResult(err, hash)
			{
				if (err)
					done.reject(new Error('PASSWORD_BCRYPT'));
			    else
					done.resolve(hash);
			}

			bcrypt.genSalt(10, genSalt);

			return done.promise;
		},

		/**
		 * Promise: Compare password against bcrypted password.
		 */
		$comparePassword: function (pass:::String)
		{
			if (!_.isString(self.attr('password')))
				done.reject(new Error('PASSWORD_UNDEFINED'));
			else 
			{

				function comparePassword(err, res) {
					if (err||!res)
						done.reject(new Error('PASSWORD_INVALID'));
				    else
				    	done.resolve(res);
				}

				bcrypt.compare(pass, self.attr('password'), comparePassword);

			}
			return done.promise;
		},

		/**
		 * Promise: Get user from DB, check if password matches
		 */
		$login: function (password:::String)
		{
			var findUser = {};
			var password = password;
			var email = self.attr('email');

			if (!_.isString(email) || password.length==0 || email.length == 0)
				done.reject(new Error('INCORRECT_INFO'));
			else
			{
				findUser.email = email;
				// STEP 1: GET USER
				self.$getUser(findUser)
				// STEP 2: COMPARE PASSWORD
				.then(function (user) {
					if (user == null)
						done.resolve(false);
					else {
						self.setAttributes(user);
						return self.$comparePassword(password)
					}
				})
				// STEP 3: Resolve Promise
				.then(done.resolve)
				// STEP FAIL: Reject promise
				.catch(done.reject)
			}

			return done.promise;
		},

		/**
		 * Promise: Return the User from DB.
		 */
		$getUser: function (user:::Object,select)
		{
			if (!_.isUndefined(select) && !_.isObject(select))
				done.reject(new Error('PROCESS_ERROR'));
			else
				self.query().find(user).limit(1).select(select).find(function (err,d) {
					if (err)
						done.reject(new Error('PROCESS_ERROR'));
					else if (_.isNull(d) || (_.isArray(d) && d.length==0))
						done.resolve(null);
					else
					{
						self.setAttributes(d[0]);
						self.$getGravatar()
						.then(function () {
							done.resolve(self.getAttributes());
						});
					}
				});

			return done.promise;
		},

		/**
		 * Get gravatar hash for user
		 */
		$getGravatar: function ()
		{
			var email = self.attr('gravatarEmail');

			if (!_.isString(email))
				done.reject(new Error('EMAIL_INVALID'));
			else {
				var md5sum = crypto.createHash('md5');
					md5sum.update(email);
				var digest = md5sum.digest('hex');
				self.attr('gravatarHash',digest);
				done.resolve(digest);
			}

			return done.promise;
		},

		/**
		 * Promise: Check if any user exist with the given attributes
		 */
		$existUser: function (attr)
		{
			done.promise.attr = attr || {};
			if (!_.isObject(attr))
				done.reject(new Error('PROCESS_ERROR'))
			else
			{
				self.getModel().findOne(attr, function (err,d) {
					if (err)
						done.reject(new Error('PROCESS_ERROR'));
					else
					{
						if (d==null)
							done.resolve(true);
						else
							done.reject(new Error('USER_EXIST'));
					}
				});
			}
			return done.promise;
		},

		/**
		 * Promise: All the user creation process.
		 */
		$create: function ()
		{
			var password = self.attr('password');
			var email = self.attr('email');

			// STEP 1 - Check if email exist.
			var task = self.$existUser({ email: email })

			// STEP 2 - Encrypt password
			.then(function (exist) {
				return self.$encryptPassword(password);
			})

			// STEP 3 - Insert user
			.then(function (password) {
				self.setAttribute('password',password);
				self.encryptedPassword=true;
				self.newObject=true;
				return self.$save();
			})

			// STEP 4 - Send result
			.then(function (model) {
				self.setAttributes(model);
				done.resolve(model);
			})

			// Exception
			.catch(done.reject);

			return done.promise;
		},

		/**
		 * Promise: Update user
		 */
		$update: function (newProps:::Object)
		{
			if (!self.attr('_id'))
				done.reject(new Error('PROCESS_ERROR'))
			else {
				self.newObject=false;

				function save (password)
				{
					if (!_.isUndefined(password))
						newProps.password = password;

					var _id = self.attr('_id');

					self.clearAttributes();
					self.setAttribute('_id',_id);
					self.setAttributes(newProps);

					self.$save()
					.then(done.resolve)
					.catch(done.reject);
				}

				// Just try to encrypt password (if undefined it skips)
				if (_.isString(newProps.password))
					self.$encryptPassword(newProps.password).then(save).catch(done.reject);
				else
					save();
			}

			return done.promise;
		},

		/**
		 * Promise: Save/create new user;
		 */
		$save: function ()
		{
			var data = self.getAttributes();
			var model = self.getModel();

			if (self.newObject==true)
			{
				model.create(data, function (err,d) {
					if (err)
						done.reject(err);
					else
					{
						if (d!==null)
							done.resolve(d);
						else
							done.reject(new Error('PROCESS_ERROR'));
					}
				});
			} else
			{
				var id = data._id;
				delete data._id;
				model.findByIdAndUpdate(id, { $set: data }, function (err,doc) {
					if (err)
						done.reject(err);
					else
					{
						done.resolve(doc);
					}
				});
			}

			return done.promise;
		}

	}

};