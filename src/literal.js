
export class Literal {
    constructor(tree, startLine) {
	this.location = startLine.location
	const line = tree.nextLine(startLine.indent, "attr", "nd_lit")
	this.value = line.value
    }
}
