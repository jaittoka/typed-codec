import { Codec, success, failure } from "./core"
import { TypeName, TypeFromName, isOfType } from "./getType"

function basicCodec<T extends TypeName>(typeName: T): Codec<TypeFromName[T], unknown> {
  return {
    left: (u: unknown) =>  isOfType(typeName, u) ? success(u) : failure(`expected ${typeName}`),
    right: success,
  }  
}

export const Identity: Codec<unknown, unknown> = {
  left: success,
  right: success,
}
export const Undefined = basicCodec('Undefined')
export const Null = basicCodec('Null')
export const Boolean = basicCodec('Boolean')
export const String = basicCodec('String')
export const Number = basicCodec('Number')
export const Date = basicCodec('Date')
export const Function = basicCodec('Function')
export const Array = basicCodec('Array')
export const Object = basicCodec('Object')
