import {Body} from './blocks'
import {resolveNode} from './node'
import {Artifact} from './artifact'

export class Ensure extends Artifact {
    constructor(parent, tree, startLine) {
	
	super(parent, startLine)

	this.head = tree.get(this, startLine, "nd_head")
	this.ensr = tree.get(this, startLine, "nd_ensr")
    }

    convert(output) {

	// Note: Aligns are ugly here because
	//         columns are incorrectly specified except for head and ensr blocks
	
	this.alignWith(output, this.head, this.parent)
	this.add(output, "try {")
	this.unalign(output, this.head, this.parent)
	
	this.addNewLine(output, this.head)

	this.alignWith(output, this.head, this.parent)
	this.addNewLine(output, "} finally {")
	this.unalign(output, this.head, this.parent)
	
	this.addNewLine(output, this.ensr)

	this.alignWith(output, this.head, this.parent)
	this.addNewLine(output, "}")
	this.unalign(output, this.head, this.parent)
    }
}

export class Rescue extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.head = tree.get(this, startLine, "nd_head")
	this.resq = tree.get(this, startLine, "nd_resq")
	this.els = tree.get(this, startLine, "nd_else")
    }

    convert(output) {

	this.alignWith(output, this.head, this.resq)
	this.add(output, "try {")
	this.unalign(output, this.head, this.resq)
	
	this.addNewLine(output, this.head)
	
	this.addNewLine(output, this.resq)

	if (this.els != undefined) {
	    this.add(output, this.els)
	}
    }
}

export class RescueBody extends Artifact {
    constructor(parent, tree, startLine) {
	
	super(parent, startLine)

	this.args = tree.get(this, startLine, "nd_args")
	this.body = tree.get(this, startLine, "nd_body")
	this.head = tree.get(this, startLine, "nd_head")
    }

    convert(output) {
	this.add(output, "} catch ")
	if (this.args != undefined) {

	}
	this.add(output, "{")

	this.addNewLine(output, this.body)
	this.addNewLine(output, "}")
    }
}

export class Retry extends Artifact {
    constructor(parent, tree, startLine) {
	
	super(parent, startLine)
    }
}

export class ErrInfo extends Artifact {
    constructor(parent, tree, startLine) {
	
	super(parent, startLine)
    }
}
