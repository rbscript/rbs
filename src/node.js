import {Scope, Begin, Block} from './blocks'
import {Literal} from './literal'
import {String} from './string'
import {OpCall} from './operators'
import {FuncCall, VarCall} from './methods'
import {List, ForArgs} from './lists'
import {LocalAssignment, GlobalAssignment, ClassVarAssignment, MemberAssignment,
	ConstDecl, LocalVariable, GlobalVariable, MemberVariable,
	ClassVariable, DynamicVariable} from './variables'
import {If, Unless, Return, For, While, Until, Case} from './statements'


export function resolveNode(tree, line) {
    switch (line.type) {
    case "(null node)":
	return undefined// Nothing here
    case "NODE_SCOPE":
	return new Scope(tree, line)
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
    case "NODE_VCALL":
	return new VarCall(tree, line)
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
    case "NODE_DVAR":
	return new DynamicVariable(tree, line)
    case "NODE_IF":
	return new If(tree, line)
    case "NODE_UNLESS":
	return new Unless(tree, line)
    case "NODE_RETURN":
	return new Return(tree, line)
    case "NODE_FOR":
	return new For(tree, line)
    case "NODE_ARGS":
	return new ForArgs(tree, line)
    case "NODE_WHILE":
	return new While(tree, line)
    case "NODE_UNTIL":
	return new Until(tree, line)
    case "NODE_CASE":
    case "NODE_CASE2":
	return new Case(tree, line)
    default:
	throw "Unexpected line " + line
    }
}
