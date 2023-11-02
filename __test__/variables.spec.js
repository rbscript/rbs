import {describe, expect, test} from '@jest/globals'
import {createSource} from './utils'
import parseSource from '../src/rbs-loader'

test("variable definition", () => {
    const src = createSource("a = 666")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("constant definition", () => {
    const src = createSource("PI = 3.14")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("global variable definition", () => {
    const src = createSource("$g = 666")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("variable def and change", () => {
    const src = createSource(
	"a = 666",
	"a = 1")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("member variable definition", () => {
    const src = createSource("@m = 666")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("class variable definition", () => {
    const src = createSource("@@s = 666")

    const out = parseSource(src)

    //expect(out).equals("")
})


test("variable def and use", () => {
    const src = createSource(
	"a = 666",
	"a = a + 1")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("multi variable def and use", () => {
    const src = createSource(
	"a = 666",
	"$g = 333",
	"@m = 775",
	"@@c = 4",
	"a = a + $g + @m / @@c")

    const out = parseSource(src)

    //expect(out).equals("")
})
