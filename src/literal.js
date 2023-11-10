import {Artifact} from './program'

export class Literal extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	const line = tree.nextLine(startLine.indent, "attr", "nd_lit")
	this.value = line.value
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
