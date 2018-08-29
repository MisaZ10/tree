const path = require('path')
const {
  dirTree,
  showTree
} = require('..')

const tree = dirTree(path.join(__dirname, 'levels'), {
  level: 50
})
console.log(tree)
