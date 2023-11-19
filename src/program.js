import {resolveNode} from './node'

export class Artifact {
    constructor(parent, startLine) {
	if (startLine != undefined) {
	    this.location = startLine.location
	}
	this.parent = parent
    }

    convert(output) {
	throw "convert() not implemented for " + this.constructor.name
    }

    add(output, str) {
	output.add(this.location.startCol, str)
    }

    addNewLine(output, str) {
	output.addNewLine(this.location.startCol, str)
    }

    findOwner() {
	if (this.parent == undefined) {
	    return this
	}
	return this.parent.findOwner()
    }

    returnize(tree) {
	return this
    }

    isReturn() {
	return false
    }
}

export class Program extends Artifact {
    constructor(tree) {
	super(undefined, undefined)
	let line = tree.nextLine(0, "NODE_SCOPE")
	this.scope = resolveNode(this, tree, line)
    }

    convert(output) {
	this.scope.convert(output)
	return output.toString()
    }
}

