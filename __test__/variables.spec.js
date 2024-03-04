import {describe, expect, test} from '@jest/globals'
import {createSource} from './utils'
import parseSource from '../src/rbs-loader'

test.skip("variable definition", () => {
    const src = createSource("a = 666")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test("constant definition", () => {
    const src = createSource("PI = 3.14")

    const out = parseSource(src)

    const out2 = createSource(
	"export const PI = 3.14",
    )
    expect(out).toEqual(out2)
})

test("private constant definition", () => {
    const src = createSource(
	"private",
	"PI = 3.14"
    )

    const out = parseSource(src)

    const out2 = createSource(
	"const PI = 3.14",
    )
    expect(out).toEqual(out2)
})


test("global variable definition", () => {
    const src = createSource("$g = 666")

    const out = parseSource(src)

    const out2 = createSource(
	"globalThis.$g = 666",
    )
    expect(out).toEqual(out2)
})

test("variable def and change", () => {
    const src = createSource(
	"a = 666",
	"a = 1")

    const out = parseSource(src)

    const out2 = createSource(
	"let a = 666",
	"a = 1"
    )
    expect(out).toEqual(out2)
})

test("variable def and change in if", () => {
    const src = createSource(
	"a = 666",
	"if true",
	"  a = 1",
	"end"
    )

    const out = parseSource(src)
    
    const out2 = createSource(
	"let a = 666",
	"if (true) {",
	"  a = 1",
	"}"
    )
    expect(out).toEqual(out2)
})

test("variable def in while and change in if", () => {
    const src = createSource(
	"while b < 10",
	"  a = 666",
	"  if true",
	"    print(a)",
	"  else",
	"    a = 3",
	"  end",
	"end"
    )

    const out = parseSource(src)
    
    const out2 = createSource(
	"while (b < 10) {",
	"  let a = 666",
	"  if (true) {",
	"    print(a)",
	"  } else {",
	"    a = 3",
	"  }",
	"}"
    )
    expect(out).toEqual(out2)
})



test.skip("member variable definition", () => {
    const src = createSource("@m = 666")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test.skip("class variable definition", () => {
    const src = createSource("@@s = 666")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})


test.skip("variable def and use", () => {
    const src = createSource(
	"a = 666",
	"a = a + 1")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test("multi variable def and use", () => {
    const src = createSource(
	"a = 666",
	"$g = 333",
	"m = 775",
	"c = 4",
	"a = a + $g + m / c")

    const out = parseSource(src)

    const out2 = createSource(
	"let a = 666",
	"globalThis.$g = 333",
	"const m = 775",
	"const c = 4",
	"a = (a + globalThis.$g) + m / c"
    )
    expect(out).toEqual(out2)
})

test.skip("multi assignment", () => {
    const src = createSource("a, b = 333, 666")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test.skip("swap", () => {
    const src = createSource("a, b = b, a")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test.skip("multi assignment II", () => {
    const src = createSource("a, *b = 333, 666, 4, 5, 9")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test.skip("decomposition", () => {
    const src = createSource("(a, b) = [1, 2]")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test.skip("decomposition II", () => {
    const src = createSource("a, (b, *c), *d = 1, [2, 3, 4], 5, 6")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test.skip("alias I", () => {
    const src = createSource("alias a b")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test.skip("alias II", () => {
    const src = createSource("alias :a :b")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test.skip("attribute assignment", () => {
    const src = createSource("obje.prop = 666")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test("return from stm I", () => {
    const src = createSource(
	"a = if true",
	"       333",
	"    else",
	"       666",
	"    end"
    )

    const out = parseSource(src)

    const out2 = createSource(
	"const a = (() => {",
	"  if (true) {",
	"    return 333",
	"  } else {",
	"    return 666",
	"  }",
	"})()"
    )
    expect(out).toEqual(out2)
})

test("return from stm II", () => {
    const src = createSource(
	"a = ",
	"    if true",
	"       333",
	"    else",
	"       666",
	"    end"
    )

    const out = parseSource(src)

    const out2 = createSource(
	"const a = (() => {",
	"  if (true) {",
	"    return 333",
	"  } else {",
	"    return 666",
	"  }",
	"})()"
    )
    expect(out).toEqual(out2)
})

test("return from stm as param I", () => {
    const src = createSource(
	"print(if true",
	'       "333"',
	"    else",
	'       "666"',
	"    end)"
    )

    const out = parseSource(src)
    
    const out2 = createSource(
	"print((() => {",
	"  if (true) {",
	'    return "333"',
	"  } else {",
	'    return "666"',
	"  }",
	"})())"
    )
    expect(out).toEqual(out2)
})

test("return from stm III", () => {
    const src = createSource(
	"a = if true",
	"       333",
	"    else",
	"       666",
	"    end + ",
	"    case x",
	"    when 1 then 2",
	"    when 2 then 3",
	"    end"
    )

    const out = parseSource(src)

    const out2 = createSource(
	"const a = (() => {",
	"  if (true) {",
	"    return 333",
	"  } else {",
	"    return 666",
	"  }",
	"})() + (() => {",
	"  switch (x) {",
	"  case 1:",
	"    return 2",
	"  case 2:",
	"    return 3",
	"  }",
	"})()"
    )
    expect(out).toEqual(out2)
})

test("return from begin I", () => {
    const src = createSource(
	"a = begin",
	"       333",
	"    end"
    )

    const out = parseSource(src)
    
    const out2 = createSource(
	"const a = (() => {",
	"  {",
	"    return 333",
	"  }",
	"})()"
    )
    expect(out).toEqual(out2)
})

test("return from begin II", () => {
    const src = createSource(
	"a = begin",
	"       y = 22",
	"       333",
	"    end"
    )

    const out = parseSource(src)

    const out2 = createSource(
	"const a = (() => {",
	"  {",
	"    const y = 22",
	"    return 333",
	"  }",
	"})()"
    )
    expect(out).toEqual(out2)
})

test("return from begin with let/const problem", () => {
    const src = createSource(
	"y = 11",
	"a = begin",
	"       y = 22",
	"       333",
	"    end"
    )

    const out = parseSource(src)

    const out2 = createSource(
	"let y = 11",
	"const a = (() => {",
	"  {",
	"    y = 22",
	"    return 333",
	"  }",
	"})()"
    )
    expect(out).toEqual(out2)
})

test("return from while I", () => {
    const src = createSource(
	"i = 0",
	"a = while i < 10",
	"      break 666 if i == 5",
	"      i += 1",
	"    end"
    )

    const out = parseSource(src)
    
    const out2 = createSource(
	"let i = 0",
	"const a = (() => {",
	"  while (i < 10) {",
	"    if (i == 5) {",
	"      return 666",
	"    }",
	"    i += 1",
	"  }",
	"})()"
    )
    expect(out).toEqual(out2)
})

test("return from while II", () => {
    const src = createSource(
	"i = 0",
	"a = while i < 10",
	"      333",
	"      break 666 if i == 5",
	"      i += 1",
	"    end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"let i = 0",
	"const a = (() => {",
	"  while (i < 10) {",
	// No 333 here because Ruby surppresses it
	"    if (i == 5) {",
	"      return 666",
	"    }",
	"    i += 1",
	"  }",
	"})()"
    )
    expect(out).toEqual(out2)
})


test("alias II", () => {
    const src = createSource(
	"alias $f $g",
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"Object.defineProperty(globalThis.constructor.prototype, '$f', {",
	"    configurable: true,",
	"    get() {",
	"      return $g",
	"    }",
	"    set(value) {",
	"      $g = value",
	"    }",
	"})"
    )
    
    expect(out).toEqual(out2)
})

test("multi assignment I", () => {
    const src = createSource(
	"a, b = f()"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"const multi__1 = f()",
	"const a = multi__1[0]",
	"const b = multi__1[1]"
    )
    
    expect(out).toEqual(out2)
})

test("multi assignment II", () => {
    const src = createSource(
	"a, b = b, a"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"const multi__1 = [b, a]",
	"const a = multi__1[0]",
	"const b = multi__1[1]"
    )
    
    expect(out).toEqual(out2)
})

test("multi assignment III", () => {
    const src = createSource(
	"a, @b = @b, a"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"const multi__1 = [this.#b, a]",
	"const a = multi__1[0]",
	"this.#b = multi__1[1]"
    )
    
    expect(out).toEqual(out2)
})

test("attribute assignment I", () => {
    const src = createSource(
	"f.a = 333"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"f.a = 333"
    )
    
    expect(out).toEqual(out2)
})

test("attribute assignment II", () => {
    const src = createSource(
	"f().a = 333"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"f().a = 333"
    )
    
    expect(out).toEqual(out2)
})

test("attribute assignment II", () => {
    const src = createSource(
	"f(3, 5, 8).a = 333"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"f(3, 5, 8).a = 333"
    )
    
    expect(out).toEqual(out2)
})

test("assignment to method call", () => {
    const src = createSource(
	"a = document.createElement('a')"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	'const a = document.createElement("a")'
    )
    
    expect(out).toEqual(out2)
})

test("assign value to hash", () => {
    const src = createSource(
	"db = {}",
	"db['a'] = 333"
    )
    const out = parseSource(src)

    const out2 = createSource(
	"const db = {}",
	'db["a"] = 333'
    )
    
    expect(out).toEqual(out2)
})

test("Bug: Unnecessary const for +=", () => {
    const src = createSource(
	"x = 0",
	"a = []",
	"for i in a",
	"  x += 1",
	"end"
    )
    const out = parseSource(src)

    const out2 = createSource(
	"let x = 0",
	"const a = []",
	"for (const i of a) {",
	"  x += 1",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("Bug: No var decl in for", () => {
    const src = createSource(
	"a = []",
	"for i in a",
	"  r = a[i]",
	"end",
	"for j in a",
	"  r = a[j]",
	"end"
    )
    const out = parseSource(src)

    const out2 = createSource(
	"const a = []",
	"for (const i of a) {",
	"  const r = a[i]",
	"}",
	"for (const j of a) {",
	"  const r = a[j]",
	"}"
    )
    
    expect(out).toEqual(out2)
})




