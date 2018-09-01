const test = require('ava')
const proxyquire = require('proxyquire')
const utils = require('./fixtures/utils')
const { treeJson } = proxyquire('../', {
  './libs/utils': utils
})
const rootPath = '/root-path-extensions'
const constants = {
  DIRECTORY: 'directory',
  FILE: 'file'
}
const { serial } = test
serial('treeJson should generate a correct tree with extensions png files', async t => {
  const json = await treeJson(rootPath, {
    extensions: /png/
  })
  const file = json.children[0]
  const dir1 = json.children[1]
  const dir2 = json.children[2]
  t.is(json.children.length, 3, '/root-path-extensions should to have 3 children')
  t.is(dir1.children.length, 0, '/root-path-extensions/dir-1 should to have 0 children')
  t.is(dir2.children.length, 0, '/root-path-extensions/dir-2 should to have 0 children')
  t.is(file.name, 'img.png', 'file name should to be img.png')
  t.is(file.type, constants.FILE, 'img.png type should to be file')
  t.is(dir1.type, constants.DIRECTORY, '/root-path-extensions/dir-1 type should to be directory')
  t.is(dir2.type, constants.DIRECTORY, '/root-path-extensions/dir-2 type should to be directory')
})

serial('treeJson should generate a correct tree with extensions txt files', async t => {
  const json = await treeJson(rootPath, {
    extensions: /txt/
  })
  const file1 = json.children[0]
  const dir1 = json.children[1]
  const dir2 = json.children[2]
  const file2 = dir2.children[0]

  t.is(json.children.length, 3, '/root-path-extensions should to have 3 children')
  t.is(dir1.children.length, 0, '/root-path-extensions/dir-1 should to have 0 children')
  t.is(dir2.children.length, 1, '/root-path-extensions/dir-2 should to have 1 children')
  t.is(file1.name, 'file1.txt', 'file name  should to be file1.txt')
  t.is(file1.type, constants.FILE, 'file1.txt type should to be file')
  t.is(file2.name, 'file2.txt', 'file name should to be file2.txt')
  t.is(file2.type, constants.FILE, 'file2.txt type should to be file')
  t.is(dir1.type, constants.DIRECTORY, '/root-path-extensions/dir-1 type should to be directory')
  t.is(dir2.type, constants.DIRECTORY, '/root-path-extensions/dir-2 type should to be directory')
})
serial('treeJson should generate a correct tree with extensions txt and png files', async t => {
  const json = await treeJson(rootPath, {
    extensions: /txt|png/
  })
  const file1 = json.children[0]
  const img = json.children[1]
  const dir1 = json.children[2]
  const dir2 = json.children[3]
  const file2 = dir2.children[0]

  t.is(json.children.length, 4, '/root-path-extensions should to have 4 children')
  t.is(dir1.children.length, 0, '/root-path-extensions/dir-1 should to have 0 children')
  t.is(dir2.children.length, 1, '/root-path-extensions/dir-2 should to have 1 children')
  t.is(file1.name, 'file1.txt', 'file name  should to be file1.txt')
  t.is(file1.type, constants.FILE, 'file1.txt type should to be file')
  t.is(img.name, 'img.png', 'file name should to be img.png')
  t.is(img.type, constants.FILE, 'img.png type should to be file')
  t.is(file2.name, 'file2.txt', 'file name should to be file2.txt')
  t.is(file2.type, constants.FILE, 'file2.txt type should to be file')
  t.is(dir1.type, constants.DIRECTORY, '/root-path-extensions/dir-1 type should to be directory')
  t.is(dir2.type, constants.DIRECTORY, '/root-path-extensions/dir-2 type should to be directory')
})
