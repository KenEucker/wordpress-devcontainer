const fs = require('fs-extra'),
	path = require('path'),
	replace = require('replace-in-file'),
	mkdirp = require('mkdirp'),
	config = require('./package.json').config,
	siteIsVIP = config.vip,
	pull = require('./pull.js'),
	sourceFolder = 'src';

if (siteIsVIP) {
	const wordpressFolder = '.wp',
		vipFolders = [
			'client-mu-plugins',
			'images',
			'languages',
			'private',
			'vip-config',
		];

	const wordpressVIPMuPlugins = `Automattic/vip-go-mu-plugins`;

	const createFolderInWordpressFolder = (folderPath, done) => {
		if (!done) {

			done = (err) => {
				if (err) console.error(err)
			};
		}

		mkdirp(path.join(wordpressFolder, folderPath), done);
	}

	if (!fs.existsSync(`${__dirname}${wordpressFolder}`)) {

		for (const folderPath of vipFolders) {
			createFolderInWordpressFolder(folderPath);
		}

		pull(wordpressVIPMuPlugins, `${sourceFolder}/mu-plugins`);

		// Add the vip-config to the wp-config
		const editAfterString = `/* That's all, stop editing! Happy publishing. */`;

		const insertWpConfigString = `if ( file_exists( __DIR__ . '/wp-content/vip-config/vip-config.php' ) ) {\r\trequire_once( __DIR__ . '/wp-content/vip-config/vip-config.php' );\r}`;

		const replaceOptions = {
			files: path.resolve(`${wordpressFolder}/wp-config.php`),
			from: editAfterString,
			to: `${insertWpConfigString}\r\n${editAfterString}`,
		};

		replace(replaceOptions).then((changes) => {
			console.log('Wordpres Config Successfully Updated');
		})
	} else {
		console.error('wp folder does not exist', wordpressFolder);
	}
}
