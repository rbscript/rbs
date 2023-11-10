import {parse} from './parser'
import {Output} from './output'
import {readdirSync, statSync, readFileSync} from 'node:fs'

if (process.argv.length > 2) {
    processDir(process.argv[2])
}

export default function(source) {
    
    const program = parse(source)
    const output = new Output()
    return program.convert(output)
}


function processDir(path) {
    
    if (path.endsWith(".js")) {
	// We're testing
	return
    }

    // Print specific file
    if (path.endsWith(".rb")) {
	processFile(path, true)
	return
    }

    const files = readdirSync(path)
    for (const f of files) {
	const file = path + (path.endsWith('/') ? "" : "/") + f
	if (f.endsWith(".rb")) {
	    processFile(file)
	} else {
	    const stat = statSync(file)
	    if (stat.isDirectory()) {
		processDir(file)
	    }
	}
    }

}

function processFile(path, dump) {
    console.log(path)
    const data = readFileSync(path, {
	encoding: 'utf8',
	flag: 'r'
    })
    parse(data, dump)

}
