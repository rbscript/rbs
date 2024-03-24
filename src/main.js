import {parse} from './parser'
import {Output} from './output'

export function convertFromRbsToJs(source, needingSourceMap, sourceFileName) {
    const program = parse(source)
    const output = new Output(needingSourceMap ? sourceFileName : undefined, source)
    const result = program.convert(output)
    return {
	source: result,
	sourceMap: output.sourceMap
    }
}
