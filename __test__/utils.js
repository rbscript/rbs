import {parse} from '../src/parser'
import {Output} from '../src/output'
import {enableConsoleLog} from '../src/parser'
    
export function createSource(...lines) {
    let s = ""
    for (let i = 0; i < lines.length - 1; ++i) {
	s += lines[i] + "\n"
    }
    s += lines[lines.length - 1]
    return s
}

export function parseSource(source) {
    const program = parse(source, true)

    const output = new Output(undefined, undefined)

    const result = program.convert(output)
    return result
}
