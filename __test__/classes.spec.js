import {describe, expect, test} from '@jest/globals'
import {createSource} from './utils'
import parseSource from '../src/rbs-loader'

test("simple class", () => {
    const src = createSource(
	"class Animal",
	"end")
    const out = parseSource(src)

    const out2 = createSource(
	"class Animal {",
	"}"
    )
    expect(out).toEqual(out2)
})             

test("simple inheritance", () => {
    const src = createSource(
	"class Animal",
	"end",
	"class Human < Animal",
	"end")
    const out = parseSource(src)

    const out2 = createSource(
	"class Animal {",
	"}",
	"class Human extends Animal {",
	"}"
    )
    expect(out).toEqual(out2)

})             

test("class with constructor", () => {
    const src = createSource(
	"class Animal",
	"  def initialize",
	"    @eye_color = 'blue'",
	"  end",
	"end")
    const out = parseSource(src)
    
    const out2 = createSource(
	"class Animal {",
	"  constructor() {",
	'    this._eyeColor = "blue"',
	"  }",
	"}"
    )
    expect(out).toEqual(out2)
})             

test("class with constructor and a method", () => {
    const src = createSource(
	"class Animal",
	"  def initialize",
	"    @eye_color = 'blue'",
	"  end",
	"  def meow a",
	"    if @eye_color == 'blue'",
	"      hello # :)",
	"    end",
	"  end",
	"end")
    const out = parseSource(src)

    const out2 = createSource(
	"class Animal {",
	"  constructor() {",
	'    this._eyeColor = "blue"',
	"  }",
	"  meow(a) {",
	'    if (this._eyeColor == "blue") {',
	"      hello", // TODO NODE_VCALL Represents a local variable or a method call without an explicit receiver, to be determined at run-time.
	"    }",
	"  }",
	"}"
    )

    expect(out).toEqual(out2)
})             

test.skip("class with a private method", () => {
    const src = createSource(
	"class Animal",
	"  private",
	"  def meow a",
	"  end",
	"end")
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})             

test.skip("class with a private method 2", () => {
    const src = createSource(
	"class Animal",
	"  def meow a",
	"  end",
	"  private :meow",
	"end")
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})             

test.skip("class with a protected method", () => {
    const src = createSource(
	"class Animal",
	"  protected",
	"  def say_meow a",
	"  end",
	"end")
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})             


test("class with getter, setter and auto return", () => {
    const src = createSource(
	"class Team",
	"  def result",
	"    @result",
	"  end",
	"  def result= value",
	"    @result = value",
	"  end",
	"end")
    const out = parseSource(src)

    const out2 = createSource(
	"class Team {",
	"  get result() {",
	"    return this._result",
	"  }",
	"  set result(value) {",
	"    this._result = value",
	"  }",
	"}"
    )
    
    expect(out).toEqual(out2)
})             

test.skip("class method", () => {
    const src = createSource(
	"class Animal",
	"  def self.deneme a, b",
	"    @@eye_color = 'blue'",
	"  end",
	"end")
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})             

test.skip("singleton class method", () => {
    const src = createSource(
	"class Animal",
	"  class << self",
	"    def mystatic",
	"      @@eye_color = 'blue'",
	"    end",
	"  end",
	"end")
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})             

test.skip("New animal", () => {
    const src = createSource(
	"class Animal",
	"end",
	"a = Animal.new"
    )
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})             


test.skip("Simple module", () => {
    const src = createSource(
	"module M",
	"end"
    )
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})  

test.skip("Nested modules I", () => {
    const src = createSource(
	"module Outer",
	"  module Inner",
	"  end",
	"end"
    )
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})  

test.skip("Nested modules II", () => {
    const src = createSource(
	"module Outer::Inner::Child",
	"  module Grandson",
	"  end",
	"end"
    )
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})  

test.skip("Nested modules III", () => {
    const src = createSource(
	"module A",
	"  Z = 1",
	"  module B",
	"    p Module.nesting #=> [A::B, A]",
	"    p Z #=> 1",
	"  end",
	"end"
    )
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})  

test.skip("Nested modules IVo", () => {
    const src = createSource(
	"Z = 0",
	"module A",
	"  Z = 1",
	"  module B",
	"    p ::Z #=> 0",
	"  end",
	"end"
    )
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})  

test.skip("Including modules", () => {
    const src = createSource(
	"module A",
	"  def add a, b",
	"    a + b",
	"  end",
	"end",
	"class Klas",
	"  include A",
	"end"
    )
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})  

test.skip("Including modules", () => {
    const src = createSource(
	"module A",
	"  def add a, b",
	"    a + b",
	"  end",
	"end",
	"class Klas",
	"  include A",
	"end"
    )
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})  

test("constructor with super", () => {
    const src = createSource(
	"class Animal < Creature",
	"  def initialize(a, b)",
	"    super(a, b)",
	"    @eye_color = 'blue'",
	"  end",
	"end")
    const out = parseSource(src)
    console.log(out)
    
    const out2 = createSource(
	"class Animal extends Creature {",
	"  constructor(a, b) {",
	"    super(a, b)",
	'    this._eyeColor = "blue"',
	"  }",
	"}"
    )

    expect(out).toEqual(out2)
})             

test.skip("method with super", () => {
    const src = createSource(
	"class Animal",
	"  def initialize(a, b)",
	"    @eye_color = 'blue'",
	"    super.do_something",
	"  end",
	"end")
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})             

test.skip("method with super", () => {
    const src = createSource(
	"class Animal",
	"  def initialize(a, b)",
	"    @eye_color = 'blue'",
	"    super.do_something",
	"  end",
	"end")
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})             

test.skip("using", () => {
    const src = createSource(
	"using Kullan",
    )
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})             

test.skip("refine", () => {
    const src = createSource(
	"refine A do",
	"end"
    )
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})             

test.skip("require", () => {
    const src = createSource(
	"require 'C'"
    )
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})             

