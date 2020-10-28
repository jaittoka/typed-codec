import { Codec, success, Parse, Result, isSuccess, failKey } from "./core";

const map = <A, B>(f: Parse<A, B>) => (arr: A[]): Result<B[]> => {
  const result: B[] = []
  for (let i = 0; i < arr.length; i++) {
    const r = f(arr[i])
    if (isSuccess(r)) {
      result.push(r.value)
    } else {
      return failKey(r, String(i))
    }
  }
  return success(result)
}

export const ArrayCodec = <L, R>(codec: Codec<L, R>): Codec<L[], R[]> => ({
  left: map(codec.left),
  right: map(codec.right),
})