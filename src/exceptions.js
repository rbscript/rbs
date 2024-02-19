import {resolveNode} from './node'
import {symbol} from './literal'
import {Artifact} from './artifact'
import {StmWithBlock} from './statements'
import {Block} from './blocks'
import {LocalAssignment} from './variables'


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

    letOrConstForward(la) {
	if (this.head.letOrConstForward(la)) {
	    return true
	}
	return this.ensr.letOrConstForward(la)
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

    letOrConstForward(la) {
	if (this.head.letOrConstForward(la)) {
	    return true
	}
	if (this.resq.letOrConstForward(la)) {
	    return true
	}
	if (this.els != undefined) {
	    return this.els.letOrConstForward(la)
	}
	return false
    }

    returnize(tree) {
	if (this.els != undefined) {
	    this.els = this.els.returnize(tree)
	} else {
	    if (this.head != undefined) {
		this.head = this.head.returnize(tree)
	    }
	}

	if (this.resq != undefined) {
	    this.resq = this.resq.returnize(tree)
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
	if (this.head != undefined) {
	    this.addNewLine(output, this.head)
	}

	if (this.els != undefined) {
	    this.addNewLine(output, elsvar)
	    this.add(output, " = true")
	}
	output.unindent()
	
	// Only rescue without a parameter
	//
	if (this.resq.args == undefined) {
	    const exvar = this.resq.getExceptionVar()
	    if (exvar == undefined) {
		this.addNewLine(output, "} catch {")
	    } else {
		this.addNewLine(output, "} catch (")
		this.add(output, symbol(exvar))
		this.add(output, ") {")
	    }

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

    letOrConstForward(la) {
	if (this.body.letOrConstForward(la)) {
	    return true
	}
	if (this.head != undefined) {
	    return this.head.letOrConstForward(la)
	}
	return false
    }

    getExceptionVar() {
	if (!(this.body instanceof Block)) {
	    return undefined
	}
	if (!(this.body.statements[0] instanceof LocalAssignment)) {
	    return undefined
	}
	return this.body.statements[0].vid
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

    isTypedRescue() {
	let rescue = this.getRescue()
	return rescue.exvar != undefined
    }
    
    getRescue() {
	let parent = this.parent
	while (parent != undefined) {
	    if (parent instanceof Rescue) {
		return parent
	    }
	    parent = parent.parent
	}
    }
    
    convert(output) {
	let rescue = this.getRescue()
	this.add(output, rescue.exvar)
    }
}
