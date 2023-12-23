import {resolveNode} from './node'
import {Artifact} from './artifact'

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
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)

	this.type = startLine.type
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_beg")
	line = tree.nextLine(line.indent)
	this.beg = resolveNode(this, tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_end")
	line = tree.nextLine(line.indent)
	this.end = resolveNode(this, tree, line)
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
}

// return 1, 2, 3
export class Values extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, tree, startLine)
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_alen")
	const alen = parseInt(line.value)

	this.array = []
	for (let i = 0; i < alen; ++i) {
	    this.array.push(tree.get(this, startLine, "nd_head"))
	}

	// For some reason, nd_heads may appear instead of nd_next (nd_alen is not the decider here)
	while (true) {
	    line = tree.nextLine(startLine.indent)
	    if (line.name == "nd_head") {
		line = tree.nextLine(line.indent)
		this.array.push(resolveNode(this, tree, line))
	    } else if (line.name == "nd_next") {
		tree.nextLine(line.indent, "(null node)")
		break
	    } else {
		throw "Unexpected attr " + this.name + " for Values"
	    }
	}
    }
}
