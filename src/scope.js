import {Body} from './body'

export class Scope {
    constructor(tree, startLine) {
	
	this.location = startLine.location

	const indent = startLine.indent 
	
	// nd_tbl: (empty)
	tree.nextLine(indent, "attr", "nd_tbl")

	// # +- nd_args:
        // # |   (null node)
	tree.nextLine(indent, "attr", "nd_args")
	tree.nextLine(indent, "(null node)")

	// # +- nd_body:
	const line = tree.nextLine(indent, "attr", "nd_body")

	this.body = new Body(tree, line)
	
    }
}
