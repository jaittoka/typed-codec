import { Codec, success, failure } from "./core"

interface TaggedInteger {
  readonly integer_tag: unique symbol
}

type Integer = number & TaggedInteger

function isInteger(n: number): n is Integer {
  return isFinite(n) && Math.floor(n) === n
}

export const IntegerNumber: Codec<Integer, number> = {
  left: (s) => isInteger(s) ? success(s) : failure('expected_integer'),
  right: success,
}
