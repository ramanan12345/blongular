var fs = require('fs');

module.exports = function (global) {

	var cons=require('monostack');
	var path=require('path');

	cons.setConfig('silent',true);

	cons.setServers({
		'#': {
			"modulePath": path.relative(cons.modulePath,__dirname+'/../'),
			"serverID": 'blongular'
		}
	});

	var server = cons.createServer('#');
	server.addListener('loadModule',function (err,appName,app) {

        // Check if app is a valid Blongular
        if (fs.existsSync(app.getModulePath()+'/blongular.json')) {

            require("./load.js")(server,app,appName);

        }

	});

	cons.selectServer('#');

};
