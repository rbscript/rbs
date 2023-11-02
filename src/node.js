import {Begin} from './begin'
import {Literal} from './literal'
import {String} from './string'
import {OpCall} from './operators'
import {FuncCall} from './methods'
import {List} from './lists'

export function resolveNode(tree, line) {
    switch (line.type) {
    case "(null node)":
	return undefined// Nothing here
    case "NODE_BEGIN":
	return new Begin(tree, line)
    case "NODE_LIT":
	return new Literal(tree, line)
    case "NODE_STR":
	return new String(tree, line)
    case "NODE_OPCALL":
	return new OpCall(tree, line)
    case "NODE_FCALL":
	return new FuncCall(tree, line)
    case "NODE_LIST":
	return new List(tree, line)
    default:
	throw "Unexpected line " + line
    }
}
