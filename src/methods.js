import {resolveNode} from './node'
import {Artifact, Program} from './program'
import {symbol, Literal} from './literal'
import {Class, Module} from './classes'
import {Return} from './statements'
import {OpCall} from './operators'

export class FuncCall extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.mid = tree.get(this, startLine, "nd_mid")
	this.args = tree.get(this, startLine, "nd_args")
    }

    convert(output) {
	this.add(output, symbol(this.mid))

	this.add(output, "(")
	if (this.args != undefined && this.args.array.length > 0) {
	    this.add(output, this.args.array[0])
	    for (let i = 1; i < this.args.array.length; ++i) {
		this.add(output, ", ")
		this.add(output, this.args.array[i])
	    }
	}
	this.add(output, ")")
    }
}

export class VarCall extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	this.mid = tree.get(this, startLine, "nd_mid")
    }

    convert(output) {
	this.add(output, symbol(this.mid))
    }
}

export class Call extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	this.mid = tree.get(this, startLine, "nd_mid")
	this.recv = tree.get(this, startLine, "nd_recv")
	this.args = tree.get(this, startLine, "nd_args")
    }

    convert(output) {
	this.add(output, this.recv)
	this.add(output, " ")
	this.add(output, this.mid)
	this.add(output, " ")
	this.add(output, this.args)
    }
}

export class QCall extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_mid")
	this.name = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_recv")
	line = tree.nextLine(line.indent)
	this.recv = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_args")
	line = tree.nextLine(line.indent)
	this.args = resolveNode(this, tree, line)
    }
}

export class Method extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	this.mid = tree.get(this, startLine, "nd_mid")
	this.defn = tree.get(this, startLine, "nd_defn")

	this.defn.body = this.defn.body.returnize(tree)
    }

    convert(output) {
	const owner = this.findOwner()
	if (owner instanceof Program) {
	    this.add(output, "function ")
	} else if (owner instanceof Module) {
	    this.add(output, owner.name)
	    this.add(output, ".")
	}
	
	let mid = symbol(this.mid)
	if (mid == "initialize") {
	    mid = "constructor"
	}
	this.add(output, mid)

	// From now on, we'll use defn's internal parts
	// (defn is Scope, by the way)
	//
	this.add(output, "(")
	this.defn.convertArgs(output) // See Scope.convertArgs()
	this.add(output, ") {")
	output.addLine()

	this.add(output, this.defn.body)
	
	output.addLine()
	this.add(output, "}")
    }
}

export class ClassMethod extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_recv")
	line = tree.nextLine(line.indent)
	this.recv = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_mid")
	this.name = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_defn")
	line = tree.nextLine(line.indent)
	this.args = resolveNode(this, tree, line)
    }
}

export class Lambda extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)
    }
}

export class OptionalArgument extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_next")
	line = tree.nextLine(line.indent)
	this.next = resolveNode(this, tree, line)
    }
}

export class KeywordArgument extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_next")
	line = tree.nextLine(line.indent)
	this.next = resolveNode(this, tree, line)
    }
}

export class Undefine extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_undef")
	line = tree.nextLine(line.indent)
	this.undef = resolveNode(this, tree, line)
    }
}

export class ArgsPush extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.head = tree.get(this, startLine, "nd_head")
	this.body = tree.get(this, startLine, "nd_body")
    }
}

export class ArgsCat extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.head = tree.get(this, startLine, "nd_head")
	this.body = tree.get(this, startLine, "nd_body")
    }
}

export class PostArg extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.head = tree.get(this, startLine, "nd_1st")
	this.body = tree.get(this, startLine, "nd_2nd")
    }
}
