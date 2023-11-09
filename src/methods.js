import {resolveNode} from './node'

export class FuncCall {
    constructor(tree, startLine) {
	this.location = startLine.location

	
	let line = tree.nextLine(startLine.indent, "attr", "nd_mid")
	this.name = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_args")
	line = tree.nextLine(line.indent)
	this.args = resolveNode(tree, line)
    }
}

export class VarCall {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_mid")
	this.name = line.value
    }
}

export class Call {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	this.mid = tree.get(startLine, "nd_mid")
	this.recv = tree.get(startLine, "nd_recv")
	this.args = tree.get(startLine, "nd_args")
    }
}

export class QCall {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_mid")
	this.name = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_recv")
	line = tree.nextLine(line.indent)
	this.recv = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_args")
	line = tree.nextLine(line.indent)
	this.args = resolveNode(tree, line)
    }
}


export class Method {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_mid")
	this.name = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_defn")
	line = tree.nextLine(line.indent)
	this.args = resolveNode(tree, line)
    }
}

export class ClassMethod {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_recv")
	line = tree.nextLine(line.indent)
	this.recv = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_mid")
	this.name = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_defn")
	line = tree.nextLine(line.indent)
	this.args = resolveNode(tree, line)
    }
}

export class Lambda {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(tree, line)
    }
}

export class OptionalArgument {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_next")
	line = tree.nextLine(line.indent)
	this.next = resolveNode(tree, line)
    }
}

export class KeywordArgument {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_next")
	line = tree.nextLine(line.indent)
	this.next = resolveNode(tree, line)
    }
}

export class Undefine {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_undef")
	line = tree.nextLine(line.indent)
	this.undef = resolveNode(tree, line)
    }
}

export class ArgsPush {
    constructor(tree, startLine) {
	this.location = startLine.location

	this.head = tree.get(startLine, "nd_head")
	this.body = tree.get(startLine, "nd_body")
    }
}

export class ArgsCat {
    constructor(tree, startLine) {
	this.location = startLine.location

	this.head = tree.get(startLine, "nd_head")
	this.body = tree.get(startLine, "nd_body")
    }
}

export class PostArg {
    constructor(tree, startLine) {
	this.location = startLine.location

	this.head = tree.get(startLine, "nd_1st")
	this.body = tree.get(startLine, "nd_2nd")
    }
}
