import {describe, expect, test} from '@jest/globals'
import {createSource} from './utils'
import parseSource from '../src/rbs-loader'

test.skip("variable definition", () => {
    const src = createSource("a = 666")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test.skip("constant definition", () => {
    const src = createSource("PI = 3.14")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test.skip("global variable definition", () => {
    const src = createSource("$g = 666")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
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

test.skip("multi variable def and use", () => {
    const src = createSource(
	"a = 666",
	"$g = 333",
	"@m = 775",
	"@@c = 4",
	"a = a + $g + @m / @@c")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
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
