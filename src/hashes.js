import {resolveNode} from './node'
import {Artifact} from './artifact'
import {List} from './lists'
import {Return} from './statements'

export class Hash extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
	
	this.brace = tree.get(this, startLine, "nd_brace")
	this.head = tree.get(this, startLine, "nd_head")
    }

    convert(output) {
	if (this.brace != "1 (hash literal)") {
	    throw "Unexpected brace for hash " + this.brace
	}

	if (this.head == undefined) {
	    this.add(output, "{}")
	    return
	}
	
	this.add(output, "{")
	output.indent()

	for (let i = 0; i < this.head.array.length; i += 2) {
	    if (i != 0) {
		this.add(output, ",")
	    }
	    this.addNewLine(output, this.head.array[i])
	    this.add(output, ": ")
	    this.add(output, this.head.array[i + 1])
	}
	
	output.unindent()
	this.add(output, "}")
    }

    returnize(tree) {
	return Return.ize(tree, this)
    }
}

export class HashPattern extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

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
