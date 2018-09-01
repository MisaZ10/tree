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

serial('treeJson should generate a correct tree with level 1', async t => {
  const json = await treeJson(rootPath, {
    level: 1
  })
  t.is(json.children.length, 0, '/root-path should to have 3 children')
})
serial('treeJson should generate a correct tree with level 2', async t => {
  const json = await treeJson(rootPath, {
    level: 2
  })
  const file = json.children[0]
  const dir1 = json.children[1]
  const dir2 = json.children[2]
  t.is(json.children.length, 3, '/root-path should to have 3 children')
  t.is(dir1.children.length, 0, '/root-path/dir-1 should to have 0 children')
  t.is(dir2.children.length, 0, '/root-path/dir-2 should to have 0 children')
	t.is(file.type, constants.FILE, 'file1.txt type should to be file')
	t.is(dir1.type, constants.DIRECTORY, '/root-path/dir-1 type should to be directory')
	t.is(dir2.type, constants.DIRECTORY, '/root-path/dir-2 type should to be directory')
})
serial('treeJson should generate a correct tree with level 3', async t => {
  const json = await treeJson(rootPath)
  const file = json.children[0]
  const dir1 = json.children[1]
  const dir2 = json.children[2]
  const link = dir2.children[0]
  t.is(json.children.length, 3, '/root-path should to have 3 children')
  t.is(dir1.children.length, 0, '/root-path/dir-1 should to have 0 children')
  t.is(dir2.children.length, 1, '/root-path/dir-2 should to have 1 children')
	t.is(file.type, constants.FILE, 'file1.txt type should to be file')
	t.is(dir1.type, constants.DIRECTORY, '/root-path/dir-1 type should to be directory')
	t.is(dir2.type, constants.DIRECTORY, '/root-path/dir-2 type should to be directory')
  t.truthy(link.isSymbolicLink, '/root-path/dir-2/file-link-1 should to be a link')
})
