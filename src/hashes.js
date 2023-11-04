import {resolveNode} from './node'
import {List} from './lists'

export class Hash {
    constructor(tree, startLine) {
	this.location = startLine.location
	
	let line = tree.nextLine(startLine.indent, "attr", "nd_brace")
	this.brace = line.value // What is brace?

	line = tree.nextLine(startLine.indent, "attr", "nd_head")
	line = tree.nextLine(line.indent)
	this.list = new List(tree, line)
    }
}
