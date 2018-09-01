'use strict'
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const lstat = promisify(fs.lstat)
const readdir = promisify(fs.readdir)
const realpathAsync = promisify(fs.realpath)

function isRegExp (regExp) {
  return typeof regExp === 'object' && regExp.constructor === RegExp
}
function getName (fullPath) {
  return path.basename(fullPath)
}
function getStats (fullPath) {
  return lstat(fullPath)
}
function getExt (fullPath) {
  return path.extname(fullPath).toLowerCase()
}
async function getDirData (fullPath) {
  let dirData = {}
  try {
    dirData = await readdir(fullPath)
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
function realPath (fullPath) {
  return realpathAsync(fullPath)
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
