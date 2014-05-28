/**
 * Extend the $App class.
 */

// Exports
module.exports = {

	/**
	 * NPM
	 */
	dependencies: ['moment'],

	/**
	 * Private
	 */
	private: {
		_config: {
			"servername": "*",

			// Auto import
			"import": [],

			"cache": true,

			// Components
			"components": {
				// Blongular Server
				"blongular": {
					"class": "BlongularServer"
				},
				// DbConnection configuration (remove comment to enable)
				"database": {
					"class": "DbConnection",
					"alias": "db",
					"engine": "mongo",
					"address": "127.0.0.1",
					"port": 27017,
					"database": "blongular"
				}
			}
		}
	},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Function called when the blog is initialized.
		 */
		init: function () {

            var port = self.getParent().getComponent('http').getConfig('listen') || 27890;

			// Moment
			self.moment=moment;

			// Debug MongoDB
			if (self.db.getConfig('debug')===true)
				self.db.dataObject.driver.set('debug',true);

			// DB Connection Message
			self.db.once('connect',function (e,err,conn) {
				if (err)
				{
					self.e.log('Failed to connect to DATABASE.');
                    self.setupMode = true;
				}

                if (self.setupMode)
					self.e.log('Running on SETUP mode.');
                else
					self.e.log('BLONGULAR is ready.');

                self.e.log('Access your blongular at http://127.0.0.1:'+port+'/');
			});

			// Block request if not ready.
			self.prependListener('newRequest',function (e,req,resp) {
				if (!self.db.connected && !self.setupMode)
				{
					resp.statusCode = 503;
					resp.end();
				} else
					e.next();
			});

		}

	}

};
