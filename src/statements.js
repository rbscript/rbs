import {resolveNode} from './node'
import {Artifact} from './program'
import {List} from './lists'

export class If extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_cond")

	line = tree.nextLine(line.indent)
	this.cond = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_else")
	line = tree.nextLine(line.indent)
	this.els = resolveNode(this, tree, line)
	
    }
}

export class Unless extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_cond")

	line = tree.nextLine(line.indent)
	this.cond = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_else")
	line = tree.nextLine(line.indent)
	this.els = resolveNode(this, tree, line)
	
    }
}

export class Return extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_stts")

	line = tree.nextLine(line.indent)
	this.stts = resolveNode(this, tree, line)
    }
}

export class Break extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_stts")

	line = tree.nextLine(line.indent)
	this.stts = resolveNode(this, tree, line)
    }
}

export class Next extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_stts")

	line = tree.nextLine(line.indent)
	this.stts = resolveNode(this, tree, line)
    }
}

export class Redo extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
    }
}



export class For extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_iter")

	line = tree.nextLine(line.indent)
	this.iter = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)
    }
}

export class While extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_state")
	this.state = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_cond")
	line = tree.nextLine(line.indent)
	this.cond = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)
    }
}

export class Until extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_state")
	this.state = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_cond")
	line = tree.nextLine(line.indent)
	this.cond = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)
    }
}

export class Case extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	this.type = startLine.type
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.cond = resolveNode(this, tree, line)

	// This body consists of NODE_WHENs or NODE_INs
	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	if (line.type == "NODE_WHEN") {
	    this.firstWhen = new When(this, tree, line)
	} else if (line.type == "NODE_IN") {
	    this.firstWhen = new In(this, tree, line)
	} else {
	    throw "Unexpected node " + line.type + " while resolving case"
	}
    }
}

class When extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.cond = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_next")
	line = tree.nextLine(line.indent)
	switch (line.type) {
	case "NODE_WHEN":
	    this.when = new When(this, tree, line)
	case "(null node)":
	    this.els = undefined
	    break
	default:
	    this.els = resolveNode(this, tree, line)
	    break
	}
    }
}

class In extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.cond = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_next")
	line = tree.nextLine(line.indent)
	switch (line.type) {
	case "NODE_IN":
	    this.when = new When(this, tree, line)
	case "(null node)":
	    this.els = undefined
	    break
	default:
	    this.els = resolveNode(this, tree, line)
	    break
	}
    }
}
