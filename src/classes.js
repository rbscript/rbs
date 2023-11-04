import {resolveNode} from './node'

export class Class {
    constructor(tree, startLine) {
	this.location = startLine.location

	let line = tree.nextLine(startLine.indent, "attr", "nd_cpath")
	let indent = line.indent // save for later
	line = tree.nextLine(line.indent, "NODE_COLON2")
	line = tree.nextLine(line.indent, "attr", "nd_mid")
	this.name = line.value

	line = tree.nextLine(line.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(tree, line)

	line = tree.nextLine(indent, "attr", "nd_super")
	line = tree.nextLine(line.indent)
	this.super = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(tree, line)
    }
}

export class Self {
    constructor(tree, startLine) {
	this.location = startLine.location
    }
}

export class Singleton {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_recv")
	line = tree.nextLine(line.indent)
	this.recv = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(tree, line)
    }
}
