'use strict'
const path = require('path')
const { stats, readdirs } = require('./mocks')

function isRegExp (regExp) {
  return typeof regExp === 'object' && regExp.constructor === RegExp
}
function getName (fullPath) {
  return path.basename(fullPath)
}
function getStats (fullPath) {
  return Promise.resolve(stats[fullPath])
}
function getExt (fullPath) {
  return path.extname(fullPath).toLowerCase()
}
function getDirData (fullPath) {
  return Promise.resolve(readdirs[fullPath])
}
function normalize (fullPath) {
  return path.resolve(fullPath)
}
function join (fullPath, child) {
  return path.join(fullPath, child)
}
function realPath (fullPath) {
  return Promise.resolve(fullPath + 'real')
}
module.exports = {
  isRegExp,
  getDirData,
  getExt,
  getStats,
  getName,
  normalize,
  join,
  realPath
}
