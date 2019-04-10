const fs = require('fs-extra'),
	path = require('path'),
	config = require('./package.json').config,
	mkdirp = require('mkdirp'),
	themeName = config.theme_name,
	pluginName = config.plugin_name || config.theme_name,
	siteIsVIP = config.vip,
	buildParent = 'dist',
	sourceParent = 'src';

let sourceFolders = ['theme/dist', 'themes', 'plugin', 'plugins'],
	buildFolders = ['themes', 'themes', 'plugins', 'plugins'];

if (siteIsVIP) {
	vipFolders = [
		'client-mu-plugins',
		'images',
		'languages',
		'private',
		'vip-config',
	];

	sourceFolders = sourceFolders.concat(vipFolders);
	buildFolders = buildFolders.concat(vipFolders);
}

if (fs.existsSync(buildParent)) {
	console.log('deleting build folder', buildParent);
	fs.removeSync(buildParent);
}

for (let index in sourceFolders) {

	let sourceName = sourceFolders[index],
		buildName = buildFolders[index],
		sourceFolder = path.join(sourceParent, sourceName),
		buildFolder = path.join(buildParent, buildName);

	if (fs.existsSync(sourceFolder)) {
		fs.readdir(sourceFolder, function (err, files) {

			if (err) console.error(err)
			else {
				if (files.length) {

					// Aptly name the theme or plugin
					if (sourceName == 'theme' || sourceName == 'theme/dist') {
						buildFolder = path.join(buildFolder, themeName);
					} else if (sourceName == 'plugin') {
						buildFolder = path.join(buildFolder, pluginName);
					}

					mkdirp(buildFolder, function (err) {

						if (err) console.error(err);
						else {
							fs.copy(sourceFolder, buildFolder, function (err) {

								if (err) return console.error(err);
								else {
									console.log(`${sourceName} copied to the build folder`, buildFolder);
								}
							});
						}
					});
				}
			}

		});
	}
}
