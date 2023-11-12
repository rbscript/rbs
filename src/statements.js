import {resolveNode} from './node'
import {Artifact} from './program'
import {List} from './lists'
import {symbol} from './literal'

export class If extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	this.cond = tree.get(this, startLine, "nd_cond")
	this.body = tree.get(this, startLine, "nd_body")
	this.els = tree.get(this, startLine, "nd_else")
    }

    convert(output) {
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

export class Unless extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.cond = tree.get(this, startLine, "nd_cond")
	this.body = tree.get(this, startLine, "nd_body")
	this.els = tree.get(this, startLine, "nd_else")
    }

    convert(output) {
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
    }
}

export class Return extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.stts = tree.get(this, startLine, "nd_stts")
    }

    convert(output) {
	this.add(output, "return")
	if (this.stts != undefined) {
	    this.add(output, " ")
	    this.add(output, this.stts)
	}
    }
}

export class Break extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_stts")

	line = tree.nextLine(line.indent)
	this.stts = resolveNode(this, tree, line)
    }
}

export class Next extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_stts")

	line = tree.nextLine(line.indent)
	this.stts = resolveNode(this, tree, line)
    }
}

export class Redo extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
    }
}



export class For extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.iter = tree.get(this, startLine, "nd_iter")
	this.body = tree.get(this, startLine, "nd_body")
    }

    convert(output) {
	this.add(output, "for (const ")
	this.add(output, symbol(this.body.args.preInit.vid))
	this.add(output, " in ")
	this.add(output, this.iter)
	this.add(output, ") {")
	output.addLine()

	this.add(output, this.body)
	output.addLine()
	this.add(output, "}")
    }
}

export class While extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_state")
	this.state = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_cond")
	line = tree.nextLine(line.indent)
	this.cond = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)
    }
}

export class Until extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_state")
	this.state = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_cond")
	line = tree.nextLine(line.indent)
	this.cond = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)
    }
}

export class Case extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	this.type = startLine.type
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.cond = resolveNode(this, tree, line)

	// This body consists of NODE_WHENs or NODE_INs
	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	if (line.type == "NODE_WHEN") {
	    this.firstWhen = new When(this, tree, line)
	} else if (line.type == "NODE_IN") {
	    this.firstWhen = new In(this, tree, line)
	} else {
	    throw "Unexpected node " + line.type + " while resolving case"
	}
    }
}

class When extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.cond = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_next")
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
}

class In extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

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
