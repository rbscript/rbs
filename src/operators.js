import {resolveNode} from './node'
import {Artifact} from './program'

export class OpCall extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.mid = tree.get(parent, startLine, "nd_mid")
	this.recv = tree.get(parent, startLine, "nd_recv")
	this.args = tree.get(parent, startLine, "nd_args")
    }

    convert(output) {
	if (this.recv instanceof OpCall) {
	    this.add(output, "(")
	    this.add(output, this.recv)
	    this.add(output, ")")
	} else {
	    this.add(output, this.recv)
	}

	this.add(output, " ")
	this.add(output, this.mid.slice(1)) // ops are like :+
	this.add(output, " ")
	this.add(output, this.args.array[0])
	if (this.args.array.length > 1) {
	    for (let i = 1; i < this.args.array.length; ++i) {
		this.add(output, " ")
		this.add(output, this.mid.slice(1))
		this.add(output, " ")
		this.add(output, this.args.array[i])
	    }
	}
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
