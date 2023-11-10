import {resolveNode} from './node'
import {Artifact} from './program'

export class FuncCall extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	
	let line = tree.nextLine(startLine.indent, "attr", "nd_mid")
	this.name = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_args")
	line = tree.nextLine(line.indent)
	this.args = resolveNode(this, tree, line)
    }
}

export class VarCall extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	this.mid = tree.get(parent, startLine, "nd_mid")
    }

    convert(output) {
	this.add(output, this.mid.slice(1)) // a symbol starting with :
    }
}

export class Call extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	this.mid = tree.get(this, startLine, "nd_mid")
	this.recv = tree.get(this, startLine, "nd_recv")
	this.args = tree.get(this, startLine, "nd_args")
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
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_mid")
	this.name = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_defn")
	line = tree.nextLine(line.indent)
	this.args = resolveNode(this, tree, line)
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
