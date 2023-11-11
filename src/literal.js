import {Artifact} from './program'

export function symbol(str) {
    if (str instanceof Literal) {
	if (str.lit.startsWith(":")) {
	    return str.lit.slice(1)
	} else {
	    return str.lit
	}
    } else {
	if (str.startsWith(":")) {
	    return str.slice(1)
	} else {
	    return str
	}
    }
}

export class Literal extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	this.lit = tree.get(this, startLine, "nd_lit")
    }

    convert(output) {
	if (this.lit.startsWith(":")) { // Tolerance for :symbol
	    this.add(output, this.lit.slice(1))
	} else {
	    this.add(output, this.lit)
	}
    }
}

export class DynamicSymbol extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.lit = tree.get(this, startLine, "nd_lit")
	this.head = tree.get(this, startLine, "nd_next->nd_head")
	this.next = tree.get(this, startLine, "nd_next->nd_next")
    }
}
