import {describe, expect, test} from '@jest/globals'
import {createSource} from './utils'
import parseSource from '../src/rbs-loader'

test.skip("variable definition", () => {
    const src = createSource("a = 666")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test.skip("constant definition", () => {
    const src = createSource("PI = 3.14")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test.skip("global variable definition", () => {
    const src = createSource("$g = 666")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test("variable def and change", () => {
    const src = createSource(
	"a = 666",
	"a = 1")

    const out = parseSource(src)

    const out2 = createSource(
	"let a = 666",
	"a = 1"
    )
    expect(out).toEqual(out2)
})

test("variable def and change in if", () => {
    const src = createSource(
	"a = 666",
	"if true",
	"  a = 1",
	"end"
    )

    const out = parseSource(src)
    
    const out2 = createSource(
	"let a = 666",
	"if (true) {",
	"  a = 1",
	"}"
    )
    expect(out).toEqual(out2)
})

test("variable def in while and change in if", () => {
    const src = createSource(
	"while b < 10",
	"  a = 666",
	"  if true",
	"    print(a)",
	"  else",
	"    a = 3",
	"  end",
	"end"
    )

    const out = parseSource(src)
    
    const out2 = createSource(
	"while (b < 10) {",
	"  let a = 666",
	"  if (true) {",
	"    print(a)",
	"  } else {",
	"    a = 3",
	"  }",
	"}"
    )
    expect(out).toEqual(out2)
})



test.skip("member variable definition", () => {
    const src = createSource("@m = 666")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test.skip("class variable definition", () => {
    const src = createSource("@@s = 666")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})


test.skip("variable def and use", () => {
    const src = createSource(
	"a = 666",
	"a = a + 1")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test.skip("multi variable def and use", () => {
    const src = createSource(
	"a = 666",
	"$g = 333",
	"@m = 775",
	"@@c = 4",
	"a = a + $g + @m / @@c")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test.skip("multi assignment", () => {
    const src = createSource("a, b = 333, 666")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test.skip("swap", () => {
    const src = createSource("a, b = b, a")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test.skip("multi assignment II", () => {
    const src = createSource("a, *b = 333, 666, 4, 5, 9")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test.skip("decomposition", () => {
    const src = createSource("(a, b) = [1, 2]")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test.skip("decomposition II", () => {
    const src = createSource("a, (b, *c), *d = 1, [2, 3, 4], 5, 6")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test.skip("alias I", () => {
    const src = createSource("alias a b")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test.skip("alias II", () => {
    const src = createSource("alias :a :b")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test.skip("attribute assignment", () => {
    const src = createSource("obje.prop = 666")

    const out = parseSource(src)

    //expect(out).toEqual(out2)
})

test("return from stm I", () => {
    const src = createSource(
	"a = if true",
	"       333",
	"    else",
	"       666",
	"    end"
    )

    const out = parseSource(src)

    const out2 = createSource(
	"const a = (() => {",
	"    if (true) {",
	"       return 333",
	"    } else {",
	"       return 666",
	"    }",
	"    })()"
    )
    expect(out).toEqual(out2)
})

test("return from stm II", () => {
    const src = createSource(
	"a = ",
	"    if true",
	"       333",
	"    else",
	"       666",
	"    end"
    )

    const out = parseSource(src)

    const out2 = createSource(
	"const a = (() => {",
	"    if (true) {",
	"       return 333",
	"    } else {",
	"       return 666",
	"    }",
	"    })()"
    )
    expect(out).toEqual(out2)
})

test("return from stm as param I", () => {
    const src = createSource(
	"print(if true",
	'       "333"',
	"    else",
	'       "666"',
	"    end)"
    )

    const out = parseSource(src)
    
    const out2 = createSource(
	"print((() => {",
	"      if (true) {",
	'       return "333"',
	"      } else {",
	'       return "666"',
	"      }",
	"      })())"
    )
    expect(out).toEqual(out2)
})

test("return from stm III", () => {
    const src = createSource(
	"a = if true",
	"       333",
	"    else",
	"       666",
	"    end + ",
	"    case x",
	"    when 1 then 2",
	"    when 2 then 3",
	"    end"
    )

    const out = parseSource(src)

    const out2 = createSource(
	"const a = (() => {",
	"    if (true) {",
	"       return 333",
	"    } else {",
	"       return 666",
	"    }",
	"    })() + (() => {",
	"    switch (x) {",
	"    case 1:",
	"                return 2",
	"    case 2:",
	"                return 3",
	"    }",
	"    })()"
    )
    expect(out).toEqual(out2)
})

test("return from begin I", () => {
    const src = createSource(
	"a = begin",
	"       333",
	"    end"
    )

    const out = parseSource(src)
    
    const out2 = createSource(
	"const a = (() => {",
	"    {",
	"       return 333",
	"    }",
	"    })()"
    )
    expect(out).toEqual(out2)
})

test("return from begin II", () => {
    const src = createSource(
	"a = begin",
	"       y = 22",
	"       333",
	"    end"
    )

    const out = parseSource(src)

    const out2 = createSource(
	"const a = (() => {",
	"    {",
	"       const y = 22",
	"       return 333",
	"    }",
	"    })()"
    )
    expect(out).toEqual(out2)
})

test.skip("return from begin with let/const problem", () => {
    const src = createSource(
	"y = 11",
	"a = begin",
	"       y = 22",
	"       333",
	"    end"
    )

    const out = parseSource(src)
    console.log(out)

    const out2 = createSource(
	"let y = 11",
	"const a = (() => {",
	"    {",
	"       y = 22",
	"       return 333",
	"    }",
	"    })()"
    )
    expect(out).toEqual(out2)
})
