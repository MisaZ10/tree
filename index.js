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
async function treeJson (path, options, myLevel) {
  options = defaults(options, {
    level: 20,
    onlyDir: false,
    showHiddenFiles: false
  })
  if (!myLevel) {
    myLevel = 0
  }
  const { level, exclude, extensions, onlyDir, showHiddenFiles } = options
  if (level === myLevel) {
    return false
  }
  path = normalize(path)
  const name = getName(path)
  const item = { path, name }
  if (name.charAt(0) === '.' && !showHiddenFiles) {
    return false
  }
  let stats

  try { stats = await getStats(path) } catch (e) { return false }

  if (exclude) {
    const excludes = isRegExp(exclude) ? [exclude] : exclude
    if (excludes.some((exclusion) => exclusion.test(name))) {
      return false
    }
  }

  item.size = stats.size
  item.isSymbolicLink = stats.isSymbolicLink()
  item.createAt = stats.birthtime
  item.updateAt = stats.mtime
  if (item.isSymbolicLink) {
    item.realPath = realPath(path)
  }
  if (stats.isFile() && !onlyDir) {
    const ext = getExt(path)
    if (ext.length > 0 && extensions && isRegExp(extensions) && !extensions.test(ext)) return false
    item.extension = ext
    item.type = constants.FILE
  }
  if (stats.isDirectory()) {
    let dirData = await getDirData(path)
    if (dirData === null) return false
    const level = myLevel + 1
    item.type = constants.DIRECTORY
    item.children = []

    for (let i = 0; i < dirData.length; i++) {
      const child = dirData[i]
      const data = await treeJson(join(path, child), options, level)
      if (data) item.children.push(data)
    }
    item.size = item.children.reduce((prev, child) => prev + child.size, 0)
  }
  return item
}

function createTree (children, prefix, option) {
  let tree = ''
  const max = children.length - 1
  children.forEach(({ type, name, children, isSymbolicLink, realPath }, index) => {
    const isDirectory = type === constants.DIRECTORY
    const isFile = type === constants.FILE
    let line
    if (name.charAt(0) === '.' && !option.showHiddenFiles) {
      return
    }
    if (index === max) {
      line = '└── ' + name + '\n'
      if (isDirectory) {
        tree += prefix + chalk.green(line)
        tree += createTree(children, prefix + '    ', option)
        return
      }
      if (isSymbolicLink) {
        line = '└── ' + chalk.blue(name) + ' --> ' + chalk.blue(realPath) + '\n'
        tree += line
        return
      }
      if (isFile) {
        tree += prefix + chalk.white(line)
        return
      }
      return
    }
    line = '├── ' + name + '\n'
    if (isSymbolicLink) {
      line = '├── ' + name + chalk.green(' ──> ') + chalk.cyan(realPath) + '\n'
      tree += prefix + chalk.cyanBright(line)
      return
    }
    if (isDirectory) {
      tree += prefix + chalk.green(line)
      tree += createTree(children, prefix + '│   ', option)
      return
    }
    tree += prefix + chalk.white(line)
  })
  return tree
}

async function tree (path, option) {
  const { name, children } = await treeJson(path, option)
  return `${chalk.green(name)}` + '\n' + createTree(children, ' ', option)
}

module.exports = {
  treeJson,
  tree
}
