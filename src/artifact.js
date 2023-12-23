export class Artifact {
    constructor(parent, tree, startLine) {
	if (startLine != undefined) {
	    this.location = startLine.location
	}
	this.tree = tree
	this.parent = parent
    }

    toString() {
	return this.constructor.name + " AT " + this.location
    }
    
    convert(output) {
	throw "convert() not implemented for " + this.constructor.name
    }

    alignWith(output, artifact, deltaArtifact) {
	output.delta += deltaArtifact.location.startCol - artifact.location.startCol 
    }

    unalign(output, artifact, deltaArtifact) {
	output.delta -= deltaArtifact.location.startCol - artifact.location.startCol 
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

    // About let/const
    findLocalVar(la) {
	return 0
    }

    getContent() {
	const source = this.tree.content // This is the real source code, not the parsetree
	const loc = this.location
	let start = undefined
	let line = 1
	let col = 0
	for (let i = 0; i < source.length; ++i) {
	    if (source[i] == '\n') {
		line++
		col = 0
	    } else {
		// Searching for the start
		if (start == undefined &&
		    line == loc.startLine &&
		    col == loc.startCol) {

		    start = i

		// Searching for the end
		} else if (line == loc.endLine &&
			   col == loc.endCol - 1) {

		    return source.slice(start, i + 1)
		}
		col++
	    }
	}
	
	throw "undefined " + this
    }
}
