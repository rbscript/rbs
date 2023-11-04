import {Scope, Begin, Block} from './blocks'
import {Literal} from './literal'
import {String, DynamicString, EvalString, Match, Match2, Match3} from './string'
import {OpCall} from './operators'
import {FuncCall, VarCall, Method, ClassMethod, Lambda, Call} from './methods'
import {List, ForArgs, Range} from './lists'
import {Hash, HashPattern} from './hashes'
import {LocalAssignment, GlobalAssignment, ClassVarAssignment, MemberAssignment, MultiAssignment,
	ConstDecl, LocalVariable, GlobalVariable, MemberVariable,
	ClassVariable, DynamicVariable, Const, Nil, True, False} from './variables'
import {If, Unless, Return, For, While, Until, Case, Break, Next, Redo} from './statements'
import {Class, Self, Singleton} from './classes'

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
    case "NODE_DSTR":
	return new DynamicString(tree, line)
    case "NODE_EVSTR":
	return new EvalString(tree, line)
    case "NODE_OPCALL":
	return new OpCall(tree, line)
    case "NODE_FCALL":
	return new FuncCall(tree, line)
    case "NODE_VCALL":
	return new VarCall(tree, line)
    case "NODE_CALL":
	return new Call(tree, line)
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
    case "NODE_MASGN":
	return new MultiAssignment(tree, line)
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
    case "NODE_CONST":
	return new Const(tree, line)
    case "NODE_IF":
	return new If(tree, line)
    case "NODE_UNLESS":
	return new Unless(tree, line)
    case "NODE_RETURN":
	return new Return(tree, line)
    case "NODE_BREAK":
	return new Break(tree, line)
    case "NODE_NEXT":
	return new Next(tree, line)
    case "NODE_REDO":
	return new Redo(tree, line)
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
    case "NODE_CASE3":
	return new Case(tree, line)
    case "NODE_CLASS":
	return new Class(tree, line)
    case "NODE_SCLASS":
	return new Singleton(tree, line)
    case "NODE_SELF":
	return new Self(tree, line)
    case "NODE_DEFN":
	return new Method(tree, line)
    case "NODE_DEFS":
	return new ClassMethod(tree, line)
    case "NODE_LAMBDA":
	return new Lambda(tree, line)
    case "NODE_NIL":
	return new Nil(tree, line)
    case "NODE_TRUE":
	return new True(tree, line)
    case "NODE_FALSE":
	return new False(tree, line)
    case "NODE_HASH":
	return new Hash(tree, line)
    case "NODE_HSHPTN":
	return new HashPattern(tree, line)
    case "NODE_DOT2":
    case "NODE_DOT3":
	return new Range(tree, line)
    case "NODE_MATCH":
	return new Match(tree, line)
    case "NODE_MATCH2":
	return new Match2(tree, line)
    case "NODE_MATCH3":
	return new Match3(tree, line)
    default:
	throw "Unexpected line " + line
    }
}
