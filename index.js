'use strict'

const defaults = require('defaults')
const chalk = require('chalk')

const {
  isRegExp,
  getDirData,
  getExt,
  getStats,
  getName,
  normalize,
  join,
  realPath
} = require('./libs/utils')

const constants = {
  DIRECTORY: 'directory',
  FILE: 'file'
}
function dirTree (path, options, myLevel) {
  options = defaults(options, {
    level: 20,
    onlyDir: false
  })
  if (!myLevel) {
    myLevel = 0
  }
  const { level, exclude, extensions, onlyDir } = options
  if (level === myLevel) {
    return
  }
  path = normalize(path)
  const name = getName(path)
  const item = { path, name }
  let stats

  try { stats = getStats(path) } catch (e) { return false }

  if (exclude) {
    const excludes = isRegExp(exclude) ? [exclude] : exclude
    if (excludes.some((exclusion) => exclusion.test(path))) {
      return false
    }
  }

  item.size = stats.size
	item.isSymbolicLink = stats.isSymbolicLink()
	item.createAt = stats.birthtime
	item.updateAt = stats.mtime
	if (item.isSymbolicLink) {
		item.realPath = realPath(path)
		return item
	}
  if (stats.isFile() && !onlyDir) {
    const ext = getExt(path)
    if (extensions && isRegExp(extensions) && !extensions.test(ext)) return false
    item.extension = ext
    item.type = constants.FILE
    return item
  }
  if (stats.isDirectory()) {
		let dirData = getDirData(path)
    if (dirData === null) return false
    const level = myLevel + 1
    item.children = dirData
      .map(child => dirTree(join(path, child), options, level))
      .filter(e => e)
    item.size = item.children.reduce((prev, child) => prev + child.size, 0)
    item.type = constants.DIRECTORY
    return item
  }
  return false
}

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  process.exit(1)
}

function createTree(children, prefix) {
  let tree = ''
  const max = children.length - 1
  children.forEach(({ type, name, children }, index) => {
    const isDirectory = type === constants.DIRECTORY
    const isFile = type === constants.FILE
    let line
    if (name.charAt(0) == '.') {
      return;
    }
    if (index === max) {
      line = '└── ' + name + '\n'
      if (isDirectory) {
        tree += prefix + chalk.green(line)
        return tree += createTree(children , prefix + '    ');
      }
      if(isFile) {
        return tree += prefix + chalk.blue(line)
      }
      return tree += line
    }
    line = '├── ' + name + '\n'
    if (isDirectory) {
      tree += prefix + chalk.green(line)
      return tree += createTree(children, prefix + '│   ');
    }
    return tree += prefix + chalk.blue(line)
  })
  return tree
}

function showTree (path, option) {
  const dirJson = dirTree(path, option)
  let tree = `${chalk.green(dirJson.name)}` + '\n'
  return tree + createTree(dirJson.children, ' ')
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

module.exports = {
  dirTree,
  showTree
}
