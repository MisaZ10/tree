'use strict'

const defaults = require('defaults');
const {
	isRegExp,
	getDirData,
	getExt,
	getStats,
	getName,
	normalize,
	join
} = require('./libs/utils')

const constants = {
	DIRECTORY: 'directory',
	FILE: 'file'
}
function directoryTree(path, options, myLevel) {
	options = defaults(options, {
		level: 20,
		onlyDir: false
	})
	if (!myLevel) {
		myLevel = 0
	}
	const { level, exclude, extensions, onlyDir } = options
	if (level == myLevel) {
		return;
	}
	path = normalize(path);
	const name = getName(path);
	const item = { path, name };
	let stats;

	try { stats = getStats(path); }
	catch (e) { return false; }

	if (exclude) {
		const excludes = isRegExp(exclude) ? [exclude] : exclude;
		if (excludes.some((exclusion) => exclusion.test(path))) {
			return false;
		}
	}
	
	item.size = stats.size;
	if (stats.isFile() && !onlyDir) {
		const ext = getExt(path)
		if (extensions && isRegExp(extensions) && !extensions.test(ext)) return false;
		item.extension = ext;
		item.type = constants.FILE;
		return item
	}
	if (stats.isDirectory()) {
		let dirData = getDirData(path);
		if (dirData === null) return false;
		const level = myLevel + 1
		item.children = dirData
			.map(child => directoryTree(join(path, child), options, level))
			.filter(e => e);
		item.size = item.children.reduce((prev, child) => prev + child.size, 0);
		item.type = constants.DIRECTORY;
		return item
	}
	return false;
}
function handleFatalError(err) {
	console.error(`[fatal error] ${err.message}`)
	process.exit(1)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

module.exports = directoryTree;
