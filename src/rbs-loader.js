import {parse} from './parser'
import {Output} from './output'

export default function (source) {
    const program = parse(source)

    const filename = (this.sourceMap ? this.resourcePath : undefined)
    const output = new Output(filename, source)

    const result = program.convert(output)
    if (!this.sourceMap) {
	return result
    } else {
	this.callback(null, result, output.sourceMap)
    }
}
