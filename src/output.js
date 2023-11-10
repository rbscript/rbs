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
	if (this.col != 0) {
	    this.text += " "
	    this.col++
	} else {
	    for (let i = 0; i < col; ++i) {
		this.text += " "
	    }
	}
	this.text += str
    }
}
