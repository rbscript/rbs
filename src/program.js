import {Scope} from './blocks'

export class Program {
    constructor(tree) {
	let line = tree.nextLine(0, "NODE_SCOPE")
	this.scope = new Scope(this, tree, line)
    }

    convert(output) {
	this.scope.convert(output)
	return output.toString()
    }
}

export class Artifact {
    constructor(parent, startLine) {
	this.location = startLine.location
	this.parent = parent
    }

    convert(output) {
	throw "convert() not implemented for " + this.constructor.name
    }

    add(output, str) {
	output.add(this.location.startCol, str)
    }
}
