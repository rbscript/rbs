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

    // Print specific file
    if (path.endsWith(".rb")) {
	processFile(path, true)
	return
    }
    
    readdir(path, (err, files) => {
	files = files.sort()
	for (const f of files) {
	    const file = path + (path.endsWith('/') ? "" : "/") + f
	    if (f.endsWith(".rb")) {
		processFile(file)
	    } else {
		stat(file, (err, istat) => {
		    if (err == undefined && istat.isDirectory()) {
			processDir(file)
		    }
		})
	    }
	}
    })
}

function processFile(path, dump) {
    readFile(path, (err, data) => {
	console.log(path)
	parse(data, dump)
    })
}
