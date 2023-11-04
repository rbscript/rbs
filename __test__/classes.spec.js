import {describe, expect, test} from '@jest/globals'
import {createSource} from './utils'
import parseSource from '../src/rbs-loader'

test("simple class", () => {
    const src = createSource(
	"class Animal",
	"end")
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})             

test("simple inheritance", () => {
    const src = createSource(
	"class Animal",
	"end",
	"class Human < Animal",
	"end")
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})             

test("class with constructor", () => {
    const src = createSource(
	"class Animal",
	"  def initialize",
	"    @eye_color = 'blue'",
	"  end",
	"end")
    const out = parseSource(src)

    //expect(out).toEqual(out2)
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

    //expect(out).toEqual(out2)
})             

test("class with a private method", () => {
    const src = createSource(
	"class Animal",
	"  private",
	"  def meow a",
	"  end",
	"end")
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})             

test("class with a private method 2", () => {
    const src = createSource(
	"class Animal",
	"  def meow a",
	"  end",
	"  private :meow",
	"end")
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})             

test("class with a protected method", () => {
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

    //expect(out).toEqual(out2)
})             

test("class method", () => {
    const src = createSource(
	"class Animal",
	"  def self.deneme a, b",
	"    @@eye_color = 'blue'",
	"  end",
	"end")
    const out = parseSource(src)

    //expect(out).toEqual(out2)
})             

test("singleton class method", () => {
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
