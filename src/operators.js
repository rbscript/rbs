import {resolveNode} from './node'

export class OpCall {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_mid")
	this.op = line.value


	line = tree.nextLine(startLine.indent, "attr", "nd_recv")

	line = tree.nextLine(line.indent)
	this.recv = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_args")
	line = tree.nextLine(line.indent)
	this.args = resolveNode(tree, line)
    }
}

export class OpAnd {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_1st")
	line = tree.nextLine(line.indent)
	this.first = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_2nd")
	line = tree.nextLine(line.indent)
	this.second = resolveNode(tree, line)
    }
}

export class OpOr {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_1st")
	line = tree.nextLine(line.indent)
	this.firsts = [resolveNode(tree, line)]

	// There may be more 1sts
	while (true) {
	    line = tree.nextLine(startLine.indent)
	    if (line.name == "nd_2nd") {
		break
	    }

	    line = tree.nextLine(line.indent)
	    this.firsts.push(resolveNode(tree, line))
	}
	
	// Add the nd_2nd and finish
	line = tree.nextLine(line.indent)
	this.second = resolveNode(tree, line)
    }
}

export class OpAssignAnd {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_value")
	line = tree.nextLine(line.indent)
	this.value = resolveNode(tree, line)
    }
}

export class OpAssignOr {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_value")
	line = tree.nextLine(line.indent)
	this.value = resolveNode(tree, line)
    }
}

export class OpAssign1 {
    constructor(tree, startLine) {
	this.location = startLine.location

	this.recv = tree.get(startLine, "nd_recv")
	this.mid = tree.get(startLine, "nd_mid")
	this.head = tree.get(startLine, "nd_args->nd_head")
	this.body = tree.get(startLine, "nd_args->nd_body")
    }
}
