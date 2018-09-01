const test = require('ava')
// const { spy, createSandbox } = require('sinon')
const proxyquire = require('proxyquire')
const utils = require('./fixtures/utils')
const { tree, treeJson } = proxyquire('../', {
  './libs/utils': utils
})
const rootPath = '/root-path'
const constants = {
  DIRECTORY: 'directory',
  FILE: 'file'
}
// const { beforeEach, afterEach, serial } = test
test('tree and treeJson should exist', t => {
  t.truthy(tree, 'Tree string function exist')
  t.truthy(treeJson, 'Tree json functiWon exist')
})
test('treeJson should generate a correct tree without options', async t => {
  const json = await treeJson(rootPath)
  const file = json.children[0]
  const dir1 = json.children[1]
  const dir2 = json.children[2]
  const link = dir2.children[0]
  t.is(json.children.length, 3, '/root-path should to have 3 children')
  t.is(dir1.children.length, 0, '/root-path/dir-1 should to have 0 children')
  t.is(dir2.children.length, 1, '/root-path/dir-2 should to have 1 children')
  t.truthy(file.type === constants.FILE, 'file1.txt type should to be file')
  t.truthy(dir1.type === constants.DIRECTORY, '/root-path/dir-1 type should to be directory')
  t.truthy(dir2.type === constants.DIRECTORY, '/root-path/dir-2 type should to be directory')
  t.truthy(link.isSymbolicLink, '/root-path/dir-2/file-link-1 should to be a link')
})
