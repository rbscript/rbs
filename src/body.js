import {resolveNode} from './node'

export class Body {
    constructor(tree, startLine) {

	this.children = []
	
	let line = tree.nextLine()
	const indent = line.indent
	do {
	    let nev = resolveNode(tree, line)
	    if (nev == undefined) {
		return
	    }
	    this.children.push(nev)
	    
	} while (line = tree.nextLine(indent))
    }
}
