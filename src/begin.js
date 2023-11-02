import {Body} from './body'

export class Begin {
    constructor(tree, startLine) {
	this.location = startLine.location
	const line = tree.nextLine(startLine.indent, "attr", "nd_body")
	this.body = new Body(tree, line)
    }
}
