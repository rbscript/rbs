import {Begin, Block} from './blocks'
import {Literal} from './literal'
import {String} from './string'
import {OpCall} from './operators'
import {FuncCall} from './methods'
import {List} from './lists'
import {LocalAssignment, ConstDecl, GlobalAssignment, ClassVarAssignment,MemberAssignment,
	LocalVariable, GlobalVariable, MemberVariable, ClassVariable} from './variables'

export function resolveNode(tree, line) {
    switch (line.type) {
    case "(null node)":
	return undefined// Nothing here
    case "NODE_BEGIN":
	return new Begin(tree, line)
    case "NODE_BLOCK":
	return new Block(tree, line)
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
    case "NODE_LASGN":
	return new LocalAssignment(tree, line)
    case "NODE_IASGN":
	return new MemberAssignment(tree, line)
    case "NODE_CVASGN":
	return new ClassVarAssignment(tree, line)
    case "NODE_GASGN":
	return new GlobalAssignment(tree, line)
    case "NODE_CDECL":
	return new ConstDecl(tree, line)
    case "NODE_LVAR":
	return new LocalVariable(tree, line)
    case "NODE_GVAR":
	return new GlobalVariable(tree, line)
    case "NODE_IVAR":
	return new MemberVariable(tree, line)
    case "NODE_CVAR":
	return new ClassVariable(tree, line)
    default:
	throw "Unexpected line " + line
    }
}
