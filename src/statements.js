import {resolveNode} from './node'
import {Artifact} from './artifact'
import {List} from './lists'
import {symbol} from './literal'
import {Scope, Block} from './blocks'

export class StmWithBlock extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
    }

    findLocalVar(la, search) { // la is a LocalAssignment
	return this.body.findLocalVar(la, search)
    }

    functionize1(output) {
	this.add(output, "(() => {")
	output.addLine()
    }

    functionize2(output) {
	output.addLine()
	this.add(output, "})()")
    }

    asExpr() {
	if (this.parent instanceof Scope) {
	    return false
	}
	if (this.parent instanceof Block) {
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
	output.addLine()
	
	this.add(output, this.body)
	output.addLine()
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
	output.addLine()

	this.add(output, iff.body)
	output.addLine()
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
	output.addLine()
	
	this.add(output, els)
	output.addLine()
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
	output.addLine()
	
	this.add(output, this.body)
	output.addLine()
	this.add(output, "}")

	if (this.els != undefined) {
	    this.add(output, " else {")
	    output.addLine()
	    
	    this.add(output, this.els)
	    output.addLine()
	    this.add(output, "}")
	}

	if (this.asExpr()) {
	    this.functionize2(output)
	}
    }
}

export class Return extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
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
	super(parent, startLine)

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
	super(parent, startLine)

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
	super(parent, startLine)
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
	output.addLine()

	this.add(output, this.body)
	output.addLine()
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
	    this.add(output, "while (")
	    this.add(output, this.cond)
	    this.add(output, ") {")
	} else if (this.state.startsWith("0")) {
	    this.add(output, "do {")
	} else {
	    throw "Unexpected state " + this.state + " for while"
	}
	output.addLine()
	
	this.add(output, this.body)
	output.addLine()
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
	output.addLine()

	this.add(output, this.body)
	output.addLine()
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
	
	this.head = tree.get(this, startLine, "nd_head")

	// This body consists of NODE_WHENs or NODE_INs
	let line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	if (line.type == "NODE_WHEN") {
	    this.firstWhen = new When(this, tree, line)
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

	this.add(output, "}")

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
}

class When extends StmWithBlock {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.head = tree.get(this, startLine, "nd_head")
	this.body = tree.get(this, startLine, "nd_body")
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_next")
	line = tree.nextLine(line.indent)
	switch (line.type) {
	case "NODE_WHEN":
	    this.when = new When(this, tree, line)
	case "(null node)":
	    this.els = undefined
	    break
	default:
	    this.els = resolveNode(this, tree, line)
	    break
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
	    this.add(output, "case ")
	    this.add(output, cond)
	    this.add(output, ":")
	    output.addLine()
	}
	this.add(output, this.body)
	output.addLine()

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
	    output.addLine()

	    this.add(output, this.els)
	    output.addLine()

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
	output.addLine()
	
	this.add(output, this.body)
	output.addLine()
	this.add(output, "}")

	if (this.els != undefined) {
	    this.add(output, " else {")
	    output.addLine()
	
	    this.add(output, this.els)
	    output.addLine()
	    this.add(output, "}")
	}
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
	    output.addLine()
	    
	    this.body.convert(output)
	    output.addLine()
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
    }

    convert(output) {
	this.iter.convert(output, true) // see FuncCall.convert()

	this.add(output, "(")
	this.body.convertArgs(output)
	this.add(output, ") => {")

	output.addLine()
	this.add(output, this.body)
	output.addLine()
	this.add(output, "})")
    }
}

