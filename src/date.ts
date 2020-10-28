import { Codec, failure, success } from "./core"

export const DateString: Codec<Date, string> = {
  left: (s) => {
    const result = new Date(s)
    return isNaN(result.getTime()) ? failure('expected_date_string') : success(result)
  },
  right: (d) => success(d.toString())
}
