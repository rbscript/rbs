import {parse} from './parser'
import {Output} from './output'

export default function (source) {
    const program = parse(source)
    const output = new Output()
    return program.convert(output)
}
