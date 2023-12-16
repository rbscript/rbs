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
    
    const out2 = createSource(
	"function onePlusOne() {",
	"  return 1 + 1",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("method definition", () => {
    const src = createSource(
	"def anti_christ",
	"  666",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"function antiChrist() {",
	"  return 666",
	"}"
    )
    
    expect(out).toEqual(out2)
})


test("method definition multi line", () => {
    const src = createSource(
	"def a_plus_one",
	"  a = 1",
	"  a + 1",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"function aPlusOne() {",
	"  const a = 1",
	"  return a + 1",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("method def with if", () => {
    const src = createSource(
	"def negative? n",
	"  if n < 0",
	"    true",
	"  else",
	"    false",
	"  end",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"function negativeQ(n) {",
	"  if (n < 0) {",
	"    return true",
	"  } else {",
	"    return false",
	"  }",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("method def with case", () => {
    const src = createSource(
	"def number_name n",
	"  case n",
	"  when 0",
	"    'zero'",
	"  when 1",
	"    'one'",
	"  when 2",
	"    'two'",
	"  else",
	"    print 666",
	"    '' + n",
	"  end",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"function numberName(n) {",
	"  switch (n) {",
	"  case 0:",
	'    return "zero"',
	"  case 1:",
	'    return "one"',
	"  case 2:",
	'    return "two"',
	"  default:",
	"    print(666)",
	'    return "" + n',
	"  }",
	"}"
    )
    
    expect(out).toEqual(out2)
})



test.skip("unary operator", () => {
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

test.skip("array operator", () => {
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

test.skip("adding method to an object", () => {
    const src = createSource(
	'greeting = "Hello"',
	"def greeting.broaden",
	'  self + ", world!"',
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})


test.skip("method definition with unused args", () => {
    const src = createSource(
	"def one_plus_one(_)",
	"  1 + 1",
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("method definition with default values", () => {
    const src = createSource(
	"def one_plus_one(a = 3)",
	"  1 + a",
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("method definition with array decomposition", () => {
    const src = createSource(
	"def my_method((a, b))",
	"  p a: a, b: b",
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("method definition with array decomposition and remaining args", () => {
    const src = createSource(
	"def my_method((a, *b))",
	"  p a: a, b: b",
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("method definition with array argument", () => {
    const src = createSource(
	"def my_method(*arguments)",
	"  p arguments",
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("method definition with keyword arguments", () => {
    const src = createSource(
	"def add_values(first: 1, second: 2)",
	"  first + second",
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("method definition with arbitrary keyword arguments", () => {
    const src = createSource(
	"def gather_arguments(first: nil, **rest)",
	"  p first, rest",
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("method definition with block argument", () => {
    const src = createSource(
	"def with_block(&block)",
	"  yield block",
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("method definition as expression", () => {
    const src = createSource(
	"memoize def expensive_op",
	"  1 + 1",
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("undefining a method", () => {
    const src = createSource(
	"undef expensive_op"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("undefining multiple methods", () => {
    const src = createSource(
	"undef expensive_op, some_func"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("calling func I", () => {
    const src = createSource(
	"fonk(3, 5, 8)"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("calling func II", () => {
    const src = createSource(
	"fonk 3, 5, 8"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})


test.skip("calling func III", () => {
    const src = createSource(
	"lone_func"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("calling method I", () => {
    const src = createSource(
	"obje.metod"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("calling method safely", () => {
    const src = createSource(
	"obje&.metod"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})


test.skip("calling method II", () => {
    const src = createSource(
	"obje().metod 5, 'str', :keyw, name: value, 'nam' => 666"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("block argument I", () => {
    const src = createSource(
	"my_func do",
	"  p 'hello'",
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("block argument II", () => {
    const src = createSource(
	"my_func do |name|",
	'  p "hello #{name}"',
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("block argument III", () => {
    const src = createSource(
	"my_func {",
	"  p 'hello'",
	"}"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("block local argument II", () => {
    const src = createSource(
	"a = 4",
	"my_func do |name;a|",
	'  p "hello #{name}"',
	"end"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("splat operator", () => {
    const src = createSource(
	"a = [3, 5, 8]",
	"fonk *a"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("hash operator", () => {
    const src = createSource(
	"arguments = { first: 3, second: 4, third: 5 }",
	"my_method(**arguments)"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})

test.skip("send proc as an block argument", () => {
    const src = createSource(
	'argument = proc { |a| puts "#{a.inspect} was yielded" }',
	"my_method(&argument)"
    )

    const out = parseSource(src)

    //expect(out).equals("")
})


test("def with default arguments I", () => {
    const src = createSource(
	"def anti_christ a = 1",
	"  666",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"function antiChrist(a = 1) {",
	"  return 666",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("def with default arguments II", () => {
    const src = createSource(
	"def anti_christ a = 1, b = a / 3",
	"  666",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"function antiChrist(a = 1, b = a / 3) {",
	"  return 666",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("def with default arguments III", () => {
    const src = createSource(
	"def anti_christ a, b = a / 3",
	"  666",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"function antiChrist(a, b = a / 3) {",
	"  return 666",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("def with default arguments IV", () => {
    const src = createSource(
	"def anti_christ a = 1",
	"  a = 666",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"function antiChrist(a = 1) {",
	"  a = 666",
	"}"
    )
    
    expect(out).toEqual(out2)
})
