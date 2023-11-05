import {Body} from './body'
import {resolveNode} from './node'

export class Ensure {
    constructor(tree, startLine) {
	
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_ensr")
	line = tree.nextLine(line.indent)
	this.ensr = resolveNode(tree, line)
    }
}

export class Rescue {
    constructor(tree, startLine) {
	
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_resq")
	line = tree.nextLine(line.indent)
	this.resq = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_else")
	line = tree.nextLine(line.indent)
	this.els = resolveNode(tree, line)

    }
}

export class RescueBody {
    constructor(tree, startLine) {
	
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_args")
	line = tree.nextLine(line.indent)
	this.args = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(tree, line)
    }
}

export class Retry {
    constructor(tree, startLine) {
	
	this.location = startLine.location
    }
}
