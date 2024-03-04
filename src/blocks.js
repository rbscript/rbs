import {Artifact} from './artifact'
import {resolveNode} from './node'
import {Return} from './statements'
import {symbol} from './literal'
import {LocalAssignment} from './variables'

export class Scope extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.tbl = tree.get(this, startLine, "nd_tbl")
	this.args = tree.get(this, startLine, "nd_args")
	this.body = tree.get(this, startLine, "nd_body")

	// Analyze parameters and local variables
	//
	const symbols = this.tbl.split(',')

	this.vars = []
	this.params = []
	this.kwParams = {}

	let index = 0
	if (this.args != undefined) {
	    
	    for (let i = 0; i < this.args.preArgsNum; ++i, ++index) {
		this.params.push(symbols[index])
	    }

	    if (this.args.optArgs != undefined) {
		let pa = this.args.optArgs
		while (pa != undefined) {
		    this.params.push(symbols[index])
		    index++
		    pa = pa.next
		}
	    }

	    if (this.args.kwArgs != undefined) {
		let ka = this.args.kwArgs
		while (ka != undefined) {
		    this.params.push(symbols[index])
		    index++

		    this.kwParams[symbols[index]] = ka.body.value
		    ka = ka.next
		}
	    }
	    
	    // Rest are local variables
	    for (let i = index; i < symbols.length; ++i, ++index) {
		this.vars.push(symbols[i])
	    }
	} else {
	    // If no args is explicitly specified, 
	    // then all symbols are vars. Example: do |;a|
	    this.vars = symbols
	}
    }

    letOrConstForward(la) {
	if (this.body == undefined) {
	    return false
	}
	return this.body.letOrConstForward(la)
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

	// Possible if used as do |;a|
	if (this.args == undefined) {
	    return
	}

	const args = this.tbl.split(',')
	let count = this.args.preArgsNum
	for (let i = 0; i < count; ++i) {
	    if (i > 0) {
		this.add(output, ", ")
	    }

	    if (args[i] != ":_") {
		this.add(output, symbol(args[i]))
	    } else {
		this.add(output, output.genVar("_"))
	    }
	}

	if (this.args.optArgs != undefined) {
	    if (count > 0) {
		this.add(output, ", ")
	    }
	    
	    let oa = this.args.optArgs
	    while (oa != undefined) {
		this.add(output, symbol(oa.body.vid))
		this.add(output, " = ")
		this.add(output, oa.body.value)

		oa = oa.next
		if (oa != undefined) {
		    this.add(output, ", ")
		}
	    }
	}

	if (this.args.kwArgs != undefined) {
	    if (count > 0) {
		this.add(output, ", ")
	    }
	    count++

	    this.add(output, "{")
	    let anyValue = false
	    let ka = this.args.kwArgs
	    while (ka != undefined) {
		this.add(output, symbol(ka.body.vid))
		if (typeof ka.body.value != "string" || 
		    !ka.body.value.startsWith("NODE_SPECIAL_REQUIRED_KEYWORD")) {
		    this.add(output, " = ")
		    this.add(output, ka.body.value)
		    anyValue = true
		}
		ka = ka.next
		if (ka != undefined) {
		    this.add(output, ", ")
		}
	    }
	    this.add(output, "}")
	    if (!anyValue) {
		this.add(output, " = {}")
	    }
	}

	if (this.args.kwRestArg != undefined &&
	    this.args.kwRestArg.vid != "(null)") {
	    if (count > 0) {
		this.add(output, ", ")
	    }
	    count++

	    this.add(output, "...")
	    this.add(output, this.args.kwRestArg)
	}

	if (this.args.blockArg != undefined &&
	    this.args.blockArg != "(null)") {
	    if (count > 0) {
		this.add(output, ", ")
	    }
	    this.add(output, symbol(this.args.blockArg))
	}
    }

    hasParam(symbol) {
	return this.params.includes(symbol)
    }

    hasVar(symbol) {
	return this.vars.includes(symbol)
    }

    returnizeForBreak(tree) {
	if (this.body instanceof Block) {
	    this.body = this.body.returnizeForBreak(tree)
	}
	return this
    }
}

export class Block extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.statements = []
	while (true) {
	    let line = tree.nextLine(startLine.indent) // expecting "attr", "nd_head")
	    if (line == undefined) {
		break
	    }
	    line = tree.nextLine(line.indent)

	    const stm = resolveNode(this, tree, line)
	    if (stm == undefined) {
		break
	    }

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

    returnizeForBreak(tree) {
	// Beware: This work for only 1 level. If there is another
	//         break in a loop, it won't be counted as a return
	for (let i = 0; i < this.statements.length; ++i) {
	    this.statements[i] = this.statements[i].returnize(tree)
	}
	return this
    }

    isReturn() {
	return this.statements[this.statements.length - 1].isReturn()
    }

    letOrConstBackward(la, stm) {
	const index = this.statements.indexOf(stm)
	if (index == -1) {
	    throw "Invalid statement " + stm + " in " + this
	}
	
	for (let i = index - 1; i >= 0; --i) {
	    if (this.statements[i] instanceof LocalAssignment) {
		if (this.statements[i].vid == la.vid) {
		    return true
		}
	    }
	}
	
	return this.parent.letOrConstBackward(la, this)
    }

    letOrConstForward(la) {
	const index = (la.parent == this ? this.statements.indexOf(la) : -1)
	for (let i = index + 1; i < this.statements.length; ++i) {
	    if (this.statements[i].letOrConstForward(la)) {
		return true
	    }
	}
	return false
    }
}

export class Body extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
	
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


export class Yield extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
	this.head = tree.get(this, startLine, "nd_head")

	const defn = this.findOwnerMethod()
	if (defn == undefined) {
	    throw "Yield statement should be in a method"
	}

	defn.generator = true
    }

    convert(output) {
	this.addNewLine(output, "yield ")
	if (this.head != undefined && this.head.array.length > 0) {
	    this.add(output, this.head.array[0])
	    for (let i = 1; i < this.head.array.length; ++i) {
		this.add(output, ", ")
		this.add(output, this.head.array[i])
	    }
	}
    }
}

export class BlockPass extends Artifact {
    constructor(parent, tree, startLine) {
	
	super(parent, tree, startLine)

	const indent = startLine.indent 
	
	let line = tree.nextLine(indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(this, tree, line)

	line = tree.nextLine(indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)
    }
}
