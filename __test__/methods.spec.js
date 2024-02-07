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
	"export function onePlusOne() {",
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
	"export function antiChrist() {",
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
	"export function aPlusOne() {",
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
	"export function negativeQ(n) {",
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
	"export function numberName(n) {",
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
	"export function antiChrist(a = 1) {",
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
	"export function antiChrist(a = 1, b = a / 3) {",
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
	"export function antiChrist(a, b = a / 3) {",
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
	"export function antiChrist(a = 1) {",
	"  a = 666",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("def with keyword arguments I", () => {
    const src = createSource(
	"def anti_christ num:",
	"  num * 666",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"export function antiChrist({num} = {}) {",
	"  return num * 666",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("def with keyword arguments II", () => {
    const src = createSource(
	"def anti_christ num: 23",
	"  num * 666",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"export function antiChrist({num = 23}) {",
	"  return num * 666",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("def with keyword arguments III", () => {
    const src = createSource(
	"def anti_christ num: 23",
	"  num = 666",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"export function antiChrist({num = 23}) {",
	"  num = 666",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("def with keyword and optional arguments I", () => {
    const src = createSource(
	"def anti_christ str, index = str + 46, num: 23",
	"  num = 666",
	"  stri = 'kelle'",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"export function antiChrist(str, index = str + 46, {num = 23}) {",
	"  num = 666",
	'  const stri = "kelle"',
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("def with keyword and optional arguments II", () => {
    const src = createSource(
	"def anti_christ str, index = str + 46, num: 23, count:",
	"  num = 666",
	"  index = 3",
	"  stri = 'kelle'",
	"  stri = 'namik'",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"export function antiChrist(str, index = str + 46, {num = 23, count}) {",
	"  num = 666",
	"  index = 3",
	'  let stri = "kelle"',
	'  stri = "namik"',
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("def with rest arguments I", () => {
    const src = createSource(
	"def anti_christ **rest",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"export function antiChrist(...rest) {",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("def with rest arguments II", () => {
    const src = createSource(
	"def anti_christ a, **rest",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"export function antiChrist(a, ...rest) {",
	"}"
    )
    
    expect(out).toEqual(out2)
})


test("call with keyword arguments I", () => {
    const src = createSource(
	"anti_christ a = 3"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"antiChrist({a: 3})"
    )
    
    expect(out).toEqual(out2)
})

test("call with keyword arguments II", () => {
    const src = createSource(
	"anti_christ(a = 3, b = 666)"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"antiChrist({a: 3, b: 666})"
    )
    
    expect(out).toEqual(out2)
})

test("call with keyword arguments III", () => {
    const src = createSource(
	"anti_christ(666, a = 3, b = 666)"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"antiChrist(666, {a: 3, b: 666})"
    )
    
    expect(out).toEqual(out2)
})

test("call with unused argument", () => {
    const src = createSource(
	"welcome_home(_)"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"welcomeHome(undefined)"
    )
    
    expect(out).toEqual(out2)
})

test("def with unused argument", () => {
    const src = createSource(
	"def welcome_home(_, _)",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"export function welcomeHome(___1, ___2) {",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("call if not nil", () => {
    const src = createSource(
	"obj&.kelle",
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"obj?.kelle"
    )
    
    expect(out).toEqual(out2)
})

test("call if not nil II", () => {
    const src = createSource(
	"obj&.kelle&.do_it p1, p2",
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"obj?.kelle?.doIt(p1, p2)"
    )
    
    expect(out).toEqual(out2)
})

test("call if not nil II", () => {
    const src = createSource(
	"obj&.kelle&.do_it p1, p2",
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"obj?.kelle?.doIt(p1, p2)"
    )
    
    expect(out).toEqual(out2)
})

test("call if not nil III", () => {
    const src = createSource(
	"obj&.kelle()&.do_it p1, p2",
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"obj?.kelle()?.doIt(p1, p2)"
    )
    
    expect(out).toEqual(out2)
})


test("nested calls I", () => {
    const src = createSource(
	"obj.kelle.namik.do_it p1, p2",
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"obj.kelle.namik.doIt(p1, p2)"
    )
    
    expect(out).toEqual(out2)
})

test("nested calls II", () => {
    const src = createSource(
	"obj.kelle().namik.do_it p1, p2",
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"obj.kelle().namik.doIt(p1, p2)"
    )
    
    expect(out).toEqual(out2)
})

test("undef", () => {
    const src = createSource(
	"undef f",
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"f = undefined"
    )
    
    expect(out).toEqual(out2)
})

test("alias I", () => {
    const src = createSource(
	"alias f g",
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"f = g"
    )
    
    expect(out).toEqual(out2)
})

test("return multiple", () => {
    const src = createSource(
	"def f",
	"  return 3, 5, 8",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"export function f() {",
	"  return [3, 5, 8]",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("function with yield I", () => {
    const src = createSource(
	"def f",
	"  yield 4",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"export function* f() {",
	"  yield 4",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("function with yield II", () => {
    const src = createSource(
	"def f n",
	"  if n == 3 then yield 22; end",
	"  yield 4",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"export function* f(n) {",
	"  if (n == 3) {",
	"    yield 22",
	"  }",
	"  yield 4",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("method with yield I", () => {
    const src = createSource(
	"class C",
	"  def f",
	"    yield 4",
	"  end",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"export class C {",
	"  *f() {",
	"    yield 4",
	"  }",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("function inside function", () => {
    const src = createSource(
	"def f",
	"  def g",
	"  end",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"export function f() {",
	"  function g() {",
	"  }",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("function inside method", () => {
    const src = createSource(
	"class C",
	"  def f",
	"    def g",
	"    end",
	"  end",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"export class C {",
	"  f() {",
	"    function g() {",
	"    }",
	"  }",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("Creating proc", () => {
    const src = createSource(
	"def makeproc(&p)",
	"  p",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"export function makeproc(p) {",
	"  return p",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("Calling proc I", () => {
    const src = createSource(
	"def callproc(&p)",
	"  p.call",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"export function callproc(p) {",
	"  return p()",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("Calling proc II", () => {
    const src = createSource(
	"def callproc(&p)",
	"  p.call 666",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"export function callproc(p) {",
	"  return p(666)",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("Defining lambda I", () => {
    const src = createSource(
	"is_positive = lambda {|x| x > 0}"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"const isPositive = (x) => {",
	"  return x > 0",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("Defining lambda II", () => {
    const src = createSource(
	"is_positive = -> (x) {x > 0}"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"const isPositive = (x) => {",
	"  return x > 0",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("Defining lambda III", () => {
    const src = createSource(
	"is_positive = -> (x) {print 'selam'; x > 0}"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"const isPositive = (x) => {",
	'  print("selam")',
	"  return x > 0",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("Defining lambda IV", () => {
    const src = createSource(
	"is_positive = -> (x) do",
	"  print 'selam'",
	"  x > 0",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	"const isPositive = (x) => {",
	'  print("selam")',
	"  return x > 0",
	"}"
    )
    
    expect(out).toEqual(out2)
})

test("Not so simple if elsif for returnize bug", () => {
    const src = createSource(
	"def save",
	"  if cur_handler != nil",
        "    cur_handler.call",
	"  elsif cur_key != nil",
	"    set_db(cur_key, by_id('content').value)",
	"  end",
	"end"
    )

    const out = parseSource(src)

    const out2 = createSource(
	"export function save() {",
	"  if (curHandler != undefined) {",
	"    return curHandler()",
	"  } else if (curKey != undefined) {",
	'    return setDb(curKey, byId("content").value)',
	"  }",
	"}"
    )
    
    expect(out).toEqual(out2)
})             

test("lone undefined func call without paranthesis", () => {
    const src = createSource(
	"def save",
	"  refresh_races",
	"end"
    )

    const out = parseSource(src)

    const out2 = createSource(
	"export function save() {",
	'  return refreshRaces()',
	"}"
    )
    
    expect(out).toEqual(out2)
})             

test("lone undefined returning func call without paranthesis", () => {
    const src = createSource(
	"def save",
	"  return refresh_races",
	"end"
    )

    const out = parseSource(src)

    const out2 = createSource(
	"export function save() {",
	'  return refreshRaces',
	"}"
    )
    
    expect(out).toEqual(out2)
})             


test("lone func call without paranthesis I", () => {
    const src = createSource(
	"def refresh_races",
	"end",
	"def save",
	"  return refresh_races()",
	"end"
    )

    const out = parseSource(src)

    const out2 = createSource(
	"export function refreshRaces() {",
	"}",
	"export function save() {",
	'  return refreshRaces()',
	"}"
    )
    
    expect(out).toEqual(out2)
})             

test("lone func call without paranthesis II", () => {
    const src = createSource(
	"def save",
	"  return refresh_races()",
	"end",
	"def refresh_races",
	"end"
    )

    const out = parseSource(src)

    const out2 = createSource(
	"export function save() {",
	'  return refreshRaces()',
	"}",
	"export function refreshRaces() {",
	"}"
    )
    
    expect(out).toEqual(out2)
})             

test("lone func call in class w/o parans ", () => {
    const src = createSource(
	"def save",
	"end",
	"class Klas",
	"  def refresh_races",
	"    save",
	"  end",
	"end"
    )

    const out = parseSource(src)

    const out2 = createSource(
	"export function save() {",
	"}",
	"export class Klas {",
	"  refreshRaces() {",
	"    return save()",
	"  }",
	"}"
    )
    
    expect(out).toEqual(out2)
})             

test("lone method call in class w/o parans ", () => {
    const src = createSource(
	"class Klas",
	"  def save",
	"  end",
	"  def refresh_races",
	"    save",
	"  end",
	"end"
    )

    const out = parseSource(src)

    const out2 = createSource(
	"export class Klas {",
	"  save() {",
	"  }",
	"  refreshRaces() {",
	"    return this.save()",
	"  }",
	"}"
    )
    
    expect(out).toEqual(out2)
})             

test("Method ref in method call params", () => {
    const src = createSource(
	"def namik",
	"end",
	"class Klas",
	"  def main",
	"    namik()",
	"    add_menu('kelle', kelle)",
	"  end",
	"  def kelle",
	"  end",
	"  def add_menu text, callback",
	"    callback.call",
	"  end",
	"end"
    )

    const out = parseSource(src)

    const out2 = createSource(
	"export function namik() {",
	"}",
	"export class Klas {",
	"  main() {",
	"    namik()",
	'    return this.addMenu("kelle", this.kelle)',
	"  }",
	"  kelle() {",
	"  }",
	"  addMenu(text, callback) {",
	"    return callback()",
	"  }",
	"}"
    )
    
    expect(out).toEqual(out2)
})             

