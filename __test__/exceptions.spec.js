import {describe, expect, test} from '@jest/globals'
import {createSource} from './utils'
import parseSource from '../src/rbs-loader'

test("raise", () => {
    const src = createSource(
	"raise 'hello'"
    )
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})             

test("rescue etc in a block", () => {
    const src = createSource(
	"begin",
	"  a = 3",
	"rescue NameError",
	"  p 'name error'",
	"rescue",
	"  p 'I rescue'",
	"  retry",
	"else",
	"  p 'its ok'",
	"ensure",
	"  p 'Ensurance'",
	"end"
    )
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})             
