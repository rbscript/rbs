import {resolveNode} from './node'

export class OpCall {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_mid")
	this.op = line.value


	line = tree.nextLine(startLine.indent, "attr", "nd_recv")

	line = tree.nextLine(line.indent)
	this.recv = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_args")
	line = tree.nextLine(line.indent)
	this.args = resolveNode(tree, line)
    }
}

export class OpAnd {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_1st")
	line = tree.nextLine(line.indent)
	this.first = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_2nd")
	line = tree.nextLine(line.indent)
	this.second = resolveNode(tree, line)
    }
}
