import {resolveNode} from './node'
import {List} from './lists'

export class Hash {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	this.brace = tree.get(startLine, "nd_brace")
	this.head = tree.get(startLine, "nd_head")
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
