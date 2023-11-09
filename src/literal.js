
export class Literal {
    constructor(tree, startLine) {
	this.location = startLine.location
	const line = tree.nextLine(startLine.indent, "attr", "nd_lit")
	this.value = line.value
    }
}

export class DynamicSymbol {
    constructor(tree, startLine) {
	this.location = startLine.location

	this.lit = tree.get(startLine, "nd_lit")
	this.head = tree.get(startLine, "nd_next->nd_head")
	this.next = tree.get(startLine, "nd_next->nd_next")
    }
}
