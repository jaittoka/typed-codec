
import { Codec, success, failure, isSuccess, failKey } from "./core";

type CodecObject<T> = { [K in keyof T]: Codec<T[K], unknown> }

type Optional<T, Opt extends keyof T> = { [K in Exclude<keyof T, Opt>]: T[K] } & { [K in Opt]?: T[K] }

export function ObjectCodec<T, K extends keyof T = never>(
  fields: CodecObject<T>, 
  optional: Array<K> = []
): Codec<Optional<T, K>, object> {
  return {
    left: (s) => {
      const keys = Object.keys(fields) as Array<keyof T>
      const result = {} as Optional<T, K>
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        if (key in s) {
          const r = fields[key].left((s as any)[key])
          if (isSuccess(r)) {
            (result as any)[key] = r.value
          } else {
            return failKey(r, String(key))
          }
        } else if (optional.indexOf(key as any) < 0) {
          return failure('expected_property', String(key))
        }
      }
      return success(result)
    },
    right: success
  }
}
