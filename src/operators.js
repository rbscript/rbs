import {resolveNode} from './node'
import {Artifact} from './artifact'
import {Return} from './statements'
import {symbol} from './literal'
import {Range} from './lists'

export class Call extends Artifact {
    constructor(parent, tree, startLine, q) {
	super(parent, tree, startLine)

	this.mid = tree.get(this, startLine, "nd_mid")
	this.recv = tree.get(this, startLine, "nd_recv")
	this.args = tree.get(this, startLine, "nd_args")
	this.q = q
    }

    convert(output, withDo) {

	if (this.mid == ":new") {
	    this.add(output, "new ")
	    this.add(output, this.recv)
	} else if (this.mid == ":[]") {
	    return this.convertArray(output)
	} else {
	    this.add(output, this.recv)
	    if (this.q) {
		this.add(output, "?")
	    }
	    this.add(output, ".")
	    this.add(output, symbol(this.mid.slice(1))) // ops are like :+
	}

	// Check if we need to put paranthesis
	//
	if (this.args == undefined && this.mid != ":new") {

	    // The problem here is,
	    // having no difference between a.b.c and a.b().c via the parsetree
	    // so we have to return to original source to distinguish among them

	    const content = this.getContent()
	    if (!content.endsWith(")")) {

		// We don't need paranthesis here
		//
		return
	    }
	}
	
	this.add(output, "(")
	this.convertArgs(output, withDo)
	if (!withDo) {
	    // Common case
	    //
	    this.add(output, ")")
	}
    }

    convertArgs(output, withDo) {
	if (this.args != undefined && this.args.array.length > 0) {
	    this.add(output, this.args.array[0])
	    for (let i = 1; i < this.args.array.length; ++i) {
		this.add(output, ", ")
		this.add(output, this.args.array[i])
	    }
	    
	    if (withDo) {
		this.add(output, ", ")
	    }
	}
    }

    convertArray(output) {
	this.add(output, this.recv)

	if (this.args.array[0] instanceof Range) {
	    this.add(output, ".slice(")
	    this.args.array[0].convertBare(output)
	    this.add(output, ")")
	} else {
	    // Common case
	    //
	    this.add(output, "[")
	    this.convertArgs(output, false)
	    this.add(output, "]")
	}
    }

    returnize(tree) {
	return Return.ize(tree, this)
    }
}

export class OpCall extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.mid = tree.get(this, startLine, "nd_mid")
	this.recv = tree.get(this, startLine, "nd_recv")
	this.args = tree.get(this, startLine, "nd_args")
    }

    convert(output) {

	if (this.recv instanceof OpCall) {
	    this.add(output, "(")
	    this.add(output, this.recv)
	    this.add(output, ")")
	} else if (this.mid == ":<=>") {
	    return this.convertComparisonOp(output)
	} else {
	    this.add(output, this.recv)
	}

	this.add(output, " ")
	this.add(output, this.mid.slice(1)) // ops are like :+
	this.add(output, " ")
	
	this.add(output, this.args.array[0])
	if (this.args.array.length > 1) {
	    for (let i = 1; i < this.args.array.length; ++i) {
		this.add(output, " ")
		this.add(output, this.mid.slice(1))
		this.add(output, " ")
		this.add(output, this.args.array[i])
	    }
	}
    }

    // <=>
    convertComparisonOp(output) {
	const cmp0 = output.genVar("cmp")
	const cmp1 = output.genVar("cmp")

	this.add(output, "((")
	this.add(output, cmp0)
	this.add(output, ", ")
	this.add(output, cmp1)
	this.add(output, ") => {")

	this.addNewLine(output, "if (");
	this.add(output, cmp0)
	this.add(output, " == ")
	this.add(output, cmp1)
	this.add(output, ") return 0")

	this.addNewLine(output, "if (");
	this.add(output, cmp0)
	this.add(output, " > ")
	this.add(output, cmp1)
	this.add(output, ") return -1 else return 1")

	this.addNewLine(output, "})(")
	this.add(output, this.recv)
	this.add(output, ", ")
	this.add(output, this.args.array[0])

	if (this.args.array.length > 1) {
	    for (let i = 1; i < this.args.array.length; ++i) {
		this.add(output, " ")
		this.add(output, this.mid.slice(1))
		this.add(output, " ")
		this.add(output, this.args.array[i])
	    }
	}
	
	this.add(output, ")")

    }
    
    returnize(tree) {
	return Return.ize(tree, this)
    }
}

export class OpAnd extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_1st")
	line = tree.nextLine(line.indent)
	this.firsts = [resolveNode(this, tree, line)]

	// There may be more 1sts
	while (true) {
	    line = tree.nextLine(startLine.indent)
	    if (line.name == "nd_2nd") {
		break
	    }

	    line = tree.nextLine(line.indent)
	    this.firsts.push(resolveNode(this, tree, line))
	}
	
	// Add the nd_2nd and finish
	line = tree.nextLine(line.indent)
	this.second = resolveNode(this, tree, line)
    }
}

export class OpOr extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_1st")
	line = tree.nextLine(line.indent)
	this.firsts = [resolveNode(this, tree, line)]

	// There may be more 1sts
	while (true) {
	    line = tree.nextLine(startLine.indent)
	    if (line.name == "nd_2nd") {
		break
	    }

	    line = tree.nextLine(line.indent)
	    this.firsts.push(resolveNode(this, tree, line))
	}
	
	// Add the nd_2nd and finish
	line = tree.nextLine(line.indent)
	this.second = resolveNode(this, tree, line)
    }
}

export class AssignAnd extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_value")
	line = tree.nextLine(line.indent)
	this.value = resolveNode(this, tree, line)
    }
}

export class OpAssignAnd extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_value")
	line = tree.nextLine(line.indent)
	this.value = resolveNode(this, tree, line)
    }
}


export class AssignOr extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_value")
	line = tree.nextLine(line.indent)
	this.value = resolveNode(this, tree, line)
    }
}


export class OpAssignOr extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_value")
	line = tree.nextLine(line.indent)
	this.value = resolveNode(this, tree, line)
    }
}

export class OpAssign1 extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.recv = tree.get(this, startLine, "nd_recv")
	this.mid = tree.get(this, startLine, "nd_mid")
	this.head = tree.get(this, startLine, "nd_args->nd_head")
	this.body = tree.get(this, startLine, "nd_args->nd_body")
    }
}

export class OpAssign2 extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.recv = tree.get(this, startLine, "nd_recv")
	this.vid = tree.get(this, startLine, "nd_next->nd_vid")
	this.mid = tree.get(this, startLine, "nd_next->nd_mid")
	this.value = tree.get(this, startLine, "nd_value")
    }
}


export class Defined extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.head = tree.get(this, startLine, "nd_head")
    }
}
