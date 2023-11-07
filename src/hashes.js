import {resolveNode} from './node'
import {List} from './lists'

export class Hash {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_brace")
	this.brace = line.value // What is brace?

	line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.list = resolveNode(tree, line)
    }
}

export class HashPattern {
    constructor(tree, startLine) {
	this.location = startLine.location

	let line = tree.nextLine(startLine.indent, "attr", "nd_pconst")
	line = tree.nextLine(line.indent)
	this.pconst = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_pkwargs")
	line = tree.nextLine(line.indent)
	this.pkwargs = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_pkwrestarg")
	line = tree.nextLine(line.indent)
	this.pkwrestarg = resolveNode(tree, line)
    }
}
