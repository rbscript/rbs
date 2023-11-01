export function createSource(...lines) {
    let s = ""
    for (let i = 0; i < lines.length - 1; ++i) {
	s += lines[i] + "\n"
    }
    s += lines[lines.length - 1]
    return s
}
