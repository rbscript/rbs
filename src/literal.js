import {Artifact} from './program'
import {Return} from './statements'

const reAlphaChar = /[a-zA-Z_]/

export function symbol(str) {
    let text

    // First, clear :symbol
    if (str instanceof Literal) {
	if (str.lit.startsWith(":")) {
	    text = str.lit.slice(1)
	} else {
	    text = str.lit
	}
    } else {
	if (str.startsWith(":")) {
	    text = str.slice(1)
	} else {
	    text = str
	}
    }

    // Convert from first_name to firstName
    //
    let flag = false
    let newtext = ""
    for (let i = 0; i < text.length; ++i) {
	const c = text[i]

	if (flag) {
	    flag = false
	    if (c.match(reAlphaChar)) {
		newtext += c.toUpperCase()
		continue
	    }
	}

	if (c == '_') {
	    flag = true
	    continue
	}

	newtext += c
    }
    text = newtext

    // Handle converted? or just_do_it!
    if (text.endsWith("?")) {
	text = text.slice(0, -1) + "Q"
    } else if (text.endsWith("!")) {
	text = text.slice(0, -1) + "X"
    }

    return text
}

export class Literal extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	this.lit = tree.get(this, startLine, "nd_lit")
    }

    convert(output) {
	if (this.lit.startsWith(":")) { // Tolerance for :symbol
	    this.add(output, this.lit.slice(1))
	} else {
	    this.add(output, this.lit)
	}
    }

    returnize(tree) {
	return Return.ize(tree, this)
    }
}

export class DynamicSymbol extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.lit = tree.get(this, startLine, "nd_lit")
	this.head = tree.get(this, startLine, "nd_next->nd_head")
	this.next = tree.get(this, startLine, "nd_next->nd_next")
    }
}
