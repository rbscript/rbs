import {resolveNode} from './node'

export class List {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_alen")
	const alen = parseInt(line.value)

	this.array = []
	for (let i = 0; i < alen; ++i) {
	    line = tree.nextLine(startLine.indent, "attr", "nd_head")
	    line = tree.nextLine(line.indent)
	    this.array.push(resolveNode(tree, line))
	}

	// For some reason, nd_heads may appear instead of nd_next (nd_alen is not the decider here)
	while (true) {
	    line = tree.nextLine(startLine.indent)
	    if (line.name == "nd_head") {
		line = tree.nextLine(line.indent)
		this.array.push(resolveNode(tree, line))
	    } else if (line.name == "nd_next") {
		tree.nextLine(line.indent, "(null node)")
		break
	    } else {
		throw "Unexpected attr " + this.name + " for List"
	    }
	}
    }
}

export class Args {
    constructor(tree, startLine) {
	this.location = startLine.location

	tree.nextLine(startLine.indent, "attr", "nd_ainfo->pre_args_num")
	let line = tree.nextLine(startLine.indent, "attr", "nd_ainfo->pre_init")
	line = tree.nextLine(line.indent)
	this.preInit = resolveNode(tree, line)

	tree.nextLine(startLine.indent, "attr", "nd_ainfo->post_args_num")
	line = tree.nextLine(startLine.indent, "attr", "nd_ainfo->post_init")
	line = tree.nextLine(line.indent)
	this.postInit = resolveNode(tree, line)

	tree.nextLine(startLine.indent, "attr", "nd_ainfo->first_post_arg")
	tree.nextLine(startLine.indent, "attr", "nd_ainfo->rest_arg")
	tree.nextLine(startLine.indent, "attr", "nd_ainfo->block_arg")

	line = tree.nextLine(startLine.indent, "attr", "nd_ainfo->opt_args")
	line = tree.nextLine(line.indent)
	this.optArgs = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_ainfo->kw_args")
	line = tree.nextLine(line.indent)
	this.kwArgs = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_ainfo->kw_rest_arg")
	line = tree.nextLine(line.indent)
	this.kwRestArgs = resolveNode(tree, line)
    }
}

export class Range {
    constructor(tree, startLine) {
	this.location = startLine.location

	this.type = startLine.type
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_beg")
	line = tree.nextLine(line.indent)
	this.beg = resolveNode(tree, line)

	line = tree.nextLine(startLine.indent, "attr", "nd_end")
	line = tree.nextLine(line.indent)
	this.end = resolveNode(tree, line)
    }
}

export class Splat {
    constructor(tree, startLine) {
	this.location = startLine.location

	this.type = startLine.type
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.head = resolveNode(tree, line)
    }
}

// []
export class ZList {
    constructor(tree, startLine) {
	this.location = startLine.location
    }
}
