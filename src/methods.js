import {resolveNode} from './node'
import {Artifact} from './artifact'
import {symbol, Literal} from './literal'
import {Class, Module, Program} from './classes'
import {Return} from './statements'
import {OpCall} from './operators'
import {String} from './string'
import {Const, LocalAssignment} from './variables'

export class FuncCall extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.mid = tree.get(this, startLine, "nd_mid")
	this.args = tree.get(this, startLine, "nd_args")

	this.require = false
	
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
	    case ":include":
	    case ":extend":
	    case ":prepend":
		if (klas instanceof Class) {
		    klas.addInclude(this.mid, this.args.array[0])
		    this.mid = undefined // Signal that we won't be outputted
		}
		break
	    }
	} else {
	    if ((this.mid == ":require" || this.mid == ':load') &&
		this.args.array.length == 1) {
		this.require = true
	    }
	}
    }

    convert(output) {
	if (this.mid == undefined) {
	    return
	}

	if (this.mid == ':raise' || this.mid == ':fail') {
	    return this.convertRaise(output)
	}

	if (this.require) {
	    return this.convertRequire(output)
	}
	
	this.add(output, symbol(this.mid))

	this.add(output, "(")

	if (this.args != undefined && this.args.array.length > 0) {

	    let kwStarted = false
	    for (let i = 0; i < this.args.array.length; ++i) {
		if (i > 0) {
		    this.add(output, ", ")
		}
		
		if (this.args.array[i] instanceof LocalAssignment) {
		    if (!kwStarted) {
			this.add(output, "{")
			kwStarted = true
		    }

		    const la = this.args.array[i]
		    this.add(output, symbol(la.vid))
		    this.add(output, ": ")
		    this.add(output, la.value)
		    
		} else {
		    // Normal case
		    //
		    this.add(output, this.args.array[i])
		}
	    }

	    if (kwStarted) {
		this.add(output, "}")
	    }
	}
	this.add(output, ")")
    }

    convertRaise(output) {
	this.add(output, "throw ")

	const args = this.args.array

	if (args[0] instanceof String) {
	    this.add(output, args[0])
	} else if (args[0] instanceof Const) {
	    this.add(output, "new ")
	    this.add(output, args[0])
	    this.add(output, "(")
	    for (let i = 1; i < args.length; ++i) {
		if (i > 1) {
		    this.add(output, ", ")
		}
		this.add(output, args[i])
	    }
	    this.add(output, ")")
	}

    }

    convertRequire(output) {
	const importVar = output.genVar("import")
	const keyVar = output.genVar("key")

	this.addNewLine(output, "import * as ")
	this.add(output, importVar)
	this.add(output, " from ")
	this.add(output, this.args.array[0])
	
	this.addNewLine(output, "for (const ")
	this.add(output, keyVar)
	this.add(output, " in ")
	this.add(output, importVar)
	this.add(output, ") {")

	output.indent()
	this.add(output, "globalThis[")
	this.add(output, keyVar)
	this.add(output, "] = ")
	this.add(output, importVar)
	this.add(output, "[")
	this.add(output, keyVar)
	this.add(output, "]")
	
	output.unindent()
	this.add(output, "}")
    }
}

export class VarCall extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
	
	this.mid = tree.get(this, startLine, "nd_mid")

	// Here we handle public, private and protected
	//
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
	    //
	    
	    // but, :raise is different
	    //
	    if (this.mid == ':raise' || this.mid == ':fail') {
		this.add(output, "throw;")
	    } else if (this.mid == ":_") {
		this.add(output, "undefined")
	    } else {
		// Common case
		//
		this.add(output, symbol(this.mid))
	    }
	}
    }
}

export class Defn extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.generator = false
	this.mid = tree.get(this, startLine, "nd_mid")
	this.defn = tree.get(this, startLine, "nd_defn")

	if (this.defn.body != undefined) { // Possible when method body is empty
	    this.defn.body = this.defn.body.returnize(tree)
	}

	// Inform the class that it has a new method
	const owner = this.findOwner()
	owner.addMethod(this, this.mid)
    }

    findOwnerMethod() {
	return this
    }

    convert(output) {
	const owner = this.findOwner()
	const ownerDefn = this.parent.findOwnerMethod()
	let func = ownerDefn != undefined || (owner instanceof Program)

	if (ownerDefn == undefined && (owner instanceof Program)) {
	    const m = owner.getMethod(this.mid.slice(1))
	    if (m.visibility == "public") {
		this.add(output, "export ")
	    }
	}

	if (func) {
	    if (this.generator) {
		this.add(output, "function* ")
	    } else {
		this.add(output, "function ")
	    }

	}  else {// class

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
	    } else if (this.generator && !func) {
		name = "*" + name
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
	    output.indent()
	    this.add(output, this.defn.body)
	    output.unindent()
	}
	
	this.addNewLine(output, "}")
    }

    inClass() {
	return false
    }
}

export class ClassMethod extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.recv = tree.get(this, startLine, "nd_recv")
	this.mid = tree.get(this, startLine, "nd_mid")
	this.defn = tree.get(this, startLine, "nd_defn")

	if (this.defn.body != undefined) { // Possible when method body is empty
	    this.defn.body = this.defn.body.returnize(tree)
	}

	// Inform the class that it has a new method
	const owner = this.findOwner()
	owner.addClassMethod(this, this.mid)
    }

    convert(output) {
	const owner = this.findOwner()
	this.add(output, "static ")
	
	if (this.mid.endsWith("=")) {
	    this.add(output, "set ")
	} else if (owner.getClassProperty(this.mid.slice(1)) != undefined) {
	    if (this.defn.args.preArgsNum == 0) {
		this.add(output, "get ")
	    }
	}
	
	let name = symbol(owner.getMethod(this.mid.slice(1)).jsName)
	if (name.endsWith("=")) { // for setters
	    name = name.slice(0, -1)
	}

	this.add(output, name)

	// From now on, we'll use defn's internal parts
	// (defn is Scope, by the way)
	//
	this.add(output, "(")
	this.defn.convertArgs(output) // See Scope.convertArgs()
	this.add(output, ") {")

	if (this.defn.body != undefined) { // Possible when method body is empty
	    output.indent()
	    this.add(output, this.defn.body)
	    output.unindent()
	}
	
	this.addNewLine(output, "}")
    }

    inClass() {
	return false
    }
}

export class Lambda extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.body = tree.get(this, startLine, "nd_body")

	// this.body is a Scope
	this.body.body = this.body.body.returnize(tree)
    }

    convert(output) {
	Lambda.convertt(this, output, this.body)
    }

    static convertt(that, output, body) {
	that.add(output, "(")
	body.convertArgs(output) // See Scope.convertArgs()
	that.add(output, ") => {")

	output.indent()
	that.add(output, body)
	
	output.unindent()
	that.add(output, "}")
    }
}

export class OptionalArgument extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
	
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
	super(parent, tree, startLine)
	
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
	super(parent, tree, startLine)

	this.undef = tree.get(this, startLine, "nd_undef")
    }

    convert(output) {
	this.addNewLine(output, this.undef)
	this.add(output, " = undefined")
    }
}

export class ArgsPush extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.head = tree.get(this, startLine, "nd_head")
	this.body = tree.get(this, startLine, "nd_body")
    }
}

export class ArgsCat extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.head = tree.get(this, startLine, "nd_head")
	this.body = tree.get(this, startLine, "nd_body")
    }
}

export class PostArg extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.head = tree.get(this, startLine, "nd_1st")
	this.body = tree.get(this, startLine, "nd_2nd")
    }
}

export class Alias extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
	
	this.first = tree.get(this, startLine, "nd_1st")
	this.second = tree.get(this, startLine, "nd_2nd")
    }

    convert(output) {
	this.add(output, this.first)
	this.add(output, " = ")
	this.add(output, this.second)
    }
}
