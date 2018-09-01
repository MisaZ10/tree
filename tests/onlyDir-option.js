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

serial('treeJson should generate a correct tree and show only directories', async t => {
  const json = await treeJson(rootPath, {
    onlyDir: true
  })
  const dir1 = json.children[0]
  const dir2 = json.children[1]
  const link = dir2.children[0]
  t.is(json.children.length, 2, '/root-path should to have 2 children')
  t.is(dir1.children.length, 0, '/root-path/dir-1 should to have 0 children')
  t.is(dir2.children.length, 1, '/root-path/dir-2 should to have 1 children')
  t.truthy(dir1.type === constants.DIRECTORY, '/root-path/dir-1 type should to be directory')
  t.truthy(dir2.type === constants.DIRECTORY, '/root-path/dir-2 type should to be directory')
  t.truthy(link.isSymbolicLink, '/root-path/dir-2/file-link-1 should to be a link')
})
