import {resolveNode} from './node'
import {Artifact} from './artifact'
import {List, Range} from './lists'
import {symbol} from './literal'
import {Scope, Block} from './blocks'
import {FuncCall, Lambda} from './methods'

export class StmWithBlock extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
    }

    findLocalVar(la, search) { // la is a LocalAssignment
	return this.body.findLocalVar(la, search)
    }

    functionize1(output) {
	this.add(output, "(() => {")
	output.indent()
    }

    functionize2(output) {
	output.unindent()
	this.addNewLine(output, "})()")
    }

    asExpr() {
	if (this.parent instanceof Scope) {
	    return false
	}
	if (this.parent instanceof Block) {
	    return false
	}
	if (this.parent instanceof Begin) {
	    return false
	}
	return true
    }

    returnize(tree) {
	this.body = this.body.returnize(tree)
	return this
    }
}

export class If extends StmWithBlock {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
	
	this.cond = tree.get(this, startLine, "nd_cond")
	this.body = tree.get(this, startLine, "nd_body")
	this.els = tree.get(this, startLine, "nd_else")

	if (this.asExpr()) {
	    this.returnize(tree)
	}
    }

    returnize(tree) {
	this.body = this.body.returnize(tree)
	if (this.els != undefined) {
	    this.els = this.els.returnize(tree)
	}
	return this
    }

    isReturn() {
	if (this.els == undefined) {
	    return false
	}
	return this.body.isReturn() && this.els.isReturn()
    }

    findLocalVar(la, search) { // la is a LocalAssignment
	const ret = this.body.findLocalVar(la, false)
	if (ret != 0) {
	    return ret
	}
	if (this.els != undefined) {
	    return this.els.findLocalVar(la, false)
	}
	return 0
    }
    
    convert(output) {

	if (this.asExpr()) {
	    this.functionize1(output)
	}
	
	this.add(output, "if (")
	this.add(output, this.cond)
	this.add(output, ") {")

	output.indent()
	this.add(output, this.body)
	output.unindent()
	this.add(output, "}")

	if (this.els != undefined) {
	    if (this.els instanceof If) { // else if
		this.convertElseIf(output, this.els)
	    } else {
		this.convertElse(output, this.els)
	    }
	}

	if (this.asExpr()) {
	    this.functionize2(output)
	}
    }

    convertElseIf(output, iff) {
	this.add(output, " else if (")
	this.add(output, iff.cond)
	this.add(output, ") {")

	output.indent()
	this.add(output, iff.body)
	output.unindent()
	this.add(output, "}")

	if (iff.els != undefined) {
	    if (iff.els instanceof If) { // else if
		this.convertElseIf(output, iff.els)
	    } else {
		this.convertElse(output, iff.els)
	    }
	}
    }

    convertElse(output, els) {
	this.add(output, " else {")
	output.indent()
	
	this.add(output, els)
	output.unindent()
	this.add(output, "}")
    }
}

export class Unless extends StmWithBlock {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.cond = tree.get(this, startLine, "nd_cond")
	this.body = tree.get(this, startLine, "nd_body")
	this.els = tree.get(this, startLine, "nd_else")

	if (this.asExpr()) {
	    this.returnize(tree)
	}
    }

    returnize(tree) {
	this.body = this.body.returnize(tree)
	if (this.els != undefined) {
	    this.els = this.els.returnize(tree)
	}
	return this
    }

    isReturn() {
	if (this.els == undefined) {
	    return false
	}
	return this.body.isReturn() && this.els.isReturn()
    }
    
    convert(output) {

	if (this.asExpr()) {
	    this.functionize1(output)
	}
	
	this.add(output, "if (!(")
	this.add(output, this.cond)
	this.add(output, ")) {")
	output.indent()
	
	this.add(output, this.body)
	output.unindent()
	this.add(output, "}")

	if (this.els != undefined) {
	    this.add(output, " else {")
	    output.indent()
	    
	    this.add(output, this.els)
	    output.unindent()
	    this.add(output, "}")
	}

	if (this.asExpr()) {
	    this.functionize2(output)
	}
    }
}

export class Return extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
	if (startLine != undefined) { // see Returnize() below 
	    this.stts = tree.get(this, startLine, "nd_stts")
	}
    }

    convert(output) {
	this.add(output, "return")
	if (this.stts != undefined) {
	    this.add(output, " ")
	    this.add(output, this.stts)
	}
    }

    static ize(tree, artifact) {
	const ret = new Return(artifact.parent, undefined, undefined)
	ret.location = artifact.location
	ret.stts = artifact
	return ret
    }

    isReturn() {
	return true
    }
}

export class Break extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.stts = tree.get(this, startLine, "nd_stts")
    }

    returnize(tree) {
	if (this.stts != undefined) {
	    return Return.ize(tree, this.stts)
	} else {
	    return this
	}
    }

    convert(output) {
	this.add(output, "break")
	if (this.stts != undefined) {
	    this.add(output, " ")
	    this.add(output, this.stts)
	}
    }
}

export class Next extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.stts = tree.get(this, startLine, "nd_stts")
    }

    convert(output) {
	this.add(output, "continue")
	if (this.stts != undefined) {
	    throw "Unexpected" // TODO what does it mean for next to return a value?
	}
    }
}

export class Redo extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
    }
}

class Loop extends StmWithBlock {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
    }

    returnize(tree) {
	this.body = this.body.returnizeForBreak(tree)
	return this
    }
}

export class For extends Loop {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.iter = tree.get(this, startLine, "nd_iter")
	this.body = tree.get(this, startLine, "nd_body")
	
	if (this.asExpr()) {
	    this.returnize(tree)
	}
    }

    convert(output) {
	if (this.asExpr()) {
	    this.functionize1(output)
	}
	
	this.add(output, "for (const ")
	this.add(output, symbol(this.body.args.preInit.vid))
	this.add(output, " in ")
	this.add(output, this.iter)
	this.add(output, ") {")
	output.indent()

	this.add(output, this.body)
	output.unindent()
	this.add(output, "}")

	if (this.asExpr()) {
	    this.functionize2(output)
	}
    }
}

export class While extends Loop {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.state = tree.get(this, startLine, "nd_state")
	this.cond = tree.get(this, startLine, "nd_cond")
	this.body = tree.get(this, startLine, "nd_body")

	if (this.asExpr()) {
	    this.returnize(tree)
	}
    }

    convert(output) {

	if (this.asExpr()) {
	    this.functionize1(output)
	}
	
	if (this.state.startsWith("1")) {
	    this.addNewLine(output, "while (")
	    this.add(output, this.cond)
	    this.add(output, ") {")
	} else if (this.state.startsWith("0")) {
	    this.addNewLine(output, "do {")
	} else {
	    throw "Unexpected state " + this.state + " for while"
	}
	
	output.indent()
	this.add(output, this.body)
	output.unindent()
	this.add(output, "}")

	if (this.state.startsWith("0")) {
	    this.add(output, " while (")
	    this.add(output, this.cond)
	    this.add(output, ")")
	}

	if (this.asExpr()) {
	    this.functionize2(output)
	}
    }
}

export class Until extends Loop {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.state = tree.get(this, startLine, "nd_state")
	this.cond = tree.get(this, startLine, "nd_cond")
	this.body = tree.get(this, startLine, "nd_body")

	if (this.asExpr()) {
	    this.returnize(tree)
	}
    }

    convert(output) {

	if (this.asExpr()) {
	    this.functionize1(output)
	}
	
	this.add(output, "while (!(")
	this.add(output, this.cond)
	this.add(output, ")) {")
	output.indent()

	this.add(output, this.body)
	output.unindent()
	this.add(output, "}")

	if (this.asExpr()) {
	    this.functionize2(output)
	}
    }
}

export class Case extends StmWithBlock {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
	this.type = startLine.type
	this.containsRange = false
	
	this.head = tree.get(this, startLine, "nd_head")

	// This body consists of NODE_WHENs or NODE_INs
	let line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	if (line.type == "NODE_WHEN") {
	    this.firstWhen = new When(this, tree, line, this)
	} else if (line.type == "NODE_IN") {
	    this.firstWhen = new In(this, tree, line)
	} else {
	    throw "Unexpected node " + line.type + " while resolving case"
	}

	if (this.asExpr()) {
	    this.returnize(tree)
	}
    }

    findLocalVarSearch(la, search) { // la is a LocalAssignment
	let when = this.firstWhen
	while (when != undefined) {
	    
	    const ret = when.findLocalVar(la, search)
	    if (ret != 0) {
		return ret
	    }
	    when = when.when
	}
	return 0
    }
    
    returnize(tree) {
	let when = this.firstWhen
	while (when != undefined) {
	    when.returnize(tree)
	    when = when.when
	}
	return this
    }

    isReturn() {
	let when = this.firstWhen
	while (when != undefined) {
	    if (!when.isReturn()) {
		return false
	    }
	    when = when.when
	}
	return when.els != undefined 
    }
    
    convert(output) {
	if (this.head == undefined) {
	    this.convertGlorifiedIfElse(output)
	    return
	} else if (this.containsRange) {
	    this.convertIfliWhen(output)
	    return
	}
	
	if (this.asExpr()) {
	    this.functionize1(output)
	}

	this.add(output, "switch (")
	this.add(output, this.head)
	this.add(output, ") {")
	output.addLine()

	let when = this.firstWhen
	while (when != undefined) {
	    when.convert(output)
	    when = when.when
	}

	this.addNewLine(output, "}")

	if (this.asExpr()) {
	    this.functionize2(output)
	}
    }

    convertGlorifiedIfElse(output) {
	if (this.asExpr()) {
	    this.functionize1(output)
	}
	
	let when = this.firstWhen
	let first = true
	while (when != undefined) {
	    when.convertGlorifiedIfElse(output, first)
	    first = false
	    when = when.when
	}

	if (this.asExpr()) {
	    this.functionize2(output)
	}
    }

    convertIfliWhen(output) {
	if (this.asExpr()) {
	    this.functionize1(output)
	}
	
	let when = this.firstWhen
	let first = true
	while (when != undefined) {
	    when.convertIfliWhen(output, first, this.head)
	    first = false
	    when = when.when
	}

	if (this.asExpr()) {
	    this.functionize2(output)
	}
    }
}

class When extends StmWithBlock {
    constructor(parent, tree, startLine, caseStm) {
	super(parent, tree, startLine)

	this.caseStm = caseStm
	this.head = tree.get(this, startLine, "nd_head")
	this.body = tree.get(this, startLine, "nd_body")
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_next")
	line = tree.nextLine(line.indent)
	switch (line.type) {
	case "NODE_WHEN":
	    this.when = new When(this, tree, line, caseStm)
	case "(null node)":
	    this.els = undefined
	    break
	default:
	    this.els = resolveNode(this, tree, line)
	    break
	}

	if (this.head.array != undefined)
	{
	    // Check if any of the element is a range
	    for (const elem of this.head.array) {
		if (elem instanceof Range) {
		    this.caseStm.containsRange = true
		    break
		}
	    }
	}
    }

    returnize(tree) {
	this.body = this.body.returnize(tree)
	if (this.els != undefined) {
	    this.els = this.els.returnize(tree)
	}
	return this
    }

    isReturn() {
	if (this.body.isReturn()) {
	    if (this.els != undefined) {
		return this.els.isReturn()
	    }
	}
	return false
    }

    convert(output) {
	for (const cond of this.head.array) {
	    this.addNewLine(output, "case ")
	    this.add(output, cond)
	    this.add(output, ":")
	}

	output.indent()
	this.add(output, this.body)
	output.unindent()

	let addbreak = !(this.body instanceof Return) 
	if (!addbreak) {
	    addbreak = !this.body.isReturn()
	}

	if (addbreak) {
	    this.add(output, "break")
	    output.addLine()
	}
	
	if (this.els != undefined) {
	    this.add(output, "default:")
	    output.indent()

	    this.add(output, this.els)
	    output.unindent()

	    addbreak = this.els instanceof Return
	    if (!addbreak) {
		addbreak = !this.els.isReturn()
	    }

	    if (addbreak) {
		this.add(output, "break")
		output.addLine()
	    }
	}
    }

    convertGlorifiedIfElse(output, first) {
	this.add(output, (first ? "if (" : " else if ("))

	if (this.head.array.length == 1) {
	    this.add(output, this.head.array[0])
	} else {
	    let first = true
	    for (const cond of this.head.array) {
		if (first) {
		    first = false
		} else {
		    this.add(output, " || ")
		}
		this.add(output, "(")
		this.add(output, cond)
		this.add(output, ")")
	    }
	}
	this.add(output, ") {")
	output.indent()
	
	this.add(output, this.body)
	output.unindent()
	this.add(output, "}")

	if (this.els != undefined) {
	    this.add(output, " else {")
	    output.indent()
	
	    this.add(output, this.els)
	    output.unindent()
	    this.add(output, "}")
	}
    }

    convertIfliWhen(output, first, ifhead) {
	this.add(output, (first ? "if (" : " else if ("))


	if (this.head.array.length == 1) {
	    if (this.head.array[0] instanceof Range) {
		this.convertRange(output, this.head.array[0], ifhead)
	    } else {
		this.convertExpr(output, this.head.array[0], ifhead)
	    }
	} else {
	    let first = true
	    for (const cond of this.head.array) {
		if (first) {
		    first = false
		} else {
		    this.add(output, " || ")
		}
		this.add(output, "(")

		if (cond instanceof Range) {
		    this.convertRange(output, cond, ifhead)
		} else {
		    this.convertExpr(output, cond, ifhead)
		}
		
		this.add(output, ")")
	    }
	}

	
	this.add(output, ") {")
	output.indent()
	
	this.add(output, this.body)
	output.unindent()
	this.add(output, "}")
	
	if (this.els != undefined) {
	    this.add(output, " else {")
	    output.indent()
	
	    this.add(output, this.els)
	    output.unindent()
	    this.add(output, "}")
	}
    }

    convertRange(output, range, ifhead) {
	this.add(output, "(")
	this.add(output, ifhead)
	this.add(output, ") >= (")
	this.add(output, range.beg)
	this.add(output, ") && (")
	this.add(output, ifhead)
	if (range.exclude) {
	    this.add(output, ") < (")
	} else {
	    this.add(output, ") <= (")
	}

	this.add(output, range.end)
	this.add(output, ")")
    }

    convertExpr(output, cond, ifhead) {
	this.add(output, "(")
	this.add(output, ifhead)
	this.add(output, ") == (")
	this.add(output, cond)
	this.add(output, ")")
    }

}

class In extends StmWithBlock {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.cond = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_next")
	line = tree.nextLine(line.indent)
	switch (line.type) {
	case "NODE_IN":
	    this.when = new When(this, tree, line)
	case "(null node)":
	    this.els = undefined
	    break
	default:
	    this.els = resolveNode(this, tree, line)
	    break
	}
    }
}

export class Begin extends StmWithBlock {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
	this.body = tree.get(this, startLine, "nd_body")

	if (this.asExpr()) {
	    this.returnize(tree)
	}
    }

    returnize(tree) {
	this.body = this.body.returnize(tree)
    }
    
    convert(output) {
	if (this.body != undefined) {

	    if (this.asExpr()) {
		this.functionize1(output)
	    }

	    this.add(output, "{")
	    output.indent()
	    
	    this.body.convert(output)
	    output.unindent()
	    this.add(output, "}")
	    
	    if (this.asExpr()) {
		this.functionize2(output)
	    }
	} // else, nothing else matters
	// In fact, class definitions etc have empty NDL_BEGIN constructs for some reason
    }
}

export class Iter extends StmWithBlock {
    constructor(parent, tree, startLine) {
	
	super(parent, tree, startLine)

	this.iter = tree.get(this, startLine, "nd_iter")
	this.body = tree.get(this, startLine, "nd_body")

	
	this.lambda = (this.iter instanceof FuncCall &&
		       this.iter.mid == ':lambda')
	if (this.lambda) {
	    this.body.body = this.body.body.returnize(tree)
	}

    }

    convert(output) {

	if (this.lambda) {
	    Lambda.convertt(this, output, this.body)
	    return
	}

	if (this.asExpr()) {
	    this.functionize1(output)
	}

	this.addNewLine(output, "for (const ")

	if (this.body.params.length == 1) {
	    this.body.convertArgs(output)
	    this.add(output, " of ")
	} else if (this.body.params.length == 0) {
	    this.add(output, output.genVar("dummy"))
	    this.add(output, " of ")
	} else {
	    this.add(output, "[")
	    this.body.convertArgs(output)
	    this.add(output, "] of ")
	}
	

	this.iter.convert(output, true) // see FuncCall.convert()
	this.add(output, ") {")

	output.indent()
	this.add(output, this.body)
	output.unindent()
	this.add(output, "}")
	
	if (this.asExpr()) {
	    this.functionize2(output)
	}
    }
}

