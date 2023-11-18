import {resolveNode} from './node'
import {Artifact} from './program'
import {VarCall} from './methods'
import {Return} from './statements'

export class String extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	this.lit = tree.get(this, startLine, "nd_lit")
    }

    convert(output) {
	this.add(output, this.lit)
    }

    returnize(tree) {
	return Return.ize(tree, this)
    }
}

export class XString extends Artifact { // backtick string
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	const line = tree.nextLine(startLine.indent, "attr", "nd_lit")
	this.value = line.value
    }

    // TODO convert() should call shell and got the output
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

	//let line = tree.nextLine(startLine.indent, "attr", "nd_lit")
	//this.lit = line.value
	this.lit = tree.get(this, startLine, "nd_lit")
	
	// Sometimes, NODE_DSTR has only nd_lit, because the
	// parameter is like __FILE__ and expanded during parsing
	let line = tree.nextLine(startLine.indent)
	if (line != undefined) {
	    // it should be "nd_next->nd_head")
	    line = tree.nextLine(line.indent)
	    this.head = resolveNode(this, tree, line)
	    
	    line = tree.nextLine(startLine.indent, "attr", "nd_next->nd_next")
	    line = tree.nextLine(line.indent)
	    this.next = resolveNode(this, tree, line)
	}
    }

    convert(output) {
	this.add(output, this.lit)
	if (this.head != undefined) {
	    this.add(output, " + ")
	    this.add(output, this.head)

	    if (this.next != undefined) { // it should List
		for (const head of this.next.array) {
		    this.add(output, " + ")
		    this.add(output, head)
		}
	    }
	}
    }

    returnize(tree) {
	return Return.ize(tree, this)
    }
}

export class EvalString extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.body = tree.get(this, startLine, "nd_body")
    }

    convert(output) {
	if (this.body instanceof VarCall) {
	    this.add(output, this.body)
	} else {
	    this.add(output, "(")
	    this.add(output, this.body)
	    this.add(output, ")")
	}
    }

    returnize(tree) {
	return Return.ize(tree, this)
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
