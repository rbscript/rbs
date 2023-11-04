import {describe, expect, test} from '@jest/globals'
import {createSource} from './utils'
import parseSource from '../src/rbs-loader'

test("empty line", () => {
    const src = createSource("")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("single number", () => {
    const src = createSource("666")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("single string", () => {
    const src = createSource("'ozgur'")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("addition", () => {
    const src = createSource("666*9 + 333 - 2")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("function call", () => {
    const src = createSource("f()")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("function call II", () => {
    const src = createSource("f(3, 5 + 8, g())")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("complex", () => {
    const src = createSource("'savas' + f(3, 5 + 8, g()) / 2")

    const out = parseSource(src)

    //expect(out).equals("")
})


test("nil", () => {
    const src = createSource("a = nil")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("true", () => {
    const src = createSource("b = true")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("big number", () => {
    const src = createSource("d = 1_000_000")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("rational number", () => {
    const src = createSource("r = 0.1r")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("imaginary number", () => {
    const src = createSource("i = 1i")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("string with escape", () => {
    const src = createSource('s = "hello \\"Billy\\""')

    const out = parseSource(src)

    //expect(out).equals("")
})

test("string with escape II", () => {
    const src = createSource('s = "my line\\n"')

    const out = parseSource(src)

    //expect(out).equals("")
})

test("string interpolation", () => {
    const src = createSource('s = "my name is #{name}"')

    const out = parseSource(src)

    //expect(out).equals("")
})

test("string interpolation II", () => {
    const src = createSource('s = "my name is #{name} and the surname is #{surname}"')

    const out = parseSource(src)

    //expect(out).equals("")
})

test("string interpolation III", () => {
    const src = createSource(
	's = "my name is #{name} and the surname is #{surname} and #{number}"')

    const out = parseSource(src)

    //expect(out).equals("")
})

test("string interpolation IV", () => {
    const src = createSource(
	's = "my name is #{name + 666} and the surname is #{surname} and #{number}"')

    const out = parseSource(src)

    //expect(out).equals("")
})

test("% string", () => {
    const src = createSource(
	's = %(Savas Alparslan)')

    const out = parseSource(src)

    //expect(out).equals("")
})

test("%q string", () => {
    const src = createSource(
	's = %q(Savas Alparslan)')

    const out = parseSource(src)

    //expect(out).equals("")
})

test("Auto concat strings", () => {
    const src = createSource(
	's = "Bill" "Gates"')

    const out = parseSource(src)

    //expect(out).equals("")
})

test("HEREDOC string", () => {
    const src = createSource(
	"expected_result = <<HEREDOC",
	"This would contain specially formatted text.",
	"",
	"That might span many lines",
	"HEREDOC")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("Indented HEREDOC string", () => {
    const src = createSource(
	"  expected_result = <<-HEREDOC",
	"This would contain specially formatted text.",
	"",
	"That might span many lines",
	"  HEREDOC")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("Squiggly HEREDOC string", () => {
    const src = createSource(
	"expected_result = <<~HEREDOC",
	"  This would contain specially formatted text.",
	"",
	"  That might span many lines",
	"HEREDOC")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("Multiple HEREDOC strings", () => {
    const src = createSource(
	"puts(<<-ONE, <<-TWO)",
	"content for heredoc one",
	"ONE",
	"content for heredoc two",
	"TWO")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("Symbol", () => {
    const src = createSource(
	's = :if')

    const out = parseSource(src)

    //expect(out).equals("")
})

test("Array", () => {
    const src = createSource(
	's = [3, 5, 8]')

    const out = parseSource(src)

    //expect(out).equals("")
})

test("Hash I", () => {
    const src = createSource(
	's = { "a" => 1, "b" => 2 }')

    const out = parseSource(src)

    //expect(out).equals("")
})

test("Hash II", () => {
    const src = createSource(
	's = { a: 1, b: 2 }')

    const out = parseSource(src)

    //expect(out).equals("")
})

test("Range I", () => {
    const src = createSource(
	'r = (333..666)')

    const out = parseSource(src)

    //expect(out).equals("")
})

test("Range II", () => {
    const src = createSource(
	'r = (333...666)')

    const out = parseSource(src)

    //expect(out).equals("")
})

test("Range III", () => {
    const src = createSource(
	'r = (..666)')

    const out = parseSource(src)

    //expect(out).equals("")
})


test("Range IV", () => {
    const src = createSource(
	'r = (666..)')

    const out = parseSource(src)

    //expect(out).equals("")
})

test("Regexp", () => {
    const src = createSource(
	"/hay/ =~ 'haystack'")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("Proc", () => {
    const src = createSource(
	"p = -> { 5 + 5 }")

    const out = parseSource(src)

    //expect(out).equals("")
})

test("Ternary if", () => {
    const src = createSource(
	"a = b == 5 ? 333 : 666")

    const out = parseSource(src)

    //expect(out).equals("")
})

