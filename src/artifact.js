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
	throw new Error(
	    "convert() not implemented for " + this.constructor.name +
		" at " + this.location)
    }

    add(output, str) {
	output.add(str)
    }

    addNewLine(output, str) {
	output.addNewLine(str)
    }

    findOwner() {
	if (this.parent == undefined) {
	    return this
	}
	return this.parent.findOwner()
    }

    findOwnerMethod() {
	if (this.parent == undefined) {
	    return undefined
	}
	return this.parent.findOwnerMethod()
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

    addModule(module) {
	if (this.parent != undefined) {
	    this.parent.addModule(module)
	} else {
	    throw "No object is found for our module to add"
	}
    }

    letOrConstBackward(la, stm) {
	if (this.parent == undefined) {
	    return false
	}

	return this.parent.letOrConstBackward(la, this)
    }

    letOrConstForward(la) {
	return false
    }
    
    getContent() {
	if (this.content != undefined) {
	    return this.content
	}
	
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
		//
		if (start == undefined &&
		    line == loc.startLine &&
		    col == loc.startCol) {

		    start = i

		}

		// Searching for the end
		//
		if (line == loc.endLine &&
		    col == loc.endCol - 1) {
		    
		    // Before returning, check if it occupies a whole line
		    //
		    if (this.wholeLine == undefined) {
			loop:
			for (let j = i + 1; j < source.length; ++j) {
			    switch (source[j]) {
			    case ' ':
			    case '\t':
			    case '\r':
				break
			    case '\n':
				this.wholeLine = true
				break loop
			    default:
				this.wholeLine = false
				break loop
			    }
			}
		    }

		    if (this.wholeLine == undefined) {
			this.wholeLine = true
		    }

		    this.content = source.slice(start, i + 1)
		    return this.content
		}
		col++
	    }

	    // If we encounter any char before the start...
	    //
	    if (start == undefined &&
		line == loc.startLine &&
		col < loc.startCol) {

		switch (source[i]) {
		case ' ':
		case '\t':
		case '\r':
		case '\n':
		    break
		default:
		    this.wholeLine = false
		    break
		}
	    }
	} // for whole source code

	if (this.wholeLine == undefined) {
	    this.wholeLine = true
	}
	
	this.content = source.slice(start)
	return this.content
    }

    isWholeLine() {
	if (this.wholeLine == undefined) {
	    this.getContent()
	}

	return this.wholeLine
    }
}
