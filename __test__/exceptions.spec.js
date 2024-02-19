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

test("begin/rescue with let/const I", () => {
    const src = createSource(
	"ad = 'Savas'",
	"begin",
	'  print "hello #{ad}"',
	"rescue",
	"  print 'good bye'",
	"end"
    )
    const out = parseSource(src)

    const out2 = createSource(
	'const ad = "Savas"',
	"try {",
	'  print("hello " + (ad))',
	"} catch {",
	'  print("good bye")',
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("begin/rescue with let/const II", () => {
    const src = createSource(
	"ad = 'Savas'",
	"begin",
	"  ad = 'Bill Gates'",
	'  print "hello #{ad}"',
	"rescue",
	"  print 'good bye'",
	"end"
    )
    const out = parseSource(src)

    const out2 = createSource(
	'let ad = "Savas"',
	"try {",
	'  ad = "Bill Gates"',
	'  print("hello " + (ad))',
	"} catch {",
	'  print("good bye")',
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("begin/rescue as expr I", () => {
    const src = createSource(
	"ad = 'Savas'",
	"ad = begin",
	"       'Bill Gates'",
	"     rescue",
	"       'Paul Allen'",
	"     end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	'let ad = "Savas"',
	"ad = (() => {",
	"  {",
	"    try {",
	'      return "Bill Gates"',
	"    } catch {",
	'      return "Paul Allen"',
	"    }",
	"  }",
	"})()"
    )
    
    expect(out).toEqual(out2)
})

test("begin/rescue as expr II", () => {
    const src = createSource(
	"ad = 'Bill Gates' rescue 'Paul Allen'"
    )
    const out = parseSource(src)

    const out2 = createSource(
	"const ad = (() => {",
	"  try {",
	'    return "Bill Gates"',
	"  } catch {",
	'    return "Paul Allen"',
	"  }",
	"})()"
    )
    
    expect(out).toEqual(out2)
})


test("multi rescue I", () => {
    const src = createSource(
	"begin",
	"  print 'hello'",
	"rescue ArgumentError",
	"  print 'bad argument'",
	"rescue",
	"  print 'good bye'",
	"end"
    )
    const out = parseSource(src)

    const out2 = createSource(
	"try {",
	'  print("hello")',
	"} catch (e__1) {",
	"  if (e__1 instanceof ArgumentError) {",
	'    print("bad argument")',
	"  } else {",
	'    print("good bye")',
	"  }",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("multi rescue II", () => {
    const src = createSource(
	"begin",
	"  print 'hello'",
	"rescue ArgumentError",
	"  print 'bad argument'",
	"rescue RuntimeError",
	"  print 'do not run'",
	"rescue",
	"  print 'good bye'",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"try {",
	'  print("hello")',
	"} catch (e__1) {",
	"  if (e__1 instanceof ArgumentError) {",
	'    print("bad argument")',
	"  } else if (e__1 instanceof RuntimeError) {",
	'    print("do not run")',
	"  } else {",
	'    print("good bye")',
	"  }",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("multi rescue III", () => {
    const src = createSource(
	"begin",
	"  print 'hello'",
	"rescue ArgumentError => ae",
	"  print 'bad argument'",
	"rescue",
	"  print 'good bye'",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"try {",
	'  print("hello")',
	"} catch (e__1) {",
	"  if (e__1 instanceof ArgumentError) {",
	"    const ae = e__1",
	'    print("bad argument")',
	"  } else {",
	'    print("good bye")',
	"  }",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("multi rescue IV", () => {
    const src = createSource(
	"begin",
	"  print 'hello'",
	"rescue ArgumentError => ae",
	"  print 'bad argument'",
	"rescue",
	"  print 'good bye'",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"try {",
	'  print("hello")',
	"} catch (e__1) {",
	"  if (e__1 instanceof ArgumentError) {",
	"    const ae = e__1",
	'    print("bad argument")',
	"  } else {",
	'    print("good bye")',
	"  }",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("begin/rescue/else", () => {
    const src = createSource(
	"begin",
	"  print 'hello'",
	"rescue",
	"  print 'good bye'",
	"else",
	"  print 'we dont get caught'",
	"end"
    )
    const out = parseSource(src)

    const out2 = createSource(
	"let els__1 = false",
	"try {",
	'  print("hello")',
	"  els__1 = true",
	"} catch {",
	'  print("good bye")',
	"}",
	"if (els__1) {",
	'  print("we dont get caught")',
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("def/rescue/else", () => {
    const src = createSource(
	"def fn",
	"  print 'hello'",
	"rescue",
	"  print 'good bye'",
	"else",
	"  print 'we dont get caught'",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"export function fn() {",
	"  let els__1 = false",
	"  try {",
	'    print("hello")',
	"    els__1 = true",
	"  } catch {",
	'    return print("good bye")',
	"  }",
	"  if (els__1) {",
	'    return print("we dont get caught")',
	"  }",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("def/rescue/ensure/else", () => {
    const src = createSource(
	"def fn",
	"  print 'hello'",
	"rescue",
	"  print 'good bye'",
	"else",
	"  print 'we dont get caught'",
	"ensure",
	"  print 'satisfaction guaranteed'",
	"end"
    )
    const out = parseSource(src)

    const out2 = createSource(
	"export function fn() {",
	"  try {",
	"    let els__1 = false",
	"    try {",
	'      print("hello")',
	"      els__1 = true",
	"    } catch {",
	'      return print("good bye")',
	"    }",
	"    if (els__1) {",
	'      return print("we dont get caught")',
	"    }",
	"  } finally {",
	'    print("satisfaction guaranteed")',
	"  }",
	"}"
	
    )
    
    expect(out).toEqual(out2)
})

test("Rescue with error var", () => {
    const src = createSource(
	"def fn x",
	"rescue => error",
	"  print 'good bye'",
	"end"
    )
    const out = parseSource(src)

    const out2 = createSource(
	"export function fn(x) {",
	"  try {",
	"  } catch (error) {",
	'    return print("good bye")',
	"  }",
	"}"
	
    )
    
    expect(out).toEqual(out2)
})
