import {resolveNode} from './node'
import {Artifact} from './program'
import {List} from './lists'

export class Hash extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	this.brace = tree.get(this, startLine, "nd_brace")
	this.head = tree.get(this, startLine, "nd_head")
    }
}

export class HashPattern extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_pconst")
	line = tree.nextLine(line.indent)
	this.pconst = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_pkwargs")
	line = tree.nextLine(line.indent)
	this.pkwargs = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_pkwrestarg")
	line = tree.nextLine(line.indent)
	this.pkwrestarg = resolveNode(this, tree, line)
    }
}
