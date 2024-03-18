import {Artifact} from './artifact'
import {SourceMapGenerator} from 'source-map'

export class Output {
    constructor(filename, source) {
	this.text = ""
	this.line = 0
	this.col = 0
	this.varMon = 0; // Monotonously increasing variable  id
	this.curIndent = 0

	if (filename != undefined) {
	    this.filename = filename
	    this.sourceMapGen = new SourceMapGenerator({
		file: filename
	    })
	    this.sourceMapGen.setSourceContent(filename, source)
	}
    }

    indent() {
	this.curIndent += 2
	this.addLine()
    }

    unindent() {
	this.curIndent -= 2
	if (this.curIndent < 0) {
	    console.trace()
	    throw "Indent is negative " + this.curIndent
	}
	if (this.col != 0) {
	    this.addLine()
	}
    }

    addLine() {
	this.text += "\n"
	this.line++
	this.col = 0
    }

    addNewLine(str) {
	if (this.col != 0) {
	    this.addLine()
	}
	this.add(str)
    }

    add(str) {
	if (str == undefined) {
	    console.warn("Trying to add undefined string")
	    throw "Trying to add undefined string"
	}
	
	if (str instanceof Artifact) {
	    str.convert(this)
	    this.addToSourceMap(artifact)
	    return
	}
	if ("string" != typeof str) {
	    throw "Trying to add " + str.constructor.name
	}
	if (this.col == 0 && this.curIndent > 0) {
	    for (let i = 0; i < this.curIndent; ++i) {
		this.text += " "
	    }
	}
	this.text += str
	this.col += str.length
    }

    addToSourceMap(artifact) {
	if (this.sourceMapGen == undefined) {
	    return // We don't generate source map
	}

	this.sourceMapGen.addMapping({
	    generated: {
		line: this.line + 1,
		column: this.col
	    },
	    source: this.filename,
	    original: {
		line: artifact.location.startLine,
		column: artifact.location.startCol
	    }
	})
    }

    get sourceMap() {
	return this.sourceMapGen.toString()
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
