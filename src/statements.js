import {resolveNode} from './node'
import {List} from './lists'

export class If {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_cond")

	line = tree.nextLine(line.indent)
	this.cond = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_else")
	line = tree.nextLine(line.indent)
	this.elsepart = resolveNode(tree, line)
	
    }
}

export class Unless {
    constructor(tree, startLine) {
	this.location = startLine.location

	let line = tree.nextLine(startLine.indent, "attr", "nd_cond")

	line = tree.nextLine(line.indent)
	this.cond = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_else")
	line = tree.nextLine(line.indent)
	this.elsepart = resolveNode(tree, line)
	
    }
}

export class Return {
    constructor(tree, startLine) {
	this.location = startLine.location

	let line = tree.nextLine(startLine.indent, "attr", "nd_stts")

	line = tree.nextLine(line.indent)
	this.stts = resolveNode(tree, line)
    }
}

export class Break {
    constructor(tree, startLine) {
	this.location = startLine.location

	let line = tree.nextLine(startLine.indent, "attr", "nd_stts")

	line = tree.nextLine(line.indent)
	this.stts = resolveNode(tree, line)
    }
}

export class Next {
    constructor(tree, startLine) {
	this.location = startLine.location

	let line = tree.nextLine(startLine.indent, "attr", "nd_stts")

	line = tree.nextLine(line.indent)
	this.stts = resolveNode(tree, line)
    }
}

export class Redo {
    constructor(tree, startLine) {
	this.location = startLine.location
    }
}



export class For {
    constructor(tree, startLine) {
	this.location = startLine.location

	let line = tree.nextLine(startLine.indent, "attr", "nd_iter")

	line = tree.nextLine(line.indent)
	this.iter = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(tree, line)
    }
}

export class While {
    constructor(tree, startLine) {
	this.location = startLine.location

	let line = tree.nextLine(startLine.indent, "attr", "nd_state")
	this.state = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_cond")
	line = tree.nextLine(line.indent)
	this.cond = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(tree, line)
    }
}

export class Until {
    constructor(tree, startLine) {
	this.location = startLine.location

	let line = tree.nextLine(startLine.indent, "attr", "nd_state")
	this.state = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_cond")
	line = tree.nextLine(line.indent)
	this.cond = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(tree, line)
    }
}

export class Case {
    constructor(tree, startLine) {
	this.location = startLine.location
	this.type = startLine.type
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.cond = resolveNode(tree, line)

	// This body consists of NODE_WHENs or NODE_INs
	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	if (line.type == "NODE_WHEN") {
	    this.firstWhen = new When(tree, line)
	} else if (line.type == "NODE_IN") {
	    this.firstWhen = new In(tree, line)
	} else {
	    throw "Unexpected node " + line.type + " while resolving case"
	}
    }
}

class When {
    constructor(tree, startLine) {
	this.location = startLine.location

	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.cond = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_next")
	line = tree.nextLine(line.indent)
	switch (line.type) {
	case "NODE_WHEN":
	    this.when = new When(tree, line)
	case "(null node)":
	    this.elsepart = undefined
	    break
	default:
	    this.elsepart = resolveNode(tree, line)
	    break
	}
    }
}

class In {
    constructor(tree, startLine) {
	this.location = startLine.location

	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.cond = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_next")
	line = tree.nextLine(line.indent)
	switch (line.type) {
	case "NODE_IN":
	    this.when = new When(tree, line)
	case "(null node)":
	    this.elsepart = undefined
	    break
	default:
	    this.elsepart = resolveNode(tree, line)
	    break
	}
    }
}
