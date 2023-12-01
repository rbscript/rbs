import {resolveNode} from './node'
import {Artifact} from './artifact'
import {Literal, symbol} from './literal'
import {Return} from './statements'
import {Call} from './operators'
import {Block} from './blocks'

export class LocalAssignment extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	this.vid = tree.get(this, startLine, "nd_vid")
	this.value = tree.get(this, startLine, "nd_value")
    }

    convert(output) {
	this.add(output, this.determine() + symbol(this.vid)) // determine if const or let or nothing
	this.add(output, " ")
	
	if (!(this.value instanceof Call) ||
	    this.value.mid == ":new") {

	    // Normal assignment
	    //
	    this.add(output, "= ")
	    this.add(output, this.value)
	    
	} else {

	    // This is an assignment like x += 1
	    //
	    this.add(output, this.value.mid.slice(1)) // :+
	    this.add(output, "= ")

	    // For some reason, args is a list with one element
	    this.add(output, this.value.args.array[0])
	}
    }

    determine() { // const or let or nothing

	let result
	
	if (!(this.parent instanceof Block)) { // Sometimes there is single stm under If etc.
	    let block = this.parent.parent
	    while (block != undefined) {
		if (block instanceof Block) {
		    result = block.findLocalVar(this, false)
		}
		block = block.parent
	    }
	    if (result == undefined) {
		result = 0
	    }
	} else {
	    // Common case when the parent is a block
	    //
	    result = this.parent.findLocalVar(this, true)
	}

	switch (result) {
	case 0: return "const "
	case -1: return ""
	case 1: return "let "
	}
    }

    findLocalVar(la) {
	if (this.vid == la.vid) {
	    return 1
	} else {
	    return 0
	}
    }
}

export class MemberAssignment extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.vid = tree.get(this, startLine, "nd_vid")
	this.value = tree.get(this, startLine, "nd_value")

	const owner = this.findOwner()
	owner.addProperty(this, this.vid)
    }

    convert(output) {
	const owner = this.findOwner()
	const name = symbol(owner.getProperty(this.vid.slice(2)).jsName)

	if (this.inClass()) {
	    this.add(output, name)
	} else {
	    this.add(output, "this." + name)
	}
	this.add(output, " = ")
	this.add(output, this.value)
    }
}

export class ClassVarAssignment extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_vid")
	this.name = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_value")
	line = tree.nextLine(line.indent)
	this.value = resolveNode(this, tree, line)
    }
}

// https://www.rubydoc.info/gems/ruby-internal/Node/DASGN
export class DynamicAssignment extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_vid")
	this.name = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_value")
	line = tree.nextLine(line.indent)
	this.value = resolveNode(this, tree, line)
    }
}

// https://www.rubydoc.info/gems/ruby-internal/Node/DASGN_CURR
export class DynamicAssignmentCurrent extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	this.vid = tree.get(this, startLine, "nd_vid")
	this.value = tree.get(this, startLine, "nd_value")
    }
}


export class ConstDecl extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.vid = tree.get(this, startLine, "nd_vid")
	this.els = tree.get(this, startLine, "nd_else") // TODO What the fuck??
	this.value = tree.get(this, startLine, "nd_value")
    }

    convert(output) {
	this.add(output, this.vid)
	this.add(output, " = ")
	this.add(output, this.value)
    }
}

export class GlobalAssignment extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_entry")
	this.name = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_value")
	line = tree.nextLine(line.indent)
	this.value = resolveNode(this, tree, line)
    }
}

export class MultiAssignment extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.value = tree.get(this, startLine, "nd_value")
	this.head = tree.get(this, startLine, "nd_head")
	this.args = tree.get(this, startLine, "nd_args")
    }
}



export class LocalVariable extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.vid = tree.get(this, startLine, "nd_vid")
    }

    convert(output) {
	this.add(output, symbol(this.vid))
    }

    returnize(tree) {
	return Return.ize(tree, this)
    }
}

export class DynamicVariable extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.vid = tree.get(this, startLine, "nd_vid")
    }

    returnize(tree) {
	return Return.ize(tree, this)
    }
}


export class GlobalVariable extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_entry")
	this.name = line.value
    }

    returnize(tree) {
	return Return.ize(tree, this)
    }
}

export class MemberVariable extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.vid = tree.get(this, startLine, "nd_vid")

	const owner = this.findOwner()
	owner.addProperty(this, this.vid)
    }

    returnize(tree) {
	return Return.ize(tree, this)
    }

    convert(output) {
	const owner = this.findOwner()
	if (this.inClass()) {
	    this.add(output, symbol(owner.getProperty(this.vid.slice(2)).jsName))
	} else {
	    this.add(output, "this." + symbol(owner.getProperty(this.vid.slice(2)).jsName))
	}
    }
}

export class ClassVariable extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_vid")
	this.name = line.value
    }

    returnize(tree) {
	return Return.ize(tree, this)
    }

}

export class Const extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)

	this.vid = tree.get(this, startLine, "nd_vid")
    }

    get name() {
	return this.vid
    }
    
    convert(output) {
	this.add(output, symbol(this.vid))
    }
}

export class Nil extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
    }

    convert(output) {
	this.add(output, "undefined")
    }

    returnize(tree) {
	return Return.ize(tree, this)
    }

}

export class True extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
    }

    convert(output) {
	this.add(output, "true")
    }

    returnize(tree) {
	return Return.ize(tree, this)
    }

}

export class False extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
    }

    convert(output) {
	this.add(output, "false")
    }

    returnize(tree) {
	return Return.ize(tree, this)
    }
}

export class Alias extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	this.first = tree.get(this, startLine, "nd_1st")
	this.second = tree.get(this, startLine, "nd_2nd")
    }
}

export class AttributeAssignment extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_recv")
	line = tree.nextLine(line.indent)
	this.recv = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_mid")
	this.mid = line.value

	line = tree.nextLine(startLine.indent, "attr", "nd_args")
	line = tree.nextLine(line.indent)
	this.args = resolveNode(this, tree, line)
    }
}

