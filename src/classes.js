import {resolveNode} from './node'
import {Artifact} from './program'
import {symbol} from './literal'

export class Class extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.cpath  = tree.get(this, startLine, "nd_cpath")
	this.supper  = tree.get(this, startLine, "nd_super")
	this.body  = tree.get(this, startLine, "nd_body")
    }

    convert(output) {
	this.add(output, "class ")
	this.add(output, this.cpath)
	if (this.supper != undefined) {
	    this.add(output, " extends ")
	    this.add(output, this.supper)
	}
	this.add(output, " {")
	output.addLine()

	this.add(output, this.body)

	this.add(output, "}")
    }

    findOwner() {
	return this
    }
}

export class Self extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
    }
}

export class Singleton extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_recv")
	line = tree.nextLine(line.indent)
	this.recv = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)
    }
}

export class Module extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_cpath")
	line = tree.nextLine(line.indent)
	this.cpath  = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)
    }

    findOwner() {
	return this
    }
}

export class Colon2 extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.mid = tree.get(this, startLine, "nd_mid")
	this.head = tree.get(this, startLine, "nd_head")
    }

    convert(output) {
	if (this.head != undefined) {
	    this.add(output, symbol(this.head))
	    this.add(output, "::")
	}
	this.add(output, symbol(this.mid))
    }
}

// ::Z
export class Colon3 extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_mid")
	this.mid = line.value
    }
}

export class Super extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_args")
	line = tree.nextLine(line.indent)
	this.args  = resolveNode(this, tree, line)
    }
}

export class ZSuper extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
    }
}

