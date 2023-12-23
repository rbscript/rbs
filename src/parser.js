import {resolveNode} from './node'
import {spawnSync} from 'node:child_process'
import {Program} from './classes'
import {buffer} from 'node:buffer'

export function parse(source, dump) {
    const p = spawnSync('ruby', ["--dump=parsetree"], {
	input: source,
	maxBuffer: 8 * 1024 * 1024
    })

    const stderr = p.stderr.toString()
    if (stderr.length > 0) {
	throw stderr
    }

    const stdout = p.stdout.toString()
    if (dump) {
	log(stdout)
    }

    const tree = new Tree(stdout, source)
    return new Program(tree)
}

function log(str) { // Can print longer messages
    let len = str.length
    if (len < 10000) {
	console.log(str)
    } else {
	const index = str.slice(0, 10000).lastIndexOf("\n")
	console.log(str.slice(0, index + 1))
	log(str.slice(index + 1))
    }
}

export class Tree {
    constructor(source, content) {
	this.source = source
	this.content = content
	this.index = 0
	this.indent = 0
	this.lineno = 0
    }

    nextLine(indent, type, value) { // Parameters are for assertion and optional
	if (this.index == this.source.length) {
	    if (type != undefined) {
		throw "Unexpected end-of-tree while waiting for " + type +
		    (type == "attr" ? " " + value : "") +
		    " lineno=" + this.lineno + " lastNodeType=" + this.lastNodeType
	    }
	    return undefined
	}

	this.lineno++

	let origindex = this.index
	let save = this.index
	let start = undefined
	let spaces = 0
	let pipes = 0
	while (true) {
	    const c = this.source[this.index]
	    if (c == '\n') {
		this.index++
		break
	    }

	    switch (c) {
	    case ' ':
		if (start == undefined) {
		    spaces++
		}
		break
	    case '|':
		pipes++
		break
	    case '@':
	    case '+':
		if (start == undefined) {
		    start = this.index
		}
		break
	    case '(': // Only for (null node)
		if (start == undefined) {
		    start = this.index
		}
		break
	    }
	    
	    this.index++
	    if (this.index == this.source.length) {
		break
	    }
	}

	// When a line does not start with #,
	// then it can be a multiline value
	// An example:
	// #                 |           |       @ NODE_LIT (line: 413, location: (413,26)-(417,6))
	// #                 |           |       +- nd_lit: /
	//      \A
	//      (?<mime_type>[^;\s]+\s*(?:;\s*(?:(?!charset)[^;\s])+)*)?
	//      (?:;\s*charset=(?<quote>"?)(?<charset>[^;\s]+)\k<quote>)?
	//      /x
	// #                 |           +- nd_head (66):

	if (this.source[origindex] != '#') {
	    if (this.lastRetLine != undefined) {
		this.lastRetLine.value += "\n" + this.source.slice(origindex, this.index).trim()
		return this.nextLine(indent, type, value)
	    }
	}

	if (spaces < indent) {
	    this.index = save
	    if (type != undefined) {
		throw "Unexpected end-of-tree at indent " + spaces + " while waiting for " + type +
		    (type == "attr" ? " " + value : "") +
		    " spaces=" + spaces + " indent " + indent + 
		    " lineno=" + this.lineno + " lastNodeType=" + this.lastNodeType
	    }
	    return undefined
	}

	const ret = this.source.slice(start, this.index).trim()
	if (ret.length == 0) {
	    return this.nextLine()
	}
	
	if (ret.startsWith("##")) {
	    return this.nextLine()
	}


	const retLine = new Line(this.lineno, ret, spaces, pipes)
	
	// Assertion
	//
	if (type != undefined) {
	    if (retLine.type != type) {
		throw "Unexpected type " + retLine.type + " instead of " + type +
		    " LINE: " + retLine
	    }

	    switch (retLine.type) {
	    case "attr":
		if (retLine.name != value) {
		    console.trace()
		    throw "Unexpected attr " + retLine.name + " instead of " + value +
			" LINE: " + retLine
		}
		break
	    }
	}

	this.lastRetLine = retLine
	return retLine
    }

    get(parent, startLine, name) {
	let line = this.nextLine(startLine.indent, "attr", name)
	if (line.value != "") {
	    return line.value
	}
	line = this.nextLine(line.indent)
	const ret = resolveNode(parent, this, line)
	if (ret != undefined) {
	    ret.parent = parent
	}
	return ret
    }

    
}

export class Line {
    constructor(no, content, spaces, pipes) {
	this.no = no
	this.content = content
	this.indent = spaces

	this.sign = content.slice(0, 1)
	switch (this.sign) {
	case '@': // @ NODE_FCALL (line: 89, location: (89,2)-(89,23))*
	    const locindex = content.indexOf("(")
	    this.type = content.slice(1, locindex).trim()
	    this.location = new Location(content.slice(locindex))
	    break
	case '+': // +- nd_mid: :autoload
	    const index = content.indexOf(":")
	    this.name = content.slice(3, index)
	    if (this.name.endsWith(")")) { // nd_head (1)
		this.name = this.name.slice(0, this.name.lastIndexOf("(") - 1)
	    }
	    this.value = content.slice(index + 2).trim()
	    this.type = "attr"
	    break
	default:
	    if (content == "(null node)") {
		this.type = "(null node)"
	    } else {
		throw "Unexpected content " + content + " lineno=" + this.no +
		    " lastNodeType=" + this.lastNodeType
	    }
	    break
	}
    }

    toString() {
	return "LINE " + this.no + ": " + this.content
    }
}


export class Location {
    constructor(content) { // (line: 1, location: (1,0)-(494,129))
	let index = content.indexOf("location:")
	let sub = content.slice(index + 11) // 1,0)-(494,129))
	index = sub.indexOf(",")
	this.startLine = parseInt(sub.slice(0, index))

	sub = sub.slice(index + 1) // 0)-(494,129))
	index = sub.indexOf(")")
	this.startCol = parseInt(sub.slice(0, index))

	sub = sub.slice(index + 3) // 494,129))
	index = sub.indexOf(",")
	this.endLine = parseInt(sub.slice(0, index))

	sub = sub.slice(index + 1) // 129))
	index = sub.indexOf(")")
	this.endCol = parseInt(sub.slice(0, index))
    }

    toString() {
	return "(" + this.startLine + ":" + this.startCol + ")"
    }
}


