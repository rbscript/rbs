import {Body} from './body'
import {resolveNode} from './node'

export class Scope {
    constructor(tree, startLine) {
	
	this.location = startLine.location

	this.tbl = tree.get(startLine, "nd_tbl")
	this.args = tree.get(startLine, "nd_args")
	this.body = tree.get(startLine, "nd_body")
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
	    line = tree.nextLine(line.indent)

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

export class Yield {
    constructor(tree, startLine) {
	this.location = startLine.location
	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(tree, line)
    }
}

export class Iter {
    constructor(tree, startLine) {
	
	this.location = startLine.location

	this.iter = tree.get(startLine, "nd_iter")
	this.body = tree.get(startLine, "nd_body")
    }
}

export class BlockPass {
    constructor(tree, startLine) {
	
	this.location = startLine.location

	const indent = startLine.indent 
	
	let line = tree.nextLine(indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(tree, line)

	line = tree.nextLine(indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(tree, line)
    }
}
