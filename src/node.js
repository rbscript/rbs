import {Scope, Block, Yield, BlockPass} from './blocks'
import {Literal, DynamicSymbol} from './literal'
import {String, DynamicString, EvalString, XString, DXString,
	Match, Match2, Match3, NthRef, DynamicRegExp, BackRef} from './string'
import {OpCall, OpAnd, OpOr, AssignAnd, AssignOr, OpAssignAnd, OpAssignOr,
	OpAssign1, OpAssign2, Defined, Call} from './operators'
import {FuncCall, VarCall, Defn, ClassMethod, Lambda, Undefine, 
	OptionalArgument, KeywordArgument, ArgsPush, ArgsCat, PostArg} from './methods'
import {List, Args, Range, Splat, ZList, Values} from './lists'
import {Hash, HashPattern} from './hashes'
import {LocalAssignment, GlobalAssignment, ClassVarAssignment, MemberAssignment,
	MultiAssignment, AttributeAssignment, DynamicAssignment, DynamicAssignmentCurrent,
	LocalVariable, GlobalVariable, MemberVariable, ClassVariable, DynamicVariable,
	ConstDecl, Const, Nil, True, False, Alias} from './variables'
import {If, Unless, Return, For, While, Until, Case, Break, Next, Redo,
	Begin, Iter} from './statements'
import {Class, Self, Singleton, Module, Colon2, Colon3, Super, ZSuper} from './classes'
import {Ensure, Rescue, RescueBody, Retry, ErrInfo} from './exceptions'

export function resolveNode(parent, tree, line) {
    if (line == undefined) {
	console.trace()
	throw "Line is undefined for resolveNode(). Lineno=" + tree.lineno
    }
    tree.lastNodeType = line.type
    switch (line.type) {
    case "(null node)":
	return undefined// Nothing here
    case "NODE_SCOPE":
	return new Scope(parent, tree, line)
    case "NODE_BEGIN":
	return new Begin(parent, tree, line)
    case "NODE_BLOCK":
	return new Block(parent, tree, line)
    case "NODE_BLOCK_PASS":
	return new BlockPass(parent, tree, line)
    case "NODE_ITER":
	return new Iter(parent, tree, line)
    case "NODE_LIT":
	return new Literal(parent, tree, line)
    case "NODE_DSYM":
	return new DynamicSymbol(parent, tree, line)
    case "NODE_STR":
	return new String(parent, tree, line)
    case "NODE_XSTR":
	return new XString(parent, tree, line)
    case "NODE_DXSTR":
	return new DXString(parent, tree, line)
    case "NODE_DSTR":
	return new DynamicString(parent, tree, line)
    case "NODE_EVSTR":
	return new EvalString(parent, tree, line)
    case "NODE_CALL":
	return new Call(parent, tree, line, false)
    case "NODE_OPCALL":
	return new OpCall(parent, tree, line)
    case "NODE_AND":
	return new OpAnd(parent, tree, line)
    case "NODE_OR":
	return new OpOr(parent, tree, line)
    case "NODE_ASGN_AND":
	return new AssignAnd(parent, tree, line)
    case "NODE_ASGN_OR":
	return new AssignOr(parent, tree, line)
    case "NODE_OP_ASGN_AND":
	return new OpAssignAnd(parent, tree, line)
    case "NODE_OP_ASGN_OR":
	return new OpAssignOr(parent, tree, line)
    case "NODE_OP_ASGN1":
	return new OpAssign1(parent, tree, line)
    case "NODE_OP_ASGN2":
	return new OpAssign2(parent, tree, line)
    case "NODE_DEFINED":
	return new Defined(parent, tree, line)
    case "NODE_FCALL":
	return new FuncCall(parent, tree, line)
    case "NODE_VCALL":
	return new VarCall(parent, tree, line)
    case "NODE_QCALL":
	return new Call(parent, tree, line, true)
    case "NODE_LIST":
	return new List(parent, tree, line)
    case "NODE_SPLAT":
	return new Splat(parent, tree, line)
    case "NODE_ZLIST":
	return new ZList(parent, tree, line)
    case "NODE_VALUES":
	return new Values(parent, tree, line)
    case "NODE_LASGN":
	return new LocalAssignment(parent, tree, line)
    case "NODE_IASGN":
	return new MemberAssignment(parent, tree, line)
    case "NODE_CVASGN":
	return new ClassVarAssignment(parent, tree, line)
    case "NODE_GASGN":
	return new GlobalAssignment(parent, tree, line)
    case "NODE_MASGN":
	return new MultiAssignment(parent, tree, line)
    case "NODE_CDECL":
	return new ConstDecl(parent, tree, line)
    case "NODE_LVAR":
	return new LocalVariable(parent, tree, line)
    case "NODE_GVAR":
	return new GlobalVariable(parent, tree, line)
    case "NODE_IVAR":
	return new MemberVariable(parent, tree, line)
    case "NODE_CVAR":
	return new ClassVariable(parent, tree, line)
    case "NODE_DVAR":
	return new DynamicVariable(parent, tree, line)
    case "NODE_DASGN":
	return new DynamicAssignment(parent, tree, line)
    case "NODE_DASGN_CURR":
	return new DynamicAssignmentCurrent(parent, tree, line)
    case "NODE_CONST":
	return new Const(parent, tree, line)
    case "NODE_IF":
	return new If(parent, tree, line)
    case "NODE_UNLESS":
	return new Unless(parent, tree, line)
    case "NODE_RETURN":
	return new Return(parent, tree, line)
    case "NODE_BREAK":
	return new Break(parent, tree, line)
    case "NODE_NEXT":
	return new Next(parent, tree, line)
    case "NODE_REDO":
	return new Redo(parent, tree, line)
    case "NODE_FOR":
	return new For(parent, tree, line)
    case "NODE_ARGS":
	return new Args(parent, tree, line)
    case "NODE_OPT_ARG":
	return new OptionalArgument(parent, tree, line)
    case "NODE_KW_ARG":
	return new KeywordArgument(parent, tree, line)
    case "NODE_WHILE":
	return new While(parent, tree, line)
    case "NODE_UNTIL":
	return new Until(parent, tree, line)
    case "NODE_CASE":
    case "NODE_CASE2":
    case "NODE_CASE3":
	return new Case(parent, tree, line)
    case "NODE_CLASS":
	return new Class(parent, tree, line)
    case "NODE_SCLASS":
	return new Singleton(parent, tree, line)
    case "NODE_SELF":
	return new Self(parent, tree, line)
    case "NODE_DEFN":
	return new Defn(parent, tree, line)
    case "NODE_DEFS":
	return new ClassMethod(parent, tree, line)
    case "NODE_UNDEF":
	return new Undefine(parent, tree, line)
    case "NODE_LAMBDA":
	return new Lambda(parent, tree, line)
    case "NODE_NIL":
	return new Nil(parent, tree, line)
    case "NODE_TRUE":
	return new True(parent, tree, line)
    case "NODE_FALSE":
	return new False(parent, tree, line)
    case "NODE_HASH":
	return new Hash(parent, tree, line)
    case "NODE_HSHPTN":
	return new HashPattern(parent, tree, line)
    case "NODE_DOT2":
    case "NODE_DOT3":
	return new Range(parent, tree, line)
    case "NODE_MATCH":
	return new Match(parent, tree, line)
    case "NODE_MATCH2":
	return new Match2(parent, tree, line)
    case "NODE_MATCH3":
	return new Match3(parent, tree, line)
    case "NODE_NTH_REF":
	return new NthRef(parent, tree, line)
    case "NODE_DREGX":
	return new DynamicRegExp(parent, tree, line)
    case "NODE_BACK_REF":
	return new BackRef(parent, tree, line)
    case "NODE_YIELD":
	return new Yield(parent, tree, line)
    case "NODE_ALIAS":
	return new Alias(parent, tree, line)
    case "NODE_MODULE":
	return new Module(parent, tree, line)
    case "NODE_COLON2":
	return new Colon2(parent, tree, line)
    case "NODE_COLON3":
	return new Colon3(parent, tree, line)
    case "NODE_ENSURE":
	return new Ensure(parent, tree, line)
    case "NODE_RESCUE":
	return new Rescue(parent, tree, line)
    case "NODE_RESBODY":
	return new RescueBody(parent, tree, line)
    case "NODE_RETRY":
	return new Retry(parent, tree, line)
    case "NODE_ERRINFO":
	return new ErrInfo(parent, tree, line)
    case "NODE_SUPER":
	return new Super(parent, tree, line)
    case "NODE_ZSUPER":
	return new ZSuper(parent, tree, line)
    case "NODE_ATTRASGN":
	return new AttributeAssignment(parent, tree, line)
    case "NODE_ARGSPUSH":
	return new ArgsPush(parent, tree, line)
    case "NODE_ARGSCAT":
	return new ArgsCat(parent, tree, line)
    case "NODE_POSTARG":
	return new PostArg(parent, tree, line)
    default:
	throw "Unexpected line " + line
    }
}
