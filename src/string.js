import {resolveNode} from './node'

export class String {
    constructor(tree, startLine) {
	this.location = startLine.location
	const line = tree.nextLine(startLine.indent, "attr", "nd_lit")
	this.value = line.value
    }
}

export class XString { // backtick string
    constructor(tree, startLine) {
	this.location = startLine.location
	const line = tree.nextLine(startLine.indent, "attr", "nd_lit")
	this.value = line.value
    }
}

export class DXString { // backtick string with interpolation
    constructor(tree, startLine) {
	this.location = startLine.location

	this.lit = tree.get(startLine, "nd_lit")
	this.head = tree.get(startLine, "nd_next->nd_head")
	this.next = tree.get(startLine, "nd_next->nd_next")
    }
}


export class DynamicString {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_lit")
	this.value = line.value

	// Sometimes, NODE_DSTR has only nd_lit, because the
	// parameter is like __FILE__ and expanded during parsing
	line = tree.nextLine(startLine.indent)
	if (line != undefined) {
	    // it should be "nd_next->nd_head")
	    line = tree.nextLine(line.indent)
	    this.head = resolveNode(tree, line)
	    
	    line = tree.nextLine(startLine.indent, "attr", "nd_next->nd_next")
	    line = tree.nextLine(line.indent)
	    this.next = resolveNode(tree, line)
	}
    }
}

export class EvalString {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(tree, line)
    }
}

export class Match {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_lit")
	line = tree.nextLine(line.indent)
	this.lit = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_value")
	line = tree.nextLine(line.indent)
	this.value = resolveNode(tree, line)
    }
}

export class Match2 {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_recv")
	line = tree.nextLine(line.indent)
	this.recv = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_value")
	line = tree.nextLine(line.indent)
	this.value = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent)
	if (line != undefined) { // nd_args
	    line = tree.nextLine(line.indent)
	    this.args = resolveNode(tree, line)
	}
    }
}

export class Match3 {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_recv")
	line = tree.nextLine(line.indent)
	this.recv = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_value")
	line = tree.nextLine(line.indent)
	this.value = resolveNode(tree, line)
    }
}

export class NthRef {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_nth")
	this.nth = line.value
    }
}

export class DynamicRegExp {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_lit")
	this.value = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_next->nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_next->nd_next")
	line = tree.nextLine(line.indent)
	this.next = resolveNode(tree, line)
    }
}

export class BackRef {
    constructor(tree, startLine) {
	this.location = startLine.location

	this.nth = tree.get(startLine, "nd_nth")
    }
}
