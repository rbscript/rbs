import {Artifact} from './program'

export class Output {
    constructor() {
	this.text = ""
	this.line = 0
	this.col = 0
    }

    line() {
	this.text += "\n"
	this.line++
	this.col = 0
    }

    add(col, str) {
	if (str == undefined) {
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
	    for (let i = 0; i < col; ++i) {
		this.text += " "
	    }
	}
	this.text += str
	this.col += str.length
    }

    toString() {
	return this.text
    }
}
