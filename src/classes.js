import {resolveNode} from './node'
import {Artifact} from './program'
import {symbol} from './literal'

export class Class extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	this.props = {}
	this.methods = {}
	this.classProps = {}
	this.classMethods = {}

	// public -> props are private, methods are public
	// private -> everything is private, starts with #
	// protected -> everything is protected, starts with _
	this.mode = "public"
	
	this.cpath  = tree.get(this, startLine, "nd_cpath")
	this.supper  = tree.get(this, startLine, "nd_super")
	this.body  = tree.get(this, startLine, "nd_body")

	this.addClass(this)
    }

    get name() {
	return this.cpath.mid
    }
    
    convert(output) {
	this.add(output, "class ")
	this.add(output, this.cpath)
	if (this.supper != undefined) {
	    this.add(output, " extends ")
	    this.add(output, this.supper)
	}
	this.add(output, " {")
	output.addLine()

	this.add(output, this.body)

	this.addNewLine(output, "}")
    }

    findOwner() {
	return this
    }

    changeMode(mode) {
	this.mode = mode
    }

    inClass() {
	return true
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

    get superClass() {
	return this.getClass(this.supper.name)
    }
    
    
    addClassProperty(artifact, name) {
	name = name.slice(3) // eliminate :@@
	if (this.getClassProp(name) != undefined) {
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
	    }
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


export class Self extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
    }
}

export class Singleton extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_recv")
	line = tree.nextLine(line.indent)
	this.recv = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)
    }
}

export class Module extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_cpath")
	line = tree.nextLine(line.indent)
	this.cpath  = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_body")
	line = tree.nextLine(line.indent)
	this.body = resolveNode(this, tree, line)
    }

    findOwner() {
	return this
    }
}

export class Colon2 extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.mid = tree.get(this, startLine, "nd_mid")
	this.head = tree.get(this, startLine, "nd_head")
    }

    convert(output) {
	if (this.head != undefined) {
	    this.add(output, symbol(this.head))
	    this.add(output, "::")
	}
	this.add(output, symbol(this.mid))
    }
}

// ::Z
export class Colon3 extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	let line = tree.nextLine(startLine.indent, "attr", "nd_mid")
	this.mid = line.value
    }
}

export class Super extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

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
	super(parent, startLine)
    }
}

