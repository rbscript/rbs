import {resolveNode} from './node'
import {Artifact} from './artifact'
import {Return} from './statements'

export class List extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
	
	const alen = parseInt(tree.get(this, startLine, "nd_alen"))

	this.array = []
	for (let i = 0; i < alen; ++i) {
	    this.array.push(tree.get(this, startLine, "nd_head"))
	}

	// For some reason, nd_heads may appear instead of nd_next (nd_alen is not the decider here)
	while (true) {
	    let line = tree.nextLine(startLine.indent)
	    if (line == undefined) {
		break
	    }
	    if (line.name == "nd_head") {
		line = tree.nextLine(line.indent)
		this.array.push(resolveNode(this, tree, line))
	    } else if (line.name == "nd_next") {
		line = tree.nextLine(line.indent)
		this.next = resolveNode(this, tree, line)
		break
	    } else {
		throw "Unexpected attr " + this.name + " for List"
	    }
	}
    }

    convert(output) {
	this.add(output, "[")
	let first = true
	for (const elem of this.array) {
	    if (first) {
		first = false
	    } else {
		this.add(output, ", ")
	    }
	    this.add(output, elem)
	}
	this.add(output, "]")
    }

    returnize(tree) {
	return Return.ize(tree, this)
    }
}

export class Args extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.preArgsNum = tree.get(this, startLine, "nd_ainfo->pre_args_num")
	this.preInit = tree.get(this, startLine, "nd_ainfo->pre_init")
	this.postArgsNum = tree.get(this, startLine, "nd_ainfo->post_args_num")
	this.postInit = tree.get(this, startLine, "nd_ainfo->post_init")

	this.firstPostArg = tree.get(this, startLine, "nd_ainfo->first_post_arg")
	this.restArg = tree.get(this, startLine, "nd_ainfo->rest_arg")
	this.blockArg = tree.get(this, startLine, "nd_ainfo->block_arg")

	this.optArgs = tree.get(this, startLine, "nd_ainfo->opt_args")
	this.kwArgs = tree.get(this, startLine, "nd_ainfo->kw_args")
	this.kwRestArg = tree.get(this, startLine, "nd_ainfo->kw_rest_arg")
    }
}

export class Range extends Artifact {
    constructor(parent, tree, startLine, exclude) {
	super(parent, tree, startLine)

	this.beg = tree.get(this, startLine, "nd_beg")
	this.end = tree.get(this, startLine, "nd_end")
	this.exclude = exclude
    }

    convert(output) {
	const beg = output.genVar("beg")
	const end = output.genVar("end")

	this.add(output, "(() => {")
	output.indent()

	this.addNewLine(output, "const ")
	this.add(output, beg)
	this.add(output, " = ")
	if (this.beg == undefined || this.beg.constructor.name == "Nil") {
	    this.add(output, "0")
	} else {
	    this.add(output, this.beg)
	}

	this.addNewLine(output, "const ")
	this.add(output, end)
	this.add(output, " = ")
	if (this.exclude) {
	    this.add(output, this.end)
	} else {
	    this.add(output, "(")
	    this.add(output, this.end)
	    this.add(output, ") + 1")
	}

	// Array.from({length: 5}, (_, i) => 0 + i)
	this.addNewLine(output, "return Array.from({length: ")
	this.add(output, end)
	this.add(output, " - ")
	this.add(output, beg)

	const i = output.genVar("i")
	this.add(output, "}, (_, ")
	this.add(output, i)
	this.add(output, ") => ")
	this.add(output, beg)
	this.add(output, " + ")
	this.add(output, i)
	this.add(output, ")")
	
	output.unindent()
	this.addNewLine(output, "})()")
    }
    
    convertBare(output) {
	this.add(output, this.beg)
	this.add(output, ", ")
	
	if (this.exclude || this.end == undefined || this.end.constructor.name == "Nil") {
	    this.add(output, this.end)
	} else {
	    this.add(output, "(")
	    this.add(output, this.end)
	    this.add(output, ") + 1")
	}
    }
}

export class Splat extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.type = startLine.type
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(this, tree, line)
    }
}

// []
export class ZList extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
    }

    convert(output) {
	this.add(output, "[]")
    }
}

export class Values extends List {
    convert(output) {
	this.addNewLine(output, "return ")
	super.convert(output)
    }

    returnize(tree) {
	return this
    }
}
