'use strict'
const fs = require('fs')
const path = require('path')

function isRegExp (regExp) {
  return typeof regExp === 'object' && regExp.constructor === RegExp
}
function getName (fullPath) {
  return path.basename(fullPath)
}
function getStats (fullPath) {
  return fs.lstatSync(fullPath)
}
function getExt (fullPath) {
  return path.extname(fullPath).toLowerCase()
}
function getDirData (fullPath) {
  let dirData = {}
  try {
    dirData = fs.readdirSync(fullPath)
  } catch (e) {
    // User does not have permissions, ignore directory
    if (e.code === 'EACCES') return null
    throw e
  }
  return dirData
}

function normalize (fullPath) {
  return path.resolve(fullPath)
}
function join (fullPath, child) {
  return path.join(fullPath, child)
}
function realPath(fullPath) {
  return fs.realpathSync(fullPath)
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
