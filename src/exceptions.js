import {Body} from './body'
import {resolveNode} from './node'
import {Artifact} from './program'

export class Ensure extends Artifact {
    constructor(parent, tree, startLine) {
	
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_ensr")
	line = tree.nextLine(line.indent)
	this.ensr = resolveNode(this, tree, line)
    }
}

export class Rescue extends Artifact {
    constructor(parent, tree, startLine) {
	
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_resq")
	line = tree.nextLine(line.indent)
	this.resq = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_else")
	line = tree.nextLine(line.indent)
	this.els = resolveNode(this, tree, line)

    }
}

export class RescueBody extends Artifact {
    constructor(parent, tree, startLine) {
	
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_args")
	line = tree.nextLine(line.indent)
	this.args = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(this, tree, line)
    }
}

export class Retry extends Artifact {
    constructor(parent, tree, startLine) {
	
	super(parent, startLine)
    }
}

export class ErrInfo extends Artifact {
    constructor(parent, tree, startLine) {
	
	super(parent, startLine)
    }
}
