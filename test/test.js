const path = require('path')
const {
  dirTree,
  showTree
} = require('..')

const treeJson = dirTree(path.join(__dirname, 'levels'), {
  level: 5,
  onlyDir: true
})
const tree = showTree(path.join(__dirname, 'levels'))
console.log(tree)
console.log(treeJson)
