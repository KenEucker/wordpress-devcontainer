const ncp = require('ncp').ncp,
	fs = require('fs'),
	config = require('./package.json').config,
	mkdirp = require('mkdirp'),
	themeName = config.theme_name,
	pluginName = config.plugin_name || config.theme_name,
	buildFolder = 'dist',
	sourceFolder = 'src',
	themeSourceFolder = `${sourceFolder}/theme/`,
	pluginSourceFolder = `${sourceFolder}/plugin/`,
	themeOutputFolder = `${buildFolder}/themes/${themeName}`,
	pluginOutputFolder = `${buildFolder}/plugins/${pluginName}`;

fs.readdir(pluginSourceFolder, function (err, files) {

	if (err) console.error(err)
	else {
		if (files.length) {

			mkdirp(pluginOutputFolder, function (err) {

				if (err) console.error(err);
				else {

					ncp(`${sourceFolder}/plugin`, pluginOutputFolder, function (err) {

						if (err) return console.error(err);
						else {
							console.log(`Plugin {${pluginName}} copied to the build folder`, pluginOutputFolder);
						}
					});
				}
			});
		}
	}
});

fs.readdir(themeSourceFolder, function (err, files) {

	if (err) console.error(err)
	else {
		if (files.length) {

			mkdirp(themeOutputFolder, function (err) {
				if (err) console.error(err);

				ncp(`${sourceFolder}/theme`, themeOutputFolder, function (err) {

					if (err) return console.error(err);
					else {
						console.log(`Theme ${themeName} copied to the build folder`, themeOutputFolder);
					}
				});
			});
		}
	}
});
