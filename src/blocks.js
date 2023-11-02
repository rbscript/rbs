import {Body} from './body'
import {resolveNode} from './node'

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
