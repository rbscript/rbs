import {describe, expect, test} from '@jest/globals'
import {createSource} from './utils'
import parseSource from '../src/rbs-loader'

test("empty line", () => {
    const src = createSource("")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("single number", () => {
    const src = createSource("666")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("single string", () => {
    const src = createSource("'ozgur'")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("addition", () => {
    const src = createSource("666*9 + 333 - 2")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("function call", () => {
    const src = createSource("f()")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("function call II", () => {
    const src = createSource("f(3, 5 + 8, g())")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("complex", () => {
    const src = createSource("'savas' + f(3, 5 + 8, g()) / 2")

    const out = parseSource(src)

    //expect(out).equals("")
})

