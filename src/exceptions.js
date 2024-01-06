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

	this.addNewLine(output, "try {")
	output.indent()
	this.addNewLine(output, this.head)
	output.unindent()

	this.addNewLine(output, "} finally {")
	output.indent()
	this.addNewLine(output, this.ensr)
	output.unindent()
	this.addNewLine(output, "}")
    }
}

export class Rescue extends StmWithBlock {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.head = tree.get(this, startLine, "nd_head")
	this.resq = tree.get(this, startLine, "nd_resq")
	this.els = tree.get(this, startLine, "nd_else")

	this.exvar = undefined

	if (this.asExpr()) {
	    this.returnize(tree)
	}
    }

    asExpr() {
	if (!super.asExpr()) {
	    return false
	}
	if (this.parent instanceof Ensure) {
	    return false
	}
	return true
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

	if (this.asExpr()) {
	    this.functionize1(output)
	}
	
	let elsvar
	if (this.els != undefined) {
	    elsvar = output.genVar("els")
	    this.addNewLine(output, "let ")
	    this.add(output, elsvar)
	    this.add(output, " = false")
	}
	
	
	this.addNewLine(output, "try {")

	output.indent()
	this.addNewLine(output, this.head)

	if (this.els != undefined) {
	    this.addNewLine(output, elsvar)
	    this.add(output, " = true")
	}
	output.unindent()
	
	// Only rescue without a parameter
	//
	if (this.resq.args == undefined) {
	    this.addNewLine(output, "} catch {")

	    output.indent()
	    this.addNewLine(output, this.resq.body)
	    output.unindent()

	    this.addNewLine(output, "}")

	} else {
	    // Rescue with typed arguments etc
	    //

	    // catch clause
	    this.addNewLine(output, "} catch (")
	    this.exvar = output.genVar("e")
	    this.add(output, this.exvar)
	    this.add(output, ") {")

	    // Now the bodies
	    //
	    output.indent()
	    let rescue = this.resq
	    let first = true
	    while (rescue != undefined) {
		if (rescue.args != undefined) {
		    if (first) {
			this.addNewLine(output, "if (")
			first = false
		    } else {
			this.addNewLine(output, "} else if (")
		    }

		    const tayp = rescue.args.array[0]
		    this.add(output, this.exvar)
		    this.add(output, " instanceof ")
		    this.add(output, tayp)
		    this.add(output, ") {")
		} else {
		    this.addNewLine(output, "} else {")
		}

		output.indent()
		this.addNewLine(output, rescue.body)
		output.unindent()

		if (rescue.args == undefined) { // Close the else
		    this.addNewLine(output, "}")
		}
		
		rescue = rescue.head
	    }

	    output.unindent()
	    this.addNewLine(output, "}")
	}
	
	if (this.els != undefined) {
	    this.addNewLine(output, "if (")
	    this.add(output, elsvar)
	    this.add(output, ") {")

	    output.indent()
	    this.addNewLine(output, this.els)
	    output.unindent()
	    this.addNewLine(output, "}")
	}

	if (this.asExpr()) {
	    this.functionize2(output)
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
}

export class Retry extends Artifact {
    constructor(parent, tree, startLine) {
	
	super(parent, tree, startLine)
    }
}

export class ErrInfo extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
    }

    convert(output) {
	let parent = this.parent
	while (parent != undefined) {
	    if (parent instanceof Rescue) {
		this.add(output, parent.exvar)
		return
	    }
	    parent = parent.parent
	}

	throw "Unexpected"
    }
}
