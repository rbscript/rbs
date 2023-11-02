import {resolveNode} from './node'

export class List {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_alen")
	const alen = parseInt(line.value)

	this.array = []
	for (let i = 0; i < alen; ++i) {
	    line = tree.nextLine(startLine.indent, "attr", "nd_head")
	    line = tree.nextLine(line.indent)
	    this.array.push(resolveNode(tree, line))
	}

	tree.nextLine(startLine.indent, "attr", "nd_next")
	tree.nextLine(startLine.indent, "(null node)")
    }
}
