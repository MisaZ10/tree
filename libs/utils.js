'use strict'
const fs = require('fs')
const path = require('path')

function isRegExp(regExp) {
	return typeof regExp === "object" && regExp.constructor == RegExp;
}
function getName(fullPath) {
	return path.basename(fullPath)
}
function getStats(fullPath) {
	return fs.statSync(fullPath)
}
function getExt(fullPath) {
	return path.extname(fullPath).toLowerCase()
}
function getDirData(fullPath) {
	let dirData = {};
	try {
		dirData = fs.readdirSync(fullPath);
	} catch (e) {
		if (e.code == "EACCES")
			//User does not have permissions, ignore directory
			return null;
		else throw e;
	}
	return dirData;
}

function normalize(fullPath) {
	return path.resolve(fullPath)
}
function join(fullPath, child) {
	return path.join(fullPath, child)
}
module.exports = {
	isRegExp,
	getDirData,
	getExt,
	getStats,
	getName,
	normalize,
	join
}