import {Artifact} from './artifact'
import {resolveNode} from './node'
import {Return} from './statements'
import {symbol} from './literal'
import {LocalAssignment} from './variables'

export class Scope extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.tbl = tree.get(this, startLine, "nd_tbl")
	this.args = tree.get(this, startLine, "nd_args")
	this.body = tree.get(this, startLine, "nd_body")
    }

    convert(output) {
	this.add(output, this.body)
    }

    convertArgs(output) {
	// Why this method?
	// Because args are defined  in nd_tbl but inits are defined in elsewhere, etc

	if (this.tbl == "(empty)") {
	    return
	}

	const args = this.tbl.split(',')
	const count = this.args.preArgsNum
	for (let i = 0; i < count; ++i) {
	    if (i > 0) {
		this.add(output, ", ")
	    }
	    this.add(output, symbol(args[i]))
	}
    }
}

export class Block extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.statements = []
	while (true) {
	    let line = tree.nextLine(startLine.indent) // expecting "attr", "nd_head")
	    if (line == undefined) {
		break
	    }
	    line = tree.nextLine(line.indent)

	    const stm = resolveNode(this, tree, line)
	    stm.parent = this
	    this.statements.push(stm)
	}
    }

    convert(output) {
	// The responsibility of putting { and } belongs to the parent
	//
	for (const stm of this.statements) {
	    this.addNewLine(output, stm)
	}
    }

    returnize(tree) {
	const i = this.statements.length - 1
	this.statements[i] = this.statements[i].returnize(tree)
	return this
    }

    isReturn() {
	return this.statements[this.statements.length - 1].isReturn()
    }

    // Returns -1 if found before, +1 after, and 0 if not found
    findLocalVar(la, search) { // la == LocalAssignment
	let index = this.statements.length - 1
	if (search) {
	    index = this.statements.indexOf(la)
	}
	
	// Search backwards for -1
	//
	for (let i = index - 1; i >= 0; --i) {
	    const stm = this.statements[i]
	    if (stm instanceof LocalAssignment) {
		if (stm.vid == la.vid) {
		    return -1
		}
	    }
	}

	// Search parent blocks
	//
	let block = this.parent
	while (block != undefined) {
	    if (block instanceof Block) {
		const ret = block.findLocalVar(la, false)
		if (ret != 0) {
		    return -1
		}
	    }
	    block = block.parent
	}

	if (search) {
	    // Search forward
	    //
	    for (let i = index + 1; i < this.statements.length; ++i) {
		const stm = this.statements[i]
		if (stm instanceof LocalAssignment) {
		    if (stm.vid == la.vid) {
			return 1
		    }
		} else if (stm.hasLocalVar != undefined) {
		    if (stm.hasLocalVar(la)) {
			return 1
		    }
		}
	    }
	}

	return 0
    }
}

export class Body extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	this.children = []
	
	let line = tree.nextLine()
	const indent = line.indent
	do {
	    let nev = resolveNode(this, tree, line)
	    if (nev == undefined) {
		return
	    }
	    this.children.push(nev)
	    
	} while (line = tree.nextLine(indent))
    }
}


export class Begin extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	this.body = tree.get(this, startLine, "nd_body")
    }

    convert(output) {
	if (this.body != undefined) {
	    this.body.convert(output)
	}
    }
}

export class Yield extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(this, tree, line)
    }
}

export class Iter extends Artifact {
    constructor(parent, tree, startLine) {
	
	super(parent, startLine)

	this.iter = tree.get(this, startLine, "nd_iter")
	this.body = tree.get(this, startLine, "nd_body")
    }
}

export class BlockPass extends Artifact {
    constructor(parent, tree, startLine) {
	
	super(parent, startLine)

	const indent = startLine.indent 
	
	let line = tree.nextLine(indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(this, tree, line)

	line = tree.nextLine(indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)
    }
}
