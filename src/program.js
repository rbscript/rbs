import {Scope} from './blocks'

export class Program {
    constructor(tree) {
	let line = tree.nextLine(0, "NODE_SCOPE")
	this.scope = new Scope(tree, line)
    }
}
