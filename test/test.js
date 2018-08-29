const path = require('path')
const {
  dirTree,
  showTree
} = require('..')

const treeJson = dirTree(path.join(__dirname, 'levels'), {
  level: 50
})
const tree = showTree(path.join(__dirname, 'levels'))
console.log(tree)
