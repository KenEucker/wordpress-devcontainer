const fs = require('fs-extra'),
	path = require('path'),
	replace = require('replace-in-file'),
	mkdirp = require('mkdirp'),
	chalk = require('chalk'),

	pull = require('./pull.js'),
	config = require('./package.json').config,
	siteIsVIP = config.vip,
	sourceFolder = path.resolve('src');

if (siteIsVIP) {
	const wordpressFolder = path.resolve('.wp'),
		vipFolders = [
			'client-mu-plugins',
			'images',
			'languages',
			'private',
			'vip-config',
		];

	const wordpressVIPMuPlugins = `Automattic/vip-go-mu-plugins-built`;

	const createFolderInWordpressContentFolder = (folderPath, done) => {
		if (!done) {

			done = (err) => {
				if (err) console.error(err)
			};
		}

		mkdirp(path.join(wordpressFolder, 'wp-content', folderPath), done);
	}

	if (fs.existsSync(wordpressFolder)) {

		for (const folderPath of vipFolders) {
			createFolderInWordpressContentFolder(folderPath);
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
			console.log(chalk.green('Wordpres Config Successfully Updated'));
		})
	} else {
		console.error(chalk.red('wp folder does not exist'), wordpressFolder);
	}
}
