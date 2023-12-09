import {describe, expect, test} from '@jest/globals'
import {createSource} from './utils'
import parseSource from '../src/rbs-loader'

test("simple raise", () => {
    const src = createSource(
	"raise"
    )
    const out = parseSource(src)

    const out2 = createSource(
	"throw;"
    )
    
    expect(out).toEqual(out2)
})

test("simple fail", () => {
    const src = createSource(
	"fail"
    )
    const out = parseSource(src)

    const out2 = createSource(
	"throw;"
    )
    
    expect(out).toEqual(out2)
})


test("raise a string", () => {
    const src = createSource(
	"raise 'error'"
    )
    const out = parseSource(src)

    const out2 = createSource(
	'throw "error"'
    )
    
    expect(out).toEqual(out2)
})

test("raise an exception", () => {
    const src = createSource(
	"raise ArgumentError"
    )
    const out = parseSource(src)

    const out2 = createSource(
	'throw new ArgumentError()'
    )
    
    expect(out).toEqual(out2)
})

test("raise an exception", () => {
    const src = createSource(
	"raise ArgumentError, 'an error in argument'"
    )
    const out = parseSource(src)

    const out2 = createSource(
	'throw new ArgumentError("an error in argument")'
    )
    
    expect(out).toEqual(out2)
})

test("simple begin/rescue I", () => {
    const src = createSource(
	"begin",
	"  print 'hello'",
	"rescue",
	"  print 'good bye'",
	"end"
    )
    const out = parseSource(src)

    const out2 = createSource(
	"try {",
	'  print("hello")',
	"} catch {",
	'  print("good bye")',
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("simple begin/rescue II", () => {
    const src = createSource(
	"begin",
	"  print 'hello'",
	"  print 'mello'",
	"rescue",
	"  print 'good bye'",
	"  print 'au revoir'",
	"end"
    )
    const out = parseSource(src)

    const out2 = createSource(
	"try {",
	'  print("hello")',
	'  print("mello")',
	"} catch {",
	'  print("good bye")',
	'  print("au revoir")',
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("simple begin/ensure I", () => {
    const src = createSource(
	"begin",
	"  print 'hello'",
	"ensure",
	"  print 'good bye'",
	"end"
    )
    const out = parseSource(src)
    console.log(out)
    
    const out2 = createSource(
	"try {",
	'  print("hello")',
	"} finally {",
	'  print("good bye")',
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("simple begin/ensure II", () => {
    const src = createSource(
	"begin",
	"  print 'hello'",
	"  print 'mello'",
	"ensure",
	"  print 'good bye'",
	"  print 'au revoir'",
	"end"
    )
    const out = parseSource(src)

    const out2 = createSource(
	"try {",
	'  print("hello")',
	'  print("mello")',
	"} finally {",
	'  print("good bye")',
	'  print("au revoir")',
	"}"
    )
    
    expect(out).toEqual(out2)
})
