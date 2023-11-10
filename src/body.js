import {resolveNode} from './node'
import {Artifact} from './program'

export class Body extends Artifact {
    constructor(parent, tree, startLine) {
	super(parent, startLine)
	
	this.children = []
	
	let line = tree.nextLine()
	const indent = line.indent
	do {
	    let nev = resolveNode(this, tree, line)
	    if (nev == undefined) {
		return
	    }
	    this.children.push(nev)
	    
	} while (line = tree.nextLine(indent))
    }
}
