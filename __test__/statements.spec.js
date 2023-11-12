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


test.skip("simple case", () => {
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

    //expect(out).toEqual(out2)
})             

test.skip("case with expressions", () => {
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

    //expect(out).toEqual(out2)
})             


test.skip("begin block", () => {
    const src = createSource(
	"begin",
	"  a = 333",
	"  print(53 + 2)",
	"end"
    )
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})             

test.skip("begin block", () => {
    const src = createSource(
	"begin",
	"  a = 333",
	"  print(53 + 2)",
	"end while x < 999"
    )
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})             

test.skip("while with break", () => {
    const src = createSource(
	"i = 0",
	"while true",
	"  i += 3",
	"  break if i > 10",
	"end"
    )
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})             

test.skip("while with redo", () => {
    const src = createSource(
	"i = 0",
	"while true",
	"  i += 3",
	"  redo if i > 10",
	"end"
    )
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})             

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

