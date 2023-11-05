import {describe, expect, test} from '@jest/globals'
import {createSource} from './utils'
import parseSource from '../src/rbs-loader'

test("method definition", () => {
    const src = createSource(
	"def one_plus_one",
	"  1 + 1",
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test("unary operator", () => {
    const src = createSource(
	"class C",
	"  def -@",
	'    puts "you inverted this object"',
	"  end",
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test("array operator", () => {
    const src = createSource(
	"class C",
	"  def [](a, b)",
	'    puts "you inverted this object"',
	"  end",
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test("adding method to an object", () => {
    const src = createSource(
	'greeting = "Hello"',
	"def greeting.broaden",
	'  self + ", world!"',
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})


test("method definition with unused args", () => {
    const src = createSource(
	"def one_plus_one(_)",
	"  1 + 1",
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test("method definition with default values", () => {
    const src = createSource(
	"def one_plus_one(a = 3)",
	"  1 + a",
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test("method definition with array decomposition", () => {
    const src = createSource(
	"def my_method((a, b))",
	"  p a: a, b: b",
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test("method definition with array decomposition and remaining args", () => {
    const src = createSource(
	"def my_method((a, *b))",
	"  p a: a, b: b",
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test("method definition with array argument", () => {
    const src = createSource(
	"def my_method(*arguments)",
	"  p arguments",
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test("method definition with keyword arguments", () => {
    const src = createSource(
	"def add_values(first: 1, second: 2)",
	"  first + second",
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test("method definition with arbitrary keyword arguments", () => {
    const src = createSource(
	"def gather_arguments(first: nil, **rest)",
	"  p first, rest",
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test("method definition with block argument", () => {
    const src = createSource(
	"def with_block(&block)",
	"  yield block",
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test("method definition as expression", () => {
    const src = createSource(
	"memoize def expensive_op",
	"  1 + 1",
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test("undefining a method", () => {
    const src = createSource(
	"undef expensive_op"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test("undefining multiple methods", () => {
    const src = createSource(
	"undef expensive_op, some_func"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test("calling func I", () => {
    const src = createSource(
	"fonk(3, 5, 8)"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test("calling func II", () => {
    const src = createSource(
	"fonk 3, 5, 8"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})


test("calling func III", () => {
    const src = createSource(
	"lone_func"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test("calling method I", () => {
    const src = createSource(
	"obje.metod"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test("calling method safely", () => {
    const src = createSource(
	"obje&.metod"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})


test("calling method II", () => {
    const src = createSource(
	"obje().metod 5, 'str', :keyw, name: value, 'nam' => 666"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test("block argument I", () => {
    const src = createSource(
	"my_func do",
	"  p 'hello'",
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test("block argument II", () => {
    const src = createSource(
	"my_func do |name|",
	'  p "hello #{name}"',
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test("block argument III", () => {
    const src = createSource(
	"my_func {",
	"  p 'hello'",
	"}"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test("block local argument II", () => {
    const src = createSource(
	"a = 4",
	"my_func do |name;a|",
	'  p "hello #{name}"',
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test("splat operator", () => {
    const src = createSource(
	"a = [3, 5, 8]",
	"fonk *a"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test("hash operator", () => {
    const src = createSource(
	"arguments = { first: 3, second: 4, third: 5 }",
	"my_method(**arguments)"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test("send proc as an block argument", () => {
    const src = createSource(
	'argument = proc { |a| puts "#{a.inspect} was yielded" }',
	"my_method(&argument)"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})