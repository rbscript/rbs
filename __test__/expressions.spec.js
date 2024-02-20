import {describe, expect, test} from '@jest/globals'
import {createSource} from './utils'
import parseSource from '../src/rbs-loader'

test("empty line", () => {
    const src = createSource("")

    const out = parseSource(src)

    expect(out).toEqual("")
})

test("single number", () => {
    const src = createSource("666")

    const out = parseSource(src)

    expect(out).toEqual("666")
})

test("single variable", () => {
    const src = createSource("x")

    const out = parseSource(src)

    expect(out).toEqual("x")
})


test("single string", () => {
    const src = createSource("'ozgur'")

    const out = parseSource(src)

    expect(out).toEqual('"ozgur"')
})

test.skip("backtick string", () => {
    const src = createSource("`ozgur`")

    const out = parseSource(src)

    expect(out).toEqual("")
})

test("negative number", () => {
    const src = createSource("-1")

    const out = parseSource(src)

    expect(out).toEqual("-1")
})


test("expression I", () => {
    const src = createSource("1 + 2")

    const out = parseSource(src)

    expect(out).toEqual("1 + 2")
})

test("expression II", () => {
    const src = createSource("1 + 2 + 3")

    const out = parseSource(src)

    expect(out).toEqual("(1 + 2) + 3")
})

test("expression III", () => {
    const src = createSource("1 + 2 - 3")

    const out = parseSource(src)

    expect(out).toEqual("(1 + 2) - 3")
})

test("expression IV", () => {
    const src = createSource("1 + 2 / 3")

    const out = parseSource(src)

    expect(out).toEqual("1 + 2 / 3")
})

test("expression V", () => {
    const src = createSource("(1 + 2) / 3")

    const out = parseSource(src)

    expect(out).toEqual("(1 + 2) / 3")
})


test("expression VI", () => {
    const src = createSource("666*9 + 333 - 2")

    const out = parseSource(src)

    expect(out).toEqual("((666 * 9) + 333) - 2")
})

// TODO: Test operators which have no equivalent in Javascript

test("function call", () => {
    const src = createSource("f()")

    const out = parseSource(src)

    expect(out).toEqual("f()")
})

test("function call II", () => {
    const src = createSource("f(3, 5 + 8, g())")

    const out = parseSource(src)

    expect(out).toEqual("f(3, 5 + 8, g())")
})

test("complex", () => {
    const src = createSource("'savas' + f(3, 5 + 8, g()) / 2")

    const out = parseSource(src)

    expect(out).toEqual('"savas" + f(3, 5 + 8, g()) / 2')
})


test("nil", () => {
    const src = createSource("a = nil")

    const out = parseSource(src)

    expect(out).toEqual("const a = undefined")
})

test("true", () => {
    const src = createSource("b = true")

    const out = parseSource(src)

    expect(out).toEqual("const b = true")
})

test("big number", () => {
    const src = createSource("d = 1_000_000")

    const out = parseSource(src)

    expect(out).toEqual("const d = 1000000")
})

test("rational number", () => {
    const src = createSource("r = 0.1r")

    const out = parseSource(src)

    expect(out).toEqual("const r = (1/10)")
})

test("empty hash", () => {
    const src = createSource("{}")

    const out = parseSource(src)

    const out2 = createSource(
	"{}"
    )
    
    expect(out).toEqual(out2)
})

test.skip("imaginary number", () => {
    const src = createSource("i = 1i")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("string with escape", () => {
    const src = createSource('s = "hello \\"Billy\\""')

    const out = parseSource(src)

    expect(out).toEqual('const s = "hello \\\"Billy\\\""')
})

test("string with escape II", () => {
    const src = createSource('s = "my line\\n"')

    const out = parseSource(src)

    expect(out).toEqual('const s = "my line\\n"')
})

test("string interpolation", () => {
    const src = createSource('s = "my name is #{name}"')

    const out = parseSource(src)

    expect(out).toEqual('const s = "my name is " + name')
})

test("string interpolation II", () => {
    const src = createSource('s = "my name is #{name} and the surname is #{surname}"')

    const out = parseSource(src)

    expect(out).toEqual('const s = "my name is " + name + " and the surname is " + surname')
})

test("string interpolation III", () => {
    const src = createSource(
	's = "my name is #{name} and the surname is #{surname} and #{number}"')

    const out = parseSource(src)

    expect(out).toEqual('const s = "my name is " + name + " and the surname is " + surname + " and " + number')
})

test("string interpolation IV", () => {
    const src = createSource(
	's = "my name is #{name + 666} and the surname is #{surname} and #{number}"')

    const out = parseSource(src)

    expect(out).toEqual('const s = "my name is " + (name + 666) + " and the surname is " + surname + " and " + number')
})

test("% string", () => {
    const src = createSource(
	's = %(Savas Alparslan)')

    const out = parseSource(src)

    expect(out).toEqual('const s = "Savas Alparslan"')
})

test("%q string", () => {
    const src = createSource(
	's = %q(Savas Alparslan)')

    const out = parseSource(src)

    expect(out).toEqual('const s = "Savas Alparslan"')
})

test("Auto concat strings", () => {
    const src = createSource(
	's = "Bill" "Gates"')

    const out = parseSource(src)

    expect(out).toEqual('const s = "BillGates"')
})

test("HEREDOC string", () => {
    const src = createSource(
	"expected_result = <<HEREDOC",
	"This would contain specially formatted text.",
	"",
	"That might span many lines",
	"HEREDOC")

    const out = parseSource(src)

    expect(out).toEqual('const expectedResult = "This would contain specially formatted text.\\n\\nThat might span many lines\\n"')
})

test("Indented HEREDOC string", () => {
    const src = createSource(
	"  expected_result = <<-HEREDOC",
	"This would contain specially formatted text.",
	"",
	"That might span many lines",
	"  HEREDOC")

    const out = parseSource(src)

    expect(out).toEqual('const expectedResult = "This would contain specially formatted text.\\n\\nThat might span many lines\\n"')
})

test("Squiggly HEREDOC string", () => {
    const src = createSource(
	"expected_result = <<~HEREDOC",
	"  This would contain specially formatted text.",
	"",
	"  That might span many lines",
	"HEREDOC")

    const out = parseSource(src)

    expect(out).toEqual('const expectedResult = "This would contain specially formatted text.\\n\\nThat might span many lines\\n"')
})

test("Multiple HEREDOC strings", () => {
    const src = createSource(
	"puts(<<-ONE, <<-TWO)",
	"content for heredoc one",
	"ONE",
	"content for heredoc two",
	"TWO")

    const out = parseSource(src)

    expect(out).toEqual('puts("content for heredoc one\\n", "content for heredoc two\\n")')
})

test.skip("Symbol", () => {
    const src = createSource(
	's = :if')

    const out = parseSource(src)

    //expect(out).equals("")
})

test("Array", () => {
    const src = createSource(
	'a = [3, 5, 8]')

    const out = parseSource(src)

    expect(out).toEqual("const a = [3, 5, 8]")
})

test("array index I", () => {
    const src = createSource("a[1]")

    const out = parseSource(src)

    expect(out).toEqual("a[1]")
})



test("Hash I", () => {
    const src = createSource(
	'h = { "a" => 1, "b" => 2 }')

    const out = parseSource(src)

    const out2 = createSource(
	"const h = {",
	'  "a": 1,',
	'  "b": 2',
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("Hash II", () => {
    const src = createSource(
	'h = { a: 1, b: 2 }')

    const out = parseSource(src)

    const out2 = createSource(
	"const h = {",
	'  a: 1,',
	'  b: 2',
	"}"
    )
})

test("Range I", () => {
    const src = createSource(
	'r = (333..666)')

    const out = parseSource(src)
    console.log(out)

    const out2 = createSource(
	"const r = (() => {",
	"  beg__1 = 333",
	"  end__2 = (666) + 1",
	"  return Array.from({length: end__2 - beg__1}, (_, i__3) => beg__1 + i__3)",
	"})()"
    )
    
    expect(out).toEqual(out2)
})

test("Range II", () => {
    const src = createSource(
	'r = (333...666)')

    const out = parseSource(src)
    console.log(out)

    const out2 = createSource(
	"const r = (() => {",
	"  beg__1 = 333",
	"  end__2 = 666",
	"  return Array.from({length: end__2 - beg__1}, (_, i__3) => beg__1 + i__3)",
	"})()"
    )
    
    expect(out).toEqual(out2)
})

test("Range III", () => {
    const src = createSource(
	'r = (..666)')

    const out = parseSource(src)
    console.log(out)

    const out2 = createSource(
	"const r = (() => {",
	"  beg__1 = 0",
	"  end__2 = (666) + 1",
	"  return Array.from({length: end__2 - beg__1}, (_, i__3) => beg__1 + i__3)",
	"})()"
    )
    
    expect(out).toEqual(out2)
})

// Unsupported, at least for now
test.skip("Range IV", () => {
    const src = createSource(
	'r = (666..)')

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("Regexp", () => {
    const src = createSource(
	"/hay/ =~ 'haystack'")

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("Proc", () => {
    const src = createSource(
	"p = -> { 5 + 5 }")

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("Ternary if", () => {
    const src = createSource(
	"a = b == 5 ? 333 : 666")

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("Pattern matching I", () => {
    const src = createSource(
	"config in {connections: {db: {user:, password:}}, logging: {level: log_level}}")

    const out = parseSource(src)

    //expect(out).equals("")
})


test.skip("Regex I", () => {
    const src = createSource(
	"a = /AZaz/")

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("Regex Multi I", () => {
    const src = createSource(
	"a = /",
	"  AZaz",
	"/x"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("Regex Multi II", () => {
    const src = createSource(
	"a = /",
	"  AZaz",
	"/x",
	"c = 6666"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("Regex Multi III", () => {
    const src = createSource(
	"CONTENT_TYPE_PARSER = /",
        " \A",
        " (?<mime_type>[^;\s]+\s*(?:;\s*(?:(?!charset)[^;\s])+)*)?",
        ' (?:;\s*charset=(?<quote>"?)(?<charset>[^;\s]+)\k<quote>)?',
        "/x # :nodoc:"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test("array range I", () => {
    const src = createSource("a[1..8]")

    const out = parseSource(src)

    expect(out).toEqual("a.slice(1, (8) + 1)")
})

test("array range II", () => {
    const src = createSource("a[...8]")

    const out = parseSource(src)

    expect(out).toEqual("a.slice(undefined, 8)")
})

test("array range III", () => {
    const src = createSource("a[11..]")

    const out = parseSource(src)

    expect(out).toEqual("a.slice(11, undefined)")
})

test("comparison operator", () => {
    const src = createSource("a <=> b")
    const out = parseSource(src)

    const out2 = createSource(
	"((cmp__1, cmp__2) => {",
	"if (cmp__1 == cmp__2) return 0",
	"if (cmp__1 > cmp__2) return -1 else return 1",
	"})(a, b)"
    )
    
    expect(out).toEqual(out2)
})

test("and operator", () => {
    const src = createSource("a and b")
    const out = parseSource(src)

    const out2 = createSource(
	"a && b"
    )
    
    expect(out).toEqual(out2)
})

test("and and && operators", () => {
    const src = createSource("a && b and c && d")
    const out = parseSource(src)

    const out2 = createSource(
	"a && b && c && d"
    )
    
    expect(out).toEqual(out2)
})

test("not operator", () => {
    const src = createSource("not a")
    const out = parseSource(src)

    const out2 = createSource(
	"!(a)"
    )
    
    expect(out).toEqual(out2)
})

test("not operator II", () => {
    const src = createSource("not a > b")
    const out = parseSource(src)

    const out2 = createSource(
	"!(a > b)"
    )
    
    expect(out).toEqual(out2)
})

test("unary operator I", () => {
    const src = createSource("+5")
    const out = parseSource(src)

    const out2 = createSource(
	"5"
    )
    
    expect(out).toEqual(out2)
})

test("unary operator II", () => {
    const src = createSource("-5")
    const out = parseSource(src)

    const out2 = createSource(
	"-5"
    )
    
    expect(out).toEqual(out2)
})

test("unary operator II", () => {
    const src = createSource("-(5 / 2)")
    const out = parseSource(src)

    const out2 = createSource(
	"-(5 / 2)"
    )
    
    expect(out).toEqual(out2)
})

test("assign and I", () => {
    const src = createSource("a &&= b")
    const out = parseSource(src)

    const out2 = createSource(
	"a &&= b"
    )
    
    expect(out).toEqual(out2)
})

test("assign and II", () => {
    const src = createSource(
	"a = true",
	"a &&= b"
    )
    const out = parseSource(src)

    const out2 = createSource(
	"let a = true",
	"a &&= b"
    )
    
    expect(out).toEqual(out2)
})

test("Returning hash constant", () => {
    const src = createSource(
	"def hesh",
	"  return {",
	"    :a => 666,",
	"    :b => 333",
	"  }",
	"end"
    )
    const out = parseSource(src)

    const out2 = createSource(
	"export function hesh() {",
	"  return {",
	"    a: 666,",
	"    b: 333",
	"  }",
	"}"
    )
    
    expect(out).toEqual(out2)
})

