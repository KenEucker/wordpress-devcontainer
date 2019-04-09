const download = require('download-git-repo'),
	commander = require('commander'),
	pkg = require('./package.json'),
	config = pkg.config || {},
	sourceFolder = 'src';

commander.version(pkg.version)
	.option('-r, --repo [repo]', 'name of the repository to pull', config.repo)
	.option('-d, --dest [dest]', 'the destination folder', sourceFolder)
	.option('-c, --clone', 'clone the repository', config.cloneRepo)
	.parse(process.argv);

const repo = commander.repo,
	dest = commander.dest,
	clone = !!commander.clone;

const downloadRepo = function (repo, dest, clone) {
	download(repo, dest, { clone }, function (err) {
		if (err) {
			console.error(err);
		} else {
			console.log(`repository (${repo}) pulled successfully into folder [${dest}]`, { clone });
		}
	});
}

if (repo && repo.length && dest.length) {
	downloadRepo(repo, dest, clone);
} else {
	if (config.theme_repo && config.theme_repo) {
		const themeDest = `${sourceFolder}/theme`;
		console.info(`pulling theme repository (${config.theme_repo}) into ${themeDest}`);

		downloadRepo(config.theme_repo, themeDest, clone);
	}

	if (config.plugin_repo && config.plugin_repo) {
		const pluginDest = `${sourceFolder}/plugin`;
		console.info(`pulling plugin repository (${config.plugin_repo}) into ${pluginDest}`);

		downloadRepo(config.plugin_repo, pluginDest, clone);
	}
}
