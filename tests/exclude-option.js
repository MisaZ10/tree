const test = require('ava')
const proxyquire = require('proxyquire')
const utils = require('./fixtures/utils')
const { treeJson } = proxyquire('../', {
  './libs/utils': utils
})
const rootPath = '/root-path'
const constants = {
  DIRECTORY: 'directory',
  FILE: 'file'
}
const { serial } = test

serial('treeJson should generate a correct tree with exclude dir-2', async t => {
  const json = await treeJson(rootPath, {
    exclude: /dir-2/
  })
  const file = json.children[0]
  const dir1 = json.children[1]
  t.is(json.children.length, 2, '/root-path should to have 2 children')
  t.is(dir1.children.length, 0, '/root-path/dir-1 should to have 0 children')
  t.truthy(file.type === constants.FILE, 'file1.txt type should to be file')
  t.truthy(dir1.type === constants.DIRECTORY, '/root-path/dir-1 type should to be directory')
})
serial('treeJson should generate a correct tree with exclude dir-2 and dir-1', async t => {
  const json = await treeJson(rootPath, {
    exclude: [/dir-1/, /dir-2/]
  })
  const file = json.children[0]
  t.is(json.children.length, 1, '/root-path should to have 1 children')
  t.truthy(file.type === constants.FILE, 'file1.txt type should to be file')
})
