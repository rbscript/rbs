import {Artifact} from './program'
import {Body} from './body'
import {resolveNode} from './node'

export class Scope extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	this.tbl = tree.get(this, startLine, "nd_tbl")
	this.args = tree.get(this, startLine, "nd_args")
	this.body = tree.get(this, startLine, "nd_body")
    }
}

export class Block extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.statements = []
	while (true) {
	    let line = tree.nextLine(startLine.indent) // expecting "attr", "nd_head")
	    if (line == undefined) {
		break
	    }
	    line = tree.nextLine(line.indent)

	    this.statements.push(resolveNode(this, tree, line))
	}
    }
}

export class Begin extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	this.body = tree.get(this, startLine, "nd_body")
    }
}

export class Yield extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(this, tree, line)
    }
}

export class Iter extends Artifact {
    constructor(parent, tree, startLine) {
	
	super(parent, startLine)

	this.iter = tree.get(this, startLine, "nd_iter")
	this.body = tree.get(this, startLine, "nd_body")
    }
}

export class BlockPass extends Artifact {
    constructor(parent, tree, startLine) {
	
	super(parent, startLine)

	const indent = startLine.indent 
	
	let line = tree.nextLine(indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(this, tree, line)

	line = tree.nextLine(indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)
    }
}
