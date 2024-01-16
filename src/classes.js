import {resolveNode} from './node'
import {Artifact} from './artifact'
import {symbol} from './literal'

// Program, Module and Class derives from this class
// It is called Owner because of findOwner() method
class Owner extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
	this.classes = {}
	this.modules = {}
	this.props = {}
	this.methods = {}
	this.classProps = {}
	this.classMethods = {}

	// public -> props are private, methods are public
	// private -> everything is private, starts with #
	// protected -> everything is protected, starts with _
	this.mode = "public"

	this.priv = true // We are private by default (as classes and modules)
    }

    findOwner() {
	return this
    }

    changeMode(mode) {
	this.mode = mode
    }
    
    addClass(klass) {
	this.classes[klass.name] = klass
	if (this.mode == "public") {
	    klass.priv = false
	}
    }

    getClass(name) {
	return this.classes[name]
    }

    addModule(module) {
	this.modules[module.name] = module
	if (this.mode == "public") {
	    module.priv = false
	}
    }

    getModule(name) {
	return this.modules[name]
    }

    addProperty(artifact, name) {
	name = name.slice(2) // eliminate :@
	if (this.getProperty(name) != undefined) {
	    return
	}

	let mode = this.mode
	if (mode == "public") {
	    mode = "private" // The default is private for properties
	} else if (mode == "protected") {
	    if (!artifact.inClass()) {
		mode = "private"
	    }
	}
	
	this.props[name] = new Property(artifact, name, mode)
    }

    
    addClassProperty(artifact, name) {
	name = name.slice(3) // eliminate :@@
	if (this.getClassProperty(name) != undefined) {
	    return
	}

	let mode = this.mode
	if (mode == "public") {
	    mode = "private" // The default is private for properties
	}
	
	this.classProps[name] = new Property(artifact, name, mode)
    }

    addMethod(artifact, name) {
	name = name.slice(1) // eliminate :
	if (this.getMethod(name) != undefined) {
	    return
	}

	this.methods[name] = new Method(artifact, name, this.mode)
    }

    addClassMethod(artifact, name) {
	name = name.slice(1) // eliminate :
	if (this.getClassMethod(name) != undefined) {
	    return
	}

	this.methods[name] = new Method(artifact, name, this.mode)
    }

    getProperty(name) {
	const prop = this.props[name]
	if (prop != undefined) {
	    return prop
	}
	if (this.supper != undefined && this.superClass != undefined) {
	    return this.superClass.getProperty(name)
	}
	return undefined
    }

    getClassProperty(name) {
	const prop = this.classProps[name]
	if (prop != undefined) {
	    return prop
	}
	if (this.supper != undefined && this.superClass != undefined) {
	    return this.superClass.getClassProperty(name)
	}
	return undefined
    }

    getMethod(name) {
	const met = this.methods[name]
	if (met != undefined) {
	    return met
	}
	if (this.supper != undefined && this.superClass != undefined) {
	    return this.superClass.getMethod(name)
	}
	return undefined
    }

    getClassMethod(name) {
	const met = this.classMethods[name]
	if (met != undefined) {
	    return met
	}
	if (this.supper != undefined && this.superClass != undefined) {
	    return this.superClass.getClassMethod(name)
	}
	return undefined
    }

    addVisibility(mode, args) {
	const names = []
	for (const arg of args.array) {
	    const name = arg.lit.slice(1) // eliminate :
	    if (this.methods[name] != undefined) {
		this.methods[name].visibility = mode
	    } else if (mode == "public") {
		if (this.classes[name] != undefined) {
		    this.classes[name].priv = false
		} else if (this.modules[name] != undefined) {
		    this.modules[name].priv = false

		}
	    }
	}
    }
}

export class Class extends Owner {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.includes = []
	this.extendes = []
	this.prependes = []
	
	this.cpath  = tree.get(this, startLine, "nd_cpath")
	this.supper  = tree.get(this, startLine, "nd_super")
	this.body  = tree.get(this, startLine, "nd_body")

	this.parent.addClass(this)
    }

    get name() {
	return this.cpath.mid
    }

    addInclude(type, name) {
	switch (type) {
	case ":include":
	    this.includes.push(name)
	    break
	case ":extend":
	    this.extendes.push(name)
	    break
	case ":prepend":
	    this.prependes.push(name)
	    break
	}
    }
    
    convert(output) {
	if (!this.priv) {
	    const owner = this.parent.findOwner()
	    if (owner instanceof Program) {
		this.add(output, "export ")
	    }
	}
	
	this.add(output, "class ")
	this.add(output, this.cpath)
	if (this.supper != undefined) {
	    this.add(output, " extends ")
	    this.add(output, this.supper)
	}
	this.add(output, " {")
	output.indent()

	this.add(output, this.body)
	output.unindent()
	
	this.addNewLine(output, "}")

	this.convertIncludes(output) // if any
    }

    inClass() {
	return true
    }
    
    get superClass() {
	return this.parent.getClass(this.supper.name)
    }

    convertIncludes(output) {
	for (const x of this.includes) {
	    const consVar = output.genVar("cons")
	    const protoVar = output.genVar("proto")

	    this.addNewLine(output, "const {")
	    this.add(output, consVar)
	    this.add(output, ", ...")
	    this.add(output, protoVar)
	    this.add(output, "} = Object.getOwnPropertyDescriptors(")
	    this.add(output, x)
	    this.add(output, ".prototype)")

	    this.addNewLine(output, "Object.defineProperties(")
	    this.add(output, this.cpath)
	    this.add(output, ".prototype, ")
	    this.add(output, protoVar)
	    this.add(output, ")")
	}

	for (const x of this.extendes) {
	    const consVar = output.genVar("cons")
	    const protoVar = output.genVar("proto")

	    this.addNewLine(output, "const {")
	    this.add(output, consVar)
	    this.add(output, ", ...")
	    this.add(output, protoVar)
	    this.add(output, "} = Object.getOwnPropertyDescriptors(")
	    this.add(output, x)
	    this.add(output, ".prototype)")

	    this.addNewLine(output, "Object.defineProperties(")
	    this.add(output, this.cpath)
	    this.add(output, ", ")
	    this.add(output, protoVar)
	    this.add(output, ")")
	}

	// https://stackoverflow.com/questions/51823432/javascript-how-to-change-the-parent-class-of-a-class
	for (const x of this.prependes) {
	    this.addNewLine(output, this.cpath)
	    this.add(output, ".prototype.__proto__ = ")
	    this.add(output, x)
	    this.add(output, ".prototype")
	}
	
    }
}

class Property {
    constructor(artifact, name, visibility) {
	this.artifact = artifact
	this.name = name
	this.visibility = visibility
    }

    get jsName() {
	switch (this.visibility) {
	case "private":
	    return "#" + this.name
	case "protected":
	    return "_" + this.name
	default:
	    throw "A prop should either be private or protected"
	}
    }
}

class Method {
    constructor(artifact, name, visibility) {
	this.artifact = artifact
	this.name = name
	this.visibility = visibility
    }

    get jsName() {
	switch (this.visibility) {
	case "private":
	    return "#" + this.name
	case "protected":
	    return "_" + this.name
	default:
	    return this.name
	}
    }
}

export class Program extends Owner {
    constructor(tree) {
	super(undefined, undefined, undefined)

	let line = tree.nextLine(0, "NODE_SCOPE")
	this.scope = resolveNode(this, tree, line)
    }

    convert(output) {
	this.scope.convert(output)
	return output.toString()
    }
}



export class Self extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
    }
}

export class Singleton extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_recv")
	line = tree.nextLine(line.indent)
	this.recv = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)
    }
}

export class Module extends Owner {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.cpath  = tree.get(this, startLine, "nd_cpath")
	this.body  = tree.get(this, startLine, "nd_body")

	this.parent.addModule(this)
    }

    get name() {
	return this.cpath.mid
    }
    
    findOwner() {
	return this
    }

    inClass() {
	return true
    }
    
    convert(output) {
	if (this.parent.inClass()) {
	    this.addNewLine(output, "static ")
	} else {
	    this.addNewLine(output, "globalThis.")
	}
	this.add(output, this.cpath)
	this.add(output, " = class {")

	output.indent()
	this.add(output, this.body)
	output.unindent()
	
	this.addNewLine(output, "}")
    }
}

export class Colon2 extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.mid = tree.get(this, startLine, "nd_mid")
	this.head = tree.get(this, startLine, "nd_head")
    }

    convert(output) {
	if (this.head != undefined && this.head != "(null node)") {
	    this.add(output, this.head)
	    this.add(output, ".")
	}
	this.add(output, symbol(this.mid))
    }
}

// ::Z
export class Colon3 extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_mid")
	this.mid = line.value
    }
}

export class Super extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.args = tree.get(this, startLine, "nd_args")
    }

    convert(output) {
	this.add(output, "super")

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

export class ZSuper extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
    }

    convert(output) {
	this.add(output, "super")
    }
}

