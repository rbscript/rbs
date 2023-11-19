import {Artifact} from './program'
import {Body} from './body'
import {resolveNode} from './node'
import {Return} from './statements'
import {symbol} from './literal'

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
