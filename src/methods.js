import {resolveNode} from './node'
import {Artifact, Program} from './program'
import {symbol, Literal} from './literal'
import {Class, Module} from './classes'
import {Return} from './statements'
import {OpCall} from './operators'

export class FuncCall extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.mid = tree.get(this, startLine, "nd_mid")
	this.args = tree.get(this, startLine, "nd_args")

	// For example: private :meow
	if (this.inClass()) {
	    const klas = this.findOwner()
		  
	    switch (this.mid) {
	    case ":public":
	    case ":private":
	    case ":protected":
		klas.addVisibility(this.mid.slice(1), this.args)
		this.mid = undefined // Signal that we won't be outputted
		break
	    }
	}
    }

    convert(output) {
	if (this.mid == undefined) {
	    return
	}
	
	this.add(output, symbol(this.mid))

	this.add(output, "(")
	if (this.args != undefined && this.args.array.length > 0) {
	    this.add(output, this.args.array[0])
	    for (let i = 1; i < this.args.array.length; ++i) {
		this.add(output, ", ")
		this.add(output, this.args.array[i])
	    }
	}
	this.add(output, ")")
    }
}

export class VarCall extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	this.mid = tree.get(this, startLine, "nd_mid")

	// Here we handle public, private and protected
	//
	if (this.inClass()) {
	    const klas = this.findOwner()
		  
	    switch (this.mid) {
	    case ":public":
		klas.changeMode("public")
		this.mid = undefined
		break
	    case ":private":
		klas.changeMode("private")
		this.mid = undefined
		break
	    case ":protected":
		klas.changeMode("protected")
		this.mid = undefined
		break
	    }
	}
    }

    convert(output) {

	if (this.mid == undefined) { // public, private, protected
	    return
	}
	
	// Convert to a method call if exists as a method
	const owner = this.findOwner()
	const method = owner.getMethod(this.mid.slice(1))
	if (method != undefined && method.visibility != "private") {
	    this.add(output, "this.")
	    this.add(output, symbol(method.jsName))
	    this.add(output, "()")
	} else {
	    // Put it as a single symbol and pray
	    this.add(output, symbol(this.mid))
	}
    }
}

export class QCall extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_mid")
	this.name = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_recv")
	line = tree.nextLine(line.indent)
	this.recv = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_args")
	line = tree.nextLine(line.indent)
	this.args = resolveNode(this, tree, line)
    }
}

export class Defn extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	this.mid = tree.get(this, startLine, "nd_mid")
	this.defn = tree.get(this, startLine, "nd_defn")

	if (this.defn.body != undefined) { // Possible when method body is empty
	    this.defn.body = this.defn.body.returnize(tree)
	}

	// Inform the class that it has a new method
	const owner = this.findOwner()
	owner.addMethod(this, this.mid)
    }

    convert(output) {
	const owner = this.findOwner()
	if (owner instanceof Program) {
	    this.add(output, "function ")
	} else if (owner instanceof Module) {
	    this.add(output, owner.name)
	    this.add(output, ".")

	} else {// class

	    // Check if it is a property
	    //
	    if (this.mid.endsWith("=")) {
		this.add(output, "set ")
	    } else if (owner.getProperty(this.mid.slice(1)) != undefined) {
		if (this.defn.args.preArgsNum == 0) {
		    this.add(output, "get ")
		}
	    }
	}

	let name
	
	if (this.mid == ":initialize") {
	    name = "constructor"
	} else {
	    name = symbol(owner.getMethod(this.mid.slice(1)).jsName)
	    if (name.endsWith("=")) { // for setters
		name = name.slice(0, -1)
	    }
	}
	this.add(output, name)

	// From now on, we'll use defn's internal parts
	// (defn is Scope, by the way)
	//
	this.add(output, "(")
	this.defn.convertArgs(output) // See Scope.convertArgs()
	this.add(output, ") {")

	if (this.defn.body != undefined) { // Possible when method body is empty
	    output.addLine()
	    this.add(output, this.defn.body)
	}
	
	this.addNewLine(output, "}")
    }

    inClass() {
	return false
    }
}

export class ClassMethod extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_recv")
	line = tree.nextLine(line.indent)
	this.recv = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_mid")
	this.name = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_defn")
	line = tree.nextLine(line.indent)
	this.args = resolveNode(this, tree, line)
    }
}

export class Lambda extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)
    }
}

export class OptionalArgument extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_next")
	line = tree.nextLine(line.indent)
	this.next = resolveNode(this, tree, line)
    }
}

export class KeywordArgument extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_next")
	line = tree.nextLine(line.indent)
	this.next = resolveNode(this, tree, line)
    }
}

export class Undefine extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_undef")
	line = tree.nextLine(line.indent)
	this.undef = resolveNode(this, tree, line)
    }
}

export class ArgsPush extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.head = tree.get(this, startLine, "nd_head")
	this.body = tree.get(this, startLine, "nd_body")
    }
}

export class ArgsCat extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.head = tree.get(this, startLine, "nd_head")
	this.body = tree.get(this, startLine, "nd_body")
    }
}

export class PostArg extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.head = tree.get(this, startLine, "nd_1st")
	this.body = tree.get(this, startLine, "nd_2nd")
    }
}
