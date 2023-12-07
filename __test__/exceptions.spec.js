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

