import {Body} from './body'
import {resolveNode} from './node'

export class Scope {
    constructor(tree, startLine) {
	
	this.location = startLine.location

	const indent = startLine.indent 
	
	// nd_tbl: (empty)
	tree.nextLine(indent, "attr", "nd_tbl")

	// # +- nd_args:
        // # |   (null node)
	let line = tree.nextLine(indent, "attr", "nd_args")
	line = tree.nextLine(line.indent)
	this.args = resolveNode(tree, line)

	// # +- nd_body:
	line = tree.nextLine(indent, "attr", "nd_body")

	this.body = new Body(tree, line)
	
    }
}

export class Block {
    constructor(tree, startLine) {
	this.location = startLine.location

	this.statements = []
	while (true) {
	    let line = tree.nextLine(startLine.indent) // expecting "attr", "nd_head")
	    if (line == undefined) {
		break
	    }
	    line = tree.nextLine(startLine.indent)
	    this.statements.push(resolveNode(tree, line))
	}
    }
}

export class Begin {
    constructor(tree, startLine) {
	this.location = startLine.location
	const line = tree.nextLine(startLine.indent, "attr", "nd_body")
	this.body = new Body(tree, line)
    }
}
