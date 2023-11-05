import {Scope, Begin, Block, Yield, Iter, BlockPass} from './blocks'
import {Literal} from './literal'
import {String, DynamicString, EvalString, Match, Match2, Match3, XString} from './string'
import {OpCall} from './operators'
import {FuncCall, VarCall, Method, ClassMethod, Lambda, Call, Undefine, QCall,
	OptionalArgument, KeywordArgument} from './methods'
import {List, Args, Range, Splat} from './lists'
import {Hash, HashPattern} from './hashes'
import {LocalAssignment, GlobalAssignment, ClassVarAssignment, MemberAssignment, MultiAssignment,
	ConstDecl, LocalVariable, GlobalVariable, MemberVariable, AttributeAssignment,
	ClassVariable, DynamicVariable, Const, Nil, True, False, Alias} from './variables'
import {If, Unless, Return, For, While, Until, Case, Break, Next, Redo} from './statements'
import {Class, Self, Singleton, Module, Colon2, Colon3, Super, ZSuper} from './classes'
import {Ensure, Rescue, RescueBody, Retry} from './exceptions'

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
    case "NODE_BLOCK_PASS":
	return new BlockPass(tree, line)
    case "NODE_ITER":
	return new Iter(tree, line)
    case "NODE_LIT":
	return new Literal(tree, line)
    case "NODE_STR":
	return new String(tree, line)
    case "NODE_XSTR":
	return new XString(tree, line)
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
    case "NODE_QCALL":
	return new QCall(tree, line)
    case "NODE_LIST":
	return new List(tree, line)
    case "NODE_SPLAT":
	return new Splat(tree, line)
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
	return new Args(tree, line)
    case "NODE_OPT_ARG":
	return new OptionalArgument(tree, line)
    case "NODE_KW_ARG":
	return new KeywordArgument(tree, line)
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
    case "NODE_UNDEF":
	return new Undefine(tree, line)
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
    case "NODE_YIELD":
	return new Yield(tree, line)
    case "NODE_ALIAS":
	return new Alias(tree, line)
    case "NODE_MODULE":
	return new Module(tree, line)
    case "NODE_COLON2":
	return new Colon2(tree, line)
    case "NODE_COLON3":
	return new Colon3(tree, line)
    case "NODE_ENSURE":
	return new Ensure(tree, line)
    case "NODE_RESCUE":
	return new Rescue(tree, line)
    case "NODE_RESBODY":
	return new RescueBody(tree, line)
    case "NODE_RETRY":
	return new Retry(tree, line)
    case "NODE_SUPER":
	return new Super(tree, line)
    case "NODE_ZSUPER":
	return new ZSuper(tree, line)
    case "NODE_ATTRASGN":
	return new AttributeAssignment(tree, line)
    default:
	throw "Unexpected line " + line
    }
}
