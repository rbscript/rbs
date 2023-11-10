import {Scope} from './blocks'

export class Program {
    constructor(tree) {
	let line = tree.nextLine(0, "NODE_SCOPE")
	this.scope = new Scope(this, tree, line)
    }

    convert(output) {
	return this.scope.convert(output)
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
}
