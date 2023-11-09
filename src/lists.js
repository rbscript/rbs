import {resolveNode} from './node'

export class List {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	const alen = parseInt(tree.get(startLine, "nd_alen"))

	this.array = []
	for (let i = 0; i < alen; ++i) {
	    this.array.push(tree.get(startLine, "nd_head"))
	}



	// For some reason, nd_heads may appear instead of nd_next (nd_alen is not the decider here)
	while (true) {
	    let line = tree.nextLine(startLine.indent)
	    if (line == undefined) {
		break
	    }
	    if (line.name == "nd_head") {
		line = tree.nextLine(line.indent)
		this.array.push(resolveNode(tree, line))
	    } else if (line.name == "nd_next") {
		line = tree.nextLine(line.indent)
		this.next = resolveNode(tree, line)
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

	this.preArgsNum = tree.get(startLine, "nd_ainfo->pre_args_num")
	this.preInit = tree.get(startLine, "nd_ainfo->pre_init")
	this.postArgsNum = tree.get(startLine, "nd_ainfo->post_args_num")
	this.postInit = tree.get(startLine, "nd_ainfo->post_init")

	this.firstPostArg = tree.get(startLine, "nd_ainfo->first_post_arg")
	this.restArg = tree.get(startLine, "nd_ainfo->rest_arg")
	this.blockArg = tree.get(startLine, "nd_ainfo->block_arg")

	this.optArgs = tree.get(startLine, "nd_ainfo->opt_args")
	this.kwArgs = tree.get(startLine, "nd_ainfo->kw_args")
	this.kwRestArgs = tree.get(startLine, "nd_ainfo->kw_rest_arg")
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

// return 1, 2, 3
export class Values {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_alen")
	const alen = parseInt(line.value)

	this.array = []
	for (let i = 0; i < alen; ++i) {
	    this.array.push(tree.get(startLine, "nd_head"))
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
		throw "Unexpected attr " + this.name + " for Values"
	    }
	}
    }
}
