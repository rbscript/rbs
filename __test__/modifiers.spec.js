import {describe, expect, test} from '@jest/globals'
import {createSource} from './utils'
import parseSource from '../src/rbs-loader'


test("modifier if", () => {
    const src = createSource(
	"b = 2",
	"a = 3 if b == 2"
    )
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})             


test("value from begin", () => {
    const src = createSource(
	"b = begin",
	"      3",
	"    end"
    )
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})             

test("value from if", () => {
    const src = createSource(
	"b = 2",
	"a = if b == 2",
	"       333",
	"    else",
	"       666",
	"    end"
    )
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})             

test("value from if and calculation", () => {
    const src = createSource(
	"b = 2",
	"a = if b == 2",
	"       333",
	"    else",
	"       666",
	"    end + 5000"
    )
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})             
