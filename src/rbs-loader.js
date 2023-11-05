import {parse} from './parser'
import {readdir, stat, readFile} from 'node:fs'

if (process.argv.length > 2) {
    processDir(process.argv[2])
}

export default function(source) {
    parse(source)
}


function processDir(path) {
    
    if (path.endsWith(".js")) {
	// We're testing
	return
    }
    
    readdir(path, (err, files) => {
	for (const f of files) {
	    const file = path + "/" + f
	    if (f.endsWith(".rb")) {
		processFile(file)
	    } else {
		stat(file, (err, stat) => {
		    if (stat.isDirectory()) {
			processDir(file)
		    }
		})
	    }
	}
    })
}

function processFile(path) {
    readFile(path, (err, data) => {
	parse(data)
    })
}
