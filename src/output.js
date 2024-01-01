import {Artifact} from './artifact'

export class Output {
    constructor() {
	this.text = ""
	this.line = 0
	this.col = 0
	this.delta = 0 // see Artifact.alignWith()
	this.varMon = 0; // Monotonously increasing variable  id
    }

    addLine() {
	this.text += "\n"
	this.line++
	this.col = 0
    }

    addNewLine(col, str) {
	if (this.col != 0) {
	    this.addLine()
	}
	this.add(col, str)
    }

    add(col, str) {
	if (str == undefined) {
	    console.warn("Trying to add undefined string")
	    throw "Trying to add undefined string"
	}
	if (str instanceof Artifact) {
	    str.convert(this)
	    return
	}
	if ("string" != typeof str) {
	    throw "Trying to add " + str.constructor.name
	}
	if (this.col == 0) {
	    for (let i = 0; i < col + this.delta; ++i) {
		this.text += " "
	    }
	}
	this.text += str
	this.col += str.length
    }

    toString() {
	return this.text
    }

    genVar(prefix) {
	this.varMon++
	if (prefix != undefined) {
	    return prefix + "__" + this.varMon
	} else {
	    return "var__" + this.varMon
	}
    }
}
