import {resolveNode} from './node'
import {Artifact} from './program'
import {symbol} from './literal'

export class Class extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	this.allProps = []
	this.privateProps = []
	this.protectedProps = []
	this.allClassProps = []
	this.privateClassProps = []
	this.protectedClassProps = []
	this.allMethods = []
	this.privateMethods = []
	this.protectedMethods = []
	this.publicMethods = []

	// public -> props are private, methods are public
	// private -> everything is private, starts with #
	// protected -> everything is protected, starts with _
	this.mode = "public"
	
	this.cpath  = tree.get(this, startLine, "nd_cpath")
	this.supper  = tree.get(this, startLine, "nd_super")
	this.body  = tree.get(this, startLine, "nd_body")
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

    addProperty(name) {
	name = name.slice(2) // eliminate :@
	if (this.allProps.includes(name)) {
	    return
	}

	this.allProps.push(name)
	
	switch (this.mode) {
	case "public":
	case "private":
	    this.privateProps.push(name)
	    break
	case "protected":
	    this.protectedProps.push(name)
	    break
	}
    }

    addClassProperty(name) {
	name = name.slice(3) // eliminate :@@
	if (this.allClassProps.includes(name)) {
	    return
	}

	this.allClassProps.push(name)
	
	switch (this.mode) {
	case "public":
	case "private":
	    this.privateClassProps.push(name)
	    break
	case "protected":
	    this.protectedClassProps.push(name)
	    break
	}
    }

    addMethod(name) {
	name = name.slice(1) // eliminate :
	if (this.allMethods.includes(name)) {
	    return
	}

	this.allMethods.push(name)
	
	switch (this.mode) {
	case "public":
	    this.publicMethods.push(name)
	    break
	case "private":
	    this.privateMethods.push(name)
	    break
	case "protected":
	    this.protectedMethods.push(name)
	    break
	}
    }

    getProperty(name) {
	if (this.privateProps.includes(name)) {
	    return "#" + name
	} else if (this.protectedProps.includes(name)) {
	    return "_" + name
	}
    }

    getClassProperty(name) {
	if (this.privateClassProps.includes(name)) {
	    return "#" + name
	} else if (this.protectedClassProps.includes(name)) {
	    return "_" + name
	}
    }

    getMethod(name) {
	if (this.publicMethods.includes(name)) {
	    return name
	} else if (this.privateMethods.includes(name)) {
	    return "#" + name
	} else if (this.protectedMethods.includes(name)) {
	    return "_" + name
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

