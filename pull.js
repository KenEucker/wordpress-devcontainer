const download = require('download-git-repo'),
	commander = require('commander'),
	path = require('path'),
	chalk = require('chalk'),
	fs = require('fs-extra'),
	mkdirp = require('mkdirp-sync'),

	pkg = require('./package.json'),
	config = pkg.config.repositories || {},
	sourceFolder = path.resolve('src');

commander.version(pkg.version)
	.option('-o, --overwrite [overwrite]', 'overwrite the source folder contents', false)
	.option('-r, --repo [repo]', 'name of the repository to pull', config.src)
	.option('-d, --dest [dest]', 'the destination folder', sourceFolder)
	.option('-a, --auth [auth]', 'the authorization token', config.access_token)
	.option('-c, --clone [clone]', 'clone the repository', config.clone)
	.option('-y, --yes [yes]', 'autorun', false)
	.parse(process.argv);


const repo = commander.repo,
	dest = commander.dest,
	clone = !!commander.clone,
	auto = !!commander.yes,
	overwrite = !!commander.overwrite,
	authorization = commander.auth ? `Authorization: token ${commander.auth}` : null;

const downloadRepo = function (repo, dest, overwrite) {
	const opts = {
		clone,
		authorization
	};
	const done = function (err) {
		if (err) {
			console.error(err);
		} else {
			console.log(chalk.green(`repository (${repo}) pulled successfully into folder [${dest}]`));
		}
	};

	if (!fs.existsSync(dest)) {
		mkdirp(dest);
	}
	fs.readdir(dest, function (err, files) {
		if (err) console.error(err)
		else {
			if (!files.length || overwrite) {
				fs.removeSync(dest);
				download(repo, dest, opts, done);
			}
		}
	});
};

if ((repo && repo.length && dest.length) || overwrite || auto) {
	if (!fs.existsSync(sourceFolder)) {
		mkdirp(sourceFolder);
	}

	fs.readdir(sourceFolder, function (err, files) {
		if (err) console.error(err)
		else {

			if ((!files.length && !!repo) || (overwrite && !!repo)) {
				console.log(chalk.orange(`loading src from repository ${repo} into folder ${sourceFolder}`));
				downloadRepo(repo, sourceFolder, overwrite);
			}

			if (!files.length || overwrite) {
				const ignoreKeys = ['src', 'clone', 'access_token'];
				Object.keys(config).forEach(function (key) {
					const val = config[key];

					if (val && ignoreKeys.indexOf(key) == -1) {
						const dest = `${sourceFolder}/${key}`;
						console.log(chalk.cyan(`loading repository ${val} into folder ${dest}`));

						downloadRepo(val, dest, true);
					}
				});
			}
		}
	});
}

module.exports = downloadRepo;
