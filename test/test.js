const dirTree = require('..')
const tree = dirTree('/home/zmisael/Proyectos/tree-directory/test/levels', {
	level: 50,
})
console.log(tree)
const a = [1,2,4,5,6]
const sum =a.reduce((prev, cur) => {
	console.log(prev, cur)
	return prev + cur
}, 0)
console.log(sum)