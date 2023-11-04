import {resolveNode} from './node'

export class LocalAssignment {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_vid")
	this.name = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_value")
	line = tree.nextLine(line.indent)
	this.value = resolveNode(tree, line)
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


export class ConstDecl {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_vid")
	this.name = line.value

	// What the fuck???
	line = tree.nextLine(startLine.indent, "attr", "nd_else")
	
	line = tree.nextLine(startLine.indent, "attr", "nd_value")
	line = tree.nextLine(line.indent)
	this.value = resolveNode(tree, line)
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
