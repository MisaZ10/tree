const path = require('path')
const {
  tree,
  treeJson
} = require('..')

async function showExamples () {
  const json = await treeJson(path.join(__dirname, 'levels'), {
    level: 5,
    onlyDir: true
  })
  const string = await tree(path.join(__dirname, 'levels'), {
    showHiddenFiles: true,
    extensions: /txt|jpeg/
  })
  console.log(json)
  console.log(string)
}

showExamples()
