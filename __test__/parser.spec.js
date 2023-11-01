import {describe, expect, test} from '@jest/globals'
import {createSource} from './utils'
import {Tree} from '../src/parser'

test("empty line", () => {
    const src = createSource("")
    const tree = new Tree(src)

    expect(tree.nextLine()).toBeUndefined()
})

test("comment line", () => {
    const src = createSource("## bla bla")
    const tree = new Tree(src)

    expect(tree.nextLine()).toBeUndefined()
})

test("attribute", () => {
    const src = createSource("+- nd_tbl: (empty)")
    const tree = new Tree(src)

    const line = tree.nextLine()
    expect(line.type).toEqual("attr")
    expect(line.name).toEqual("nd_tbl")
    expect(line.value).toEqual("(empty)")
})

test("node", () => {
    const src = createSource("@ NODE_BLOCK (line: 26, location: (26,0)-(494,129))")
    const tree = new Tree(src)

    const line = tree.nextLine()
    expect(line.type).toEqual("NODE_BLOCK")
    expect(line.location.startLine).toEqual(26)
    expect(line.location.startCol).toEqual(0)
    expect(line.location.endLine).toEqual(494)
    expect(line.location.endCol).toEqual(129)
})

test("null node", () => {
    const src = createSource("|  (null node)")
    const tree = new Tree(src)

    const line = tree.nextLine()
    expect(line.type).toEqual("(null node)")
})
