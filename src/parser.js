import {spawnSync} from 'node:child_process'
import {Program} from './program'

export function parse(source) {
    const p = spawnSync('ruby', ["--dump=parsetree"], {
	input: source
    })

    const tree = new Tree(p.stdout.toString())
    return new Program(tree)
}

export class Tree {
    constructor(source) {
	this.source = source
	this.index = 0
	this.indent = 0
    }

    nextLine(indent, type, value) { // Parameters are for assertion and optional
	if (this.index == this.source.length) {
	    if (type != undefined) {
		throw "Unexpected end-of-tree while waiting for " + type
	    }
	    return undefined
	}

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

	if (spaces < indent) {
	    this.index = save
	    if (type != undefined) {
		throw "Unexpected end-of-tree at indent " + spaces + " while waiting for " + type
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

	const retLine = new Line(ret, spaces, pipes)
	
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
		    throw "Unexpected attr " + retLine.name + " instead of " + value +
			" LINE: " + retLine
		}
		break
	    }
	}

	return retLine
    }

    
}

export class Line {
    constructor(content, spaces, pipes) {
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
	    this.value = content.slice(index + 2).trim()
	    this.type = "attr"
	    break
	default:
	    if (content == "(null node)") {
		this.type = "(null node)"
	    } else {
		throw "Unexpected content " + content
	    }
	    break
	}
    }

    toString() {
	return this.content
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
}


