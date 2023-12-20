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
	'    this.#eyeColor = "blue"',
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
	'    this.#eyeColor = "blue"',
	"  }",
	"  meow(a) {",
	'    if (this.#eyeColor == "blue") {',
	"      hello", // TODO NODE_VCALL Represents a local variable or a method call without an explicit receiver, to be determined at run-time.
	"    }",
	"  }",
	"}"
    )

    expect(out).toEqual(out2)
})             

test("class with a private method", () => {
    const src = createSource(
	"class Animal",
	"  private",
	"  def meow a",
	"  end",
	"end")
    const out = parseSource(src)
    
    const out2 = createSource(
	"class Animal {",
	"  #meow(a) {",
	"  }",
	"}"
    )
    
    expect(out).toEqual(out2)
})             

test("class with a private method 2", () => {
    const src = createSource(
	"class Animal",
	"  def meow a",
	"  end",
	"  private :meow",
	"end")
    const out = parseSource(src)
    
    const out2 = createSource(
	"class Animal {",
	"  #meow(a) {",
	"  }",
	"}"
    )
    
    expect(out).toEqual(out2)
})             

test("class with a protected method", () => {
    const src = createSource(
	"class Animal",
	"  protected",
	"  def say_meow a",
	"  end",
	"end")
    const out = parseSource(src)

    const out2 = createSource(
	"class Animal {",
	"  _sayMeow(a) {",
	"  }",
	"}"
    )

    expect(out).toEqual(out2)
})             

test("class with a protected method but private property", () => {
    const src = createSource(
	"class Animal",
	"  protected",
	"  def say_meow a",
	"    @said = true",
	"  end",
	"end")
    const out = parseSource(src)

    const out2 = createSource(
	"class Animal {",
	"  _sayMeow(a) {",
	"    this.#said = true",
	"  }",
	"}"
    )

    expect(out).toEqual(out2)
})             


test("class with an ambigious no-param method", () => {
    const src = createSource(
	"class Animal",
	"  def say_meow",
	"    print 'miyav'",
	"  end",
	"  def f()",
	"    say_meow",
	"  end",
	"end")
    const out = parseSource(src)

    const out2 = createSource(
	"class Animal {",
	"  sayMeow() {",
	'    print("miyav")',
	"  }",
	"  f() {",
	"    this.sayMeow()",
	"  }",
	"}"
    )

    expect(out).toEqual(out2)
})             


function animalClassForRuby() {
    return createSource(
	"class Animal",
	"  def say_meow",
	'    print "miyav"',
	"  end",
	"  protected",
	"  @lives",
	"  public",
	"  def lives",
	"    @lives",
	"  end",
	"end"
    )
}

function animalClassForJs() {
    return createSource(
	"class Animal {",
	"  sayMeow() {",
	'    print("miyav")',
	"  }",
	"  _lives",
	"  get lives() {",
	"    return this._lives",
	"  }",
	"}"
    )
}

test("class using protected & public property", () => {
    const src = createSource(
	animalClassForRuby()
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	animalClassForJs()
    )

    expect(out).toEqual(out2)
})

test("class inheritance using protected & public property", () => {
    const src = createSource(
	animalClassForRuby(),
	"class Human < Animal",
	"  def g",
	"    @lives = 1",
	"  end",
	"end"
    )
    const out = parseSource(src)
    
    const out2 = createSource(
	animalClassForJs(),
	"class Human extends Animal {",
	"  g() {",
	"    this._lives = 1",
	"  }",
	"}"
    )

    expect(out).toEqual(out2)
})



test("class with a protected method but private property", () => {
    const src = createSource(
	"class Animal",
	"  protected",
	"  @said = false",
	"  def say_meow a",
	"    @said = true",
	"  end",
	"end")
    const out = parseSource(src)
    
    const out2 = createSource(
	"class Animal {",
	"  _said = false",
	"  _sayMeow(a) {",
	"    this._said = true",
	"  }",
	"}"
    )

    expect(out).toEqual(out2)
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
	"    return this.#result",
	"  }",
	"  set result(value) {",
	"    this.#result = value",
	"  }",
	"}"
    )
    
    expect(out).toEqual(out2)
})             

test("class method", () => {
    const src = createSource(
	"class Animal",
	"  @@eye_color",
	"  def self.deneme a, b",
	"    @@eye_color = 'blue'",
	"  end",
	"end")
    const out = parseSource(src)
    
    const out2 = createSource(
	"class Animal {",
	"  static #eyeColor",
	"  static deneme(a, b) {",
	'    Animal.#eyeColor = "blue"',
	"  }",
	"}"
    )

    expect(out).toEqual(out2)
})             

test("class properties", () => {
    const src = createSource(
	"class Animal",
	"  @@eye_color",
	"  def self.eye_color",
	"    @@eye_color",
	"  end",
	"  def self.eye_color=value",
	"    @@eye_color = value",
	"  end",
	"end")
    const out = parseSource(src)

    const out2 = createSource(
	"class Animal {",
	"  static #eyeColor",
	"  static get eyeColor() {",
	'    return Animal.#eyeColor',
	"  }",
	"  static set eyeColor(value) {",
	'    Animal.#eyeColor = value',
	"  }",
	"}"
    )

    expect(out).toEqual(out2)
})             

test.skip("class constant I", () => {
    const src = createSource(
	"class Animal",
	"  Cat",
	"end")
    const out = parseSource(src)

    const out2 = createSource(
	"class Animal {",
	"  Cat",
	"}"
    )

    expect(out).toEqual(out2)
})             

test("class constant II", () => {
    const src = createSource(
	"class Animal",
	"  Cat = 'cat'",
	"end")
    const out = parseSource(src)

    const out2 = createSource(
	"class Animal {",
	'  static #Cat = "cat"',
	"  static get Cat() {",
	'  return Animal.#Cat',
	"  }",
	"}"
    )

    expect(out).toEqual(out2)
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
    
    const out2 = createSource(
	"class Animal extends Creature {",
	"  constructor(a, b) {",
	"    super(a, b)",
	'    this.#eyeColor = "blue"',
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

