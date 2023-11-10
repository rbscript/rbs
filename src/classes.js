import {resolveNode} from './node'
import {Artifact} from './program'

export class Class extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_cpath")
	line = tree.nextLine(line.indent)
	this.cpath  = resolveNode(this, tree, line)
	
	line = tree.nextLine(startLine.indent, "attr", "nd_super")
	line = tree.nextLine(line.indent)
	this.super = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)
    }
}

export class Self extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
    }
}

export class Singleton extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_recv")
	line = tree.nextLine(line.indent)
	this.recv = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)
    }
}

export class Module extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_cpath")
	line = tree.nextLine(line.indent)
	this.cpath  = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)
    }
}

export class Colon2 extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_mid")
	this.mid = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(this, tree, line)
    }
}

// ::Z
export class Colon3 extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_mid")
	this.mid = line.value
    }
}

export class Super extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_args")
	line = tree.nextLine(line.indent)
	this.args  = resolveNode(this, tree, line)
    }
}

export class ZSuper extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
    }
}

