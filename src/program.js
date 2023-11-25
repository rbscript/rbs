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

    inClass() {
	if (this.parent == undefined) {
	    return false
	}
	return this.parent.inClass()
    }

    addClass(klass) {
	if (this.parent != undefined) {
	    this.parent.addClass(klass)
	} else {
	    throw "No object is found for our class to add"
	}
    }

    getClass(name) {
	if (this.parent != undefined) {
	    return this.parent.getClass(name)
	}
	throw "No object is found to get the class " + name
    }
}

export class Program extends Artifact {
    constructor(tree) {
	super(undefined, undefined)

	this.classes = {}

	let line = tree.nextLine(0, "NODE_SCOPE")
	this.scope = resolveNode(this, tree, line)
    }

    convert(output) {
	this.scope.convert(output)
	return output.toString()
    }

    addClass(klass) {
	this.classes[klass.name] = klass
    }

    getClass(name) {
	return this.classes[name]
    }
}

