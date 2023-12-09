import {Body} from './blocks'
import {resolveNode} from './node'
import {Artifact} from './artifact'
import {StmWithBlock} from './statements'

export class Ensure extends StmWithBlock {
    constructor(parent, tree, startLine) {
	
	super(parent, tree, startLine)

	this.head = tree.get(this, startLine, "nd_head")
	this.ensr = tree.get(this, startLine, "nd_ensr")
    }

    returnize(tree) {
	this.head = this.head.returnize(tree)
	// Note: We don't returnize ensure block
	//       because it can ruin the return logic in head section
	return this
    }

    findLocalVar(la, search) { // la is a LocalAssignment
	const ret = this.head.findLocalVar(la, search)
	if (ret == 0) {
	    return this.ensr.findLocalVar(la, search)
	}
	return ret
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

export class Rescue extends StmWithBlock {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.head = tree.get(this, startLine, "nd_head")
	this.resq = tree.get(this, startLine, "nd_resq")
	this.els = tree.get(this, startLine, "nd_else")
    }

    findLocalVar(la, search) { // la is a LocalAssignment
	let ret = this.head.findLocalVar(la, search)
	if (ret == 0) {
	    ret = this.resq.findLocalVar(la, search)
	    if (ret == 0 && this.els != undefined) {
		ret = this.els.findLocalVar(la, search)
	    }
	}
	return ret
    }
    
    returnize(tree) {
	this.head = this.head.returnize(tree)
	this.resq = this.resq.returnize(tree)
	if (this.els != undefined) {
	    this.els = this.els.returnize(tree)
	}
	return this
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

export class RescueBody extends StmWithBlock {
    constructor(parent, tree, startLine) {
	
	super(parent, tree, startLine)

	this.args = tree.get(this, startLine, "nd_args")
	this.body = tree.get(this, startLine, "nd_body")
	this.head = tree.get(this, startLine, "nd_head")
    }

    returnize(tree) {
	if (this.head != undefined) {
	    this.head = this.head.returnize(tree)
	}
	this.body = this.body.returnize(tree)
	return this
    }

    findLocalVar(la, search) { // la is a LocalAssignment
	const ret = this.body.findLocalVar(la, search)
	if (ret == 0 && this.head != undefined) {
	    return this.head.findLocalVar(la, search)
	}
	return ret
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
