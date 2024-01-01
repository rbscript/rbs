import {describe, expect, test} from '@jest/globals'
import {createSource} from './utils'
import parseSource from '../src/rbs-loader'

test("simple if", () => {
    const src = createSource(
	"if a == 5",
	"  b = 3 + 5",
	"end"
    )
    const out = parseSource(src)

    const out2 = createSource(
	"if (a == 5) {",
	"  const b = 3 + 5",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("simple if with two statements", () => {
    const src = createSource(
	"if a == 5",
	"  b = 3 + 5",
	"  print('hello')",
	"end"
    )
    const out = parseSource(src)

    const out2 = createSource(
	"if (a == 5) {",
	"  const b = 3 + 5",
	'  print("hello")',
	"}"
    )
    
    expect(out).toEqual(out2)
})


test("simple if else", () => {
    const src = createSource(
	"if a == 5",
	"  return 3 + 5",
	"else",
	"  return 3 + 5 + 8",
	"end"
    )
    const out = parseSource(src)

    const out2 = createSource(
	"if (a == 5) {",
	"  return 3 + 5",
	"} else {",
	"  return (3 + 5) + 8",
	"}"
    )
    
   expect(out).toEqual(out2)
})             

test("simple if elsif", () => {
    const src = createSource(
	"if a == 5",
	"  return 3 + 5",
	"elsif a == 9",
	"  return 3 + 5 + 8",
	"end"
    )
    const out = parseSource(src)

    const out2 = createSource(
	"if (a == 5) {",
	"  return 3 + 5",
	"} else if (a == 9) {",
	"  return (3 + 5) + 8",
	"}"
    )
    
    expect(out).toEqual(out2)
})             

test("simple if elsif else", () => {
    const src = createSource(
	"if a == 5",
	"  return 3 + 5",
	"elsif a == 9",
	"  return 3 + 5 + 8",
	"else",
	"  return 666",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"if (a == 5) {",
	"  return 3 + 5",
	"} else if (a == 9) {",
	"  return (3 + 5) + 8",
	"} else {",
	"  return 666",
	"}"
    )
    
    expect(out).toEqual(out2)
})             


test("simple unless else", () => {
    const src = createSource(
	"unless a == 5",
	"  return 3 + 5",
	"else",
	"  return 3 + 5 + 8",
	"end"
    )
    const out = parseSource(src)

    const out2 = createSource(
	"if (!(a == 5)) {",
	"  return 3 + 5",
	"} else {",
	"  return (3 + 5) + 8",
	"}"
    )
    expect(out).toEqual(out2)
})             

test("simple for", () => {
    const src = createSource(
	"for i in some_func",
	"  print(i)",
	"end"
    )
    const out = parseSource(src)

    const out2 = createSource(
	"for (const i in someFunc) {",
	"  print(i)",
	"}"
    )
    
    expect(out).toEqual(out2)
})             
    
test("simple while", () => {
    const src = createSource(
	"while i < 10",
	"  print(i)",
	"end"
    )
    const out = parseSource(src)

    const out2 = createSource(
	"while (i < 10) {",
	"  print(i)",
	"}"
    )
    expect(out).toEqual(out2)
})             

test("simple until with do", () => {
    const src = createSource(
	"until i < 10 do",
	"  print(i)",
	"end"
    )
    const out = parseSource(src)

    const out2 = createSource(
	"while (!(i < 10)) {",
	"  print(i)",
	"}"
    )
    expect(out).toEqual(out2)
})             

test("simple while at end", () => {
    const src = createSource(
	"begin",
	"  print(i)",
	"end while i < 10"
    )
    const out = parseSource(src)

    const out2 = createSource(
	"do {",
	"  print(i)",
	"} while (i < 10)"
    )
    expect(out).toEqual(out2)
})             


test("simple case", () => {
    const src = createSource(
	"case a",
	"when 1",
	"  print(i)",
	"when 2, 3 + 5",
	"  x = 333",
	"else",
	"  x = 666",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"switch (a) {",
	"case 1:",
	"  print(i)",
	"break",
	"case 2:",
	"case 3 + 5:",
	"  const x = 333",
	"break",
	"default:",
	"  const x = 666",
	"break",
	"}"
    )
    expect(out).toEqual(out2)
})             

test("case with expressions", () => {
    const src = createSource(
	"case",
	"when a == 1",
	"  print(i)",
	"when a == 2, a < 3 + 5",
	"  x = 333",
	"else x = 666",
	"  a = 333",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"if (a == 1) {",
	"  print(i)",
	"} else if ((a == 2) || (a < 3 + 5)) {",
	"  const x = 333",
	"} else {",
	"     const x = 666",
	"  const a = 333",
	"}"
    )

    expect(out).toEqual(out2)
})

test("case with ranges", () => {
    const src = createSource(
	"case score",
	'when 0..4, 5...10 then return "Complicated"',
	'when 10..40 then return "Fail"',
	'when 41..60 then return "Pass"',
	'when 61..70 then return "Pass with Merit"',
	'when 71..100 then return "Pass with Distinction"',
	'when -1 then return "Oh my god"',
	'else return "Invalid Score"',
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"if (((score) >= (0) && (score) <= (4)) || ((score) >= (5) && (score) < (10))) {",
	'                       return "Complicated"',
	"} else if ((score) >= (10) && (score) <= (40)) {",
	'                 return "Fail"',
	"} else if ((score) >= (41) && (score) <= (60)) {",
	'                 return "Pass"',
	"} else if ((score) >= (61) && (score) <= (70)) {",
	'                 return "Pass with Merit"',
	"} else if ((score) >= (71) && (score) <= (100)) {",
	'                  return "Pass with Distinction"',
	"} else if ((score) == (-1)) {",
	'             return "Oh my god"',
	"} else {",
	'     return "Invalid Score"',
	"}"
    )
    expect(out).toEqual(out2)
})             


test.skip("begin block", () => { // TODO it is enclosed in NODE_BLOCK instead of NODE_BEGIN
    const src = createSource(
	"begin",
	"  a = 333",
	"  print(53 + 2)",
	"end"
    )
    const out = parseSource(src)

    const out2 = createSource(
	"{",
	"  const a = 333",
	"  print(53 + 2)",
	"}"
    )
    expect(out).toEqual(out2)
})             

test("while with break", () => {
    const src = createSource(
	"i = 0",
	"while true",
	"  i += 3",
	"  break if i > 10",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"let i = 0",
	"while (true) {",
	"  i += 3",
	"  if (i > 10) {",
	"  break",
	"  }",
	"}"
    )
    expect(out).toEqual(out2)
})             

test("while with next", () => {
    const src = createSource(
	"i = 0",
	"while true",
	"  i += 3",
	"  next if i > 10",
	"end"
    )
    const out = parseSource(src)

    const out2 = createSource(
	"let i = 0",
	"while (true) {",
	"  i += 3",
	"  if (i > 10) {",
	"  continue",
	"  }",
	"}"
    )
    expect(out).toEqual(out2)
})             

// TODO redo, retry

// I am not sure if we should implement pattern matching or not
test.skip("Pattern matching with case", () => {
    const src = createSource(
	"a = 5",
	"case [1, 2]",
	"    in String => a, String",
	'"matched"',
	"else",
	'   "not matched"',
	"end")


    const out = parseSource(src)

    //expect(out).toEqual("")
})

test("simple new", () => {
    const src = createSource(
	"a = Klas.new",
    )
    const out = parseSource(src)

    const out2 = createSource(
	"const a = new Klas()"
    )
    expect(out).toEqual(out2)
})             

test("simple new with params", () => {
    const src = createSource(
	"a = Klas.new 333, 666 + 3",
    )
    const out = parseSource(src)

    const out2 = createSource(
	"const a = new Klas(333, 666 + 3)"
    )
    expect(out).toEqual(out2)
})             

test("new and method call", () => {
    const src = createSource(
	"Klas.new(333, 666 + 3).call_me()",
    )
    const out = parseSource(src)

    const out2 = createSource(
	"new Klas(333, 666 + 3).callMe()"
    )
    expect(out).toEqual(out2)
})             

test("new in an expression", () => {
    const src = createSource(
	"a = Klas.new(333, 666 + 3) / 2",
    )
    const out = parseSource(src)

    const out2 = createSource(
	"const a = new Klas(333, 666 + 3) / 2"
    )
    expect(out).toEqual(out2)
})             

test("nested expr", () => {
    const src = createSource(
	"a.b",
    )
    const out = parseSource(src)

    const out2 = createSource(
	"a.b()"
    )
    expect(out).toEqual(out2)
})             

test("very nested expr", () => {
    const src = createSource(
	"a.b.c.d",
    )
    const out = parseSource(src)

    const out2 = createSource(
	"a.b().c().d()"
    )
    expect(out).toEqual(out2)
})             

test("Assign with operator I", () => {
    const src = createSource(
	"i = 0",
	"i += 3",
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"let i = 0",
	"i += 3"
    )
    expect(out).toEqual(out2)
})             

test("Assign with operator II", () => {
    const src = createSource(
	"i = 0",
	"i += 3 * 2",
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"let i = 0",
	"i += 3 * 2"
    )
    expect(out).toEqual(out2)
})             

test("Assign with operator III", () => {
    const src = createSource(
	"i = 0",
	"i += 3 * 2 / 89 - 5",
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"let i = 0",
	"i += ((3 * 2) / 89) - 5"
    )
    expect(out).toEqual(out2)
})             

test("do block I", () => {
    const src = createSource(
	"make_it do",
	'  print "666"',
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"makeIt(() => {",
	'  print("666")',
	"})"
    )
    expect(out).toEqual(out2)
})             

test("do block II", () => {
    const src = createSource(
	"make_it(333) do |x|",
	'  print "666"',
	'  print "777"',
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"makeIt(333, (x) => {",
	'  print("666")',
	'  print("777")',
	"})"
    )
    expect(out).toEqual(out2)
})             

test("method do block I", () => {
    const src = createSource(
	"o.make_it do",
	'  print "666"',
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"o.makeIt(() => {",
	'  print("666")',
	"})"
    )
    expect(out).toEqual(out2)
})             

test("do block regarding let/const I", () => {
    const src = createSource(
	"a = 3",
	"o.make_it do",
	"  a = 5",
	'  print "666"',
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"let a = 3",
	"o.makeIt(() => {",
	"  a = 5",
	'  print("666")',
	"})"
    )
    expect(out).toEqual(out2)
})             

test("do block regarding let/const II", () => {
    const src = createSource(
	"a = 3",
	"o.make_it do |;a|",
	"  a = 5",
	'  print "666"',
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"const a = 3",
	"o.makeIt(() => {",
	"  const a = 5",
	'  print("666")',
	"})"
    )
    expect(out).toEqual(out2)
})             

test("do block regarding let/const III", () => {
    const src = createSource(
	"a = 3",
	"o.make_it do |;a|",
	"  a = 5",
	'  print "666"',
	"  a = 77",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"const a = 3",
	"o.makeIt(() => {",
	"  let a = 5",
	'  print("666")',
	"  a = 77",
	"})"
    )
    expect(out).toEqual(out2)
})             

test("do block regarding let/const IV", () => {
    const src = createSource(
	"a = 3",
	"b = 44",
	"c = 55",
	"o.make_it do |c;a|",
	"  a = 5",
	'  print "666"',
	"  a = 77",
	"  c = 99",
	"  if b == 91",
	"    b = 91",
	"  end",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"const a = 3",
	"let b = 44",
	"const c = 55",
	"o.makeIt((c) => {",
	"  let a = 5",
	'  print("666")',
	"  a = 77",
	"  c = 99",
	"  if (b == 91) {",
	"    b = 91",
	"  }",
	"})"
    )
    expect(out).toEqual(out2)
})             
