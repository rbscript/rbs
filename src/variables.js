import {resolveNode} from './node'
import {Literal} from './literal'

export class LocalAssignment {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	this.name = tree.get(startLine, "nd_vid")
	this.value = tree.get(startLine, "nd_value")
    }
}

export class MemberAssignment {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_vid")
	this.name = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_value")
	line = tree.nextLine(line.indent)
	this.value = resolveNode(tree, line)
    }
}

export class ClassVarAssignment {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_vid")
	this.name = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_value")
	line = tree.nextLine(line.indent)
	this.value = resolveNode(tree, line)
    }
}

// https://www.rubydoc.info/gems/ruby-internal/Node/DASGN
export class DynamicAssignment {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_vid")
	this.name = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_value")
	line = tree.nextLine(line.indent)
	this.value = resolveNode(tree, line)
    }
}

// https://www.rubydoc.info/gems/ruby-internal/Node/DASGN_CURR
export class DynamicAssignmentCurrent {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	this.vid = tree.get(startLine, "nd_vid")
	this.value = tree.get(startLine, "nd_value")
    }
}


export class ConstDecl {
    constructor(tree, startLine) {
	this.location = startLine.location

	this.vid = tree.get(startLine, "nd_vid")
	this.els = tree.get(startLine, "nd_else")
	this.els = tree.get(startLine, "nd_value")
    }
}

export class GlobalAssignment {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_entry")
	this.name = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_value")
	line = tree.nextLine(line.indent)
	this.value = resolveNode(tree, line)
    }
}

export class MultiAssignment {
    constructor(tree, startLine) {
	this.location = startLine.location

	this.value = tree.get(startLine, "nd_value")
	this.head = tree.get(startLine, "nd_head")
	this.args = tree.get(startLine, "nd_args")
    }
}



export class LocalVariable {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_vid")
	this.name = line.value
    }
}

export class DynamicVariable {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	tree.nextLine(startLine.indent, "attr", "nd_vid") // contains internal value
    }
}


export class GlobalVariable {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_entry")
	this.name = line.value
    }
}

export class MemberVariable {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_vid")
	this.name = line.value
    }
}

export class ClassVariable {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_vid")
	this.name = line.value
    }
}

export class Const {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_vid")
	this.name = line.value
    }
}

export class Nil {
    constructor(tree, startLine) {
	this.location = startLine.location
    }
}

export class True {
    constructor(tree, startLine) {
	this.location = startLine.location
    }
}

export class False {
    constructor(tree, startLine) {
	this.location = startLine.location
    }
}

export class Alias {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_1st")
	line = tree.nextLine(line.indent, "NODE_LIT")
	this.first = new Literal(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_2nd")
	line = tree.nextLine(line.indent, "NODE_LIT")
	this.second = new Literal(tree, line)
    }
}

export class AttributeAssignment {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_recv")
	line = tree.nextLine(line.indent)
	this.recv = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_mid")
	this.mid = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_args")
	line = tree.nextLine(line.indent)
	this.args = resolveNode(tree, line)
    }
}

