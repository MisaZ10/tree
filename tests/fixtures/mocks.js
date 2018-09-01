function extend (obj, values) {
  const clone = Object.assign({}, obj)
  return Object.assign(clone, values)
}
const directoryBase = {
  isSymbolicLink: () => false,
  isFile: () => false,
  isDirectory: () => true,
  size: 4096,
  birthtime: '2018-08-27T23: 10: 43.674Z',
  mtime: '2018-08-27T23: 10: 43.674Z,'
}
const fileBase = {
  isSymbolicLink: () => false,
  isFile: () => true,
  isDirectory: () => false,
  size: 1024,
  birthtime: '2018-08-27T23: 10: 43.674Z',
  mtime: '2018-08-27T23: 10: 43.674Z,'
}
const stats = {
  '/root-path': directoryBase,
  '/root-path/file1.txt': fileBase,
  '/root-path/dir-1': directoryBase,
  '/root-path/dir-2': directoryBase,
  '/root-path/dir-2/file-link-1': extend(fileBase, {
    isSymbolicLink: () => true,
    isFile: () => false
  }),
  '/root-path-extensions': directoryBase,
  '/root-path-extensions/file1.txt': fileBase,
  '/root-path-extensions/file.yml': fileBase,
  '/root-path-extensions/img.png': fileBase,
  '/root-path-extensions/dir-1': directoryBase,
  '/root-path-extensions/dir-2': directoryBase,
  '/root-path-extensions/dir-2/file2.txt': fileBase
}
const readdirs = {
  '/root-path': [
    'file1.txt',
    'dir-1',
    'dir-2'
  ],
  '/root-path/dir-1': [],
  '/root-path/dir-2': [
    'file-link-1'
  ],
  '/root-path-extensions': [
    'file1.txt',
    'file.yml',
    'img.png',
    'dir-1',
    'dir-2'
  ],
  '/root-path-extensions/dir-1': [],
  '/root-path-extensions/dir-2': [
    'file2.txt'
  ]
}
module.exports = {
  stats,
  readdirs
}
