/**
 * Blongular -> BlongularServer
 *
 * @copyright: Copyright &copy; 2013- Pedro Nasser &reg;
 * @page: http://github.com/blongular/blungular
 * @license: http://github.com/blongular/blongular/blob/master/LICENSE
 */

/**
 * No description yet.
 *
 * @author Pedro Nasser
 */

// Exports
module.exports = {

	/**
	 * Class Extension
	 */
	extend: ['Component'],

	/**
	 * PRIVATE
	 */
	private: {
		_corePath: require('path').resolve(__dirname,'..'),
		_configPath: '/config/',
		_config: {
			configPath: ''
		},
		_components: {}
	},

	/**
	 * Public Variables
	 */
	public: {

        defaultEvents: {}

    },

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Initializer
		 */
		init: function ()
		{
            self.e.log('Loading your Blongular...')
			this.app = this.getParent();
			this.importConfig(path.join(_corePath,_configPath));
			this.importConfig(path.join(this.app.modulePath,_config.configPath));
			this.prepareUpload();
			this.prepareTheme();
			this.prepareSetup();
			this.startComponents();
			this.prepareControllers();
            this.prepareEvents();
			this.loadPlugins();
		},

		/**
		 * Import all JSON config from a directory.
		 * @param string $dir configuration directory
		 */
		importConfig: function (dir)
		{
			if (_.isString(dir) && fs.existsSync(dir))
			{
				var files = fs.readdirSync(dir)
				for (f in files)
				{
					if (/\.json$/.test(files[f]))
					{
                        var configPath = path.join(dir,files[f]);
						var configFile=fs.readFileSync(configPath);
						if (!configFile)
							continue;
						try {
							var config=JSON.parse(configFile.toString('utf8')
													.replace(/\\/g,function () { return "\\"+arguments[0]; })
													.replace(/\/\/.+?(?=\n|\r|$)|\/\*[\s\S]+?\*\//g,''));
							if (!config.components)
							{
								self.app.setConfig(config);
							} else {
								_.merge(_components,config.components);
							}
						} catch (e) {
							throw e;
						}
					}
				}

			}
			else
				return false
		},

		/**
		 * Prepare your blog for setup mode.
		 */
		prepareSetup: function ()
		{
            _components.static.serve.push('../../blongular/setup/html');
            _components.setup = {
                "class": "BlongularSetup"
            };
		},

		/**
		 * Prepare your blog to handle uploads
		 */
		prepareUpload: function ()
		{
			var uploadDir = path.join(this.app.modulePath,this.app.getConfig('upload').directory);
			if (!fs.existsSync(uploadDir))
			{
				try { fs.mkdirSync(uploadDir); fs.chmodSync(uploadDir, '0777'); } catch (e) {
					console.log(e);
				}
			}
		},

		/**
		 * Prepare your application to load the correct theme.
		 */
		prepareTheme: function ()
		{
			_.merge(_components,{
				static: {
					serve: ['upload/',path.join('themes',this.app.getConfig('theme'),'public')+'/'],
				},
				controller: {
					path: {
						views: path.join('themes',this.app.getConfig('theme'),'views')+'/'
					}
				}
			});
		},

		/**
		 * Prepare your application to load controllers on the correct path.
		 */
		prepareControllers: function () {
			var relative = path.relative(this.app.modulePath,path.join(_corePath,'controllers/'));
			this.app.getComponent('controller').setConfig({
				path: {
					controllers: relative+'/'
				}
			});
		},

		/**
		 * Start all Blongular required components
		 */
		startComponents: function ()
		{
			this.app.setConfig({ components: _components });
			this.app.setComponents(_components);
			for (c in _components)
			{
                if (this.app.debugMode)
                {
                    _components[c].debug = true;
                    _components[c].verbosity = 5;
                }

				var comp = this.app.getComponent(c);
			}
		},

        /**
         * Prepare Blongular events
         */
        prepareEvents: function () {

        },

		/**
		 * Load Blongular plugins
		 */
		loadPlugins: function () {
			var pluginsPath = path.join(self.app.modulePath,'plugins');
			var cb = self.app.getComponent('classCompiler');

			if (!fs.existsSync(pluginsPath))
				fs.mkdirSync(pluginsPath);

			try {
				var plugins=fs.readdirSync(pluginsPath)
				for (p in plugins)
					if (fs.statSync(path.join(pluginsPath,plugins[p])).isDirectory())
						self.app.getConfig().import.push(path.join('plugins',plugins[p]));
				self.app.importFromConfig();
			} catch (e) {
				self.e.err(e);
			}

			cb.run();

			try {
				var pluginConfig = fs.readFileSync(path.join(self.app.modulePath,'plugins.json'));
				pluginConfig = JSON.parse(pluginConfig.toString('utf8'));
				self.app.setComponents(pluginConfig);
				for (c in pluginConfig)
				{
					self.app.getComponent(c);
				}
			} catch (e) {
				self.e.err(e);
			}
		}

	}

};
