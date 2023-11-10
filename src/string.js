import {resolveNode} from './node'
import {Artifact} from './program'

export class String extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	this.lit = tree.get(parent, startLine, "nd_lit")
    }

    convert(output) {
	this.add(output, this.lit)
    }
}

export class XString extends Artifact { // backtick string
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	const line = tree.nextLine(startLine.indent, "attr", "nd_lit")
	this.value = line.value
    }
}

export class DXString extends Artifact { // backtick string with interpolation
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.lit = tree.get(this, startLine, "nd_lit")
	this.head = tree.get(this, startLine, "nd_next->nd_head")
	this.next = tree.get(this, startLine, "nd_next->nd_next")
    }
}


export class DynamicString extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_lit")
	this.value = line.value

	// Sometimes, NODE_DSTR has only nd_lit, because the
	// parameter is like __FILE__ and expanded during parsing
	line = tree.nextLine(startLine.indent)
	if (line != undefined) {
	    // it should be "nd_next->nd_head")
	    line = tree.nextLine(line.indent)
	    this.head = resolveNode(this, tree, line)
	    
	    line = tree.nextLine(startLine.indent, "attr", "nd_next->nd_next")
	    line = tree.nextLine(line.indent)
	    this.next = resolveNode(this, tree, line)
	}
    }
}

export class EvalString extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)
    }
}

export class Match extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_lit")
	line = tree.nextLine(line.indent)
	this.lit = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_value")
	line = tree.nextLine(line.indent)
	this.value = resolveNode(this, tree, line)
    }
}

export class Match2 extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_recv")
	line = tree.nextLine(line.indent)
	this.recv = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_value")
	line = tree.nextLine(line.indent)
	this.value = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent)
	if (line != undefined) { // nd_args
	    line = tree.nextLine(line.indent)
	    this.args = resolveNode(this, tree, line)
	}
    }
}

export class Match3 extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_recv")
	line = tree.nextLine(line.indent)
	this.recv = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_value")
	line = tree.nextLine(line.indent)
	this.value = resolveNode(this, tree, line)
    }
}

export class NthRef extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_nth")
	this.nth = line.value
    }
}

export class DynamicRegExp extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_lit")
	this.value = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_next->nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_next->nd_next")
	line = tree.nextLine(line.indent)
	this.next = resolveNode(this, tree, line)
    }
}

export class BackRef extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.nth = tree.get(this, startLine, "nd_nth")
    }
}
