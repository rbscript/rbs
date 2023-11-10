import {resolveNode} from './node'
import {Artifact} from './program'

export class OpCall extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_mid")
	this.op = line.value


	line = tree.nextLine(startLine.indent, "attr", "nd_recv")

	line = tree.nextLine(line.indent)
	this.recv = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_args")
	line = tree.nextLine(line.indent)
	this.args = resolveNode(this, tree, line)
    }
}

export class OpAnd extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_1st")
	line = tree.nextLine(line.indent)
	this.firsts = [resolveNode(this, tree, line)]

	// There may be more 1sts
	while (true) {
	    line = tree.nextLine(startLine.indent)
	    if (line.name == "nd_2nd") {
		break
	    }

	    line = tree.nextLine(line.indent)
	    this.firsts.push(resolveNode(this, tree, line))
	}
	
	// Add the nd_2nd and finish
	line = tree.nextLine(line.indent)
	this.second = resolveNode(this, tree, line)
    }
}

export class OpOr extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_1st")
	line = tree.nextLine(line.indent)
	this.firsts = [resolveNode(this, tree, line)]

	// There may be more 1sts
	while (true) {
	    line = tree.nextLine(startLine.indent)
	    if (line.name == "nd_2nd") {
		break
	    }

	    line = tree.nextLine(line.indent)
	    this.firsts.push(resolveNode(this, tree, line))
	}
	
	// Add the nd_2nd and finish
	line = tree.nextLine(line.indent)
	this.second = resolveNode(this, tree, line)
    }
}

export class AssignAnd extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_value")
	line = tree.nextLine(line.indent)
	this.value = resolveNode(this, tree, line)
    }
}

export class OpAssignAnd extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_value")
	line = tree.nextLine(line.indent)
	this.value = resolveNode(this, tree, line)
    }
}


export class AssignOr extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_value")
	line = tree.nextLine(line.indent)
	this.value = resolveNode(this, tree, line)
    }
}


export class OpAssignOr extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_value")
	line = tree.nextLine(line.indent)
	this.value = resolveNode(this, tree, line)
    }
}

export class OpAssign1 extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.recv = tree.get(this, startLine, "nd_recv")
	this.mid = tree.get(this, startLine, "nd_mid")
	this.head = tree.get(this, startLine, "nd_args->nd_head")
	this.body = tree.get(this, startLine, "nd_args->nd_body")
    }
}

export class OpAssign2 extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.recv = tree.get(this, startLine, "nd_recv")
	this.vid = tree.get(this, startLine, "nd_next->nd_vid")
	this.mid = tree.get(this, startLine, "nd_next->nd_mid")
	this.value = tree.get(this, startLine, "nd_value")
    }
}


export class Defined extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.head = tree.get(this, startLine, "nd_head")
    }
}
