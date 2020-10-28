export type Success<T> = { success: true, value: T }

export type Failure = { success: false, error: string, path?: string }

export type Result<T> = Success<T> | Failure

export type Parse<S, T>  = (s: S) => Result<T>

export interface Codec<L, R> {
  readonly left: Parse<R, L>
  readonly right: Parse<L, R>
}

export interface Piper<L, R> extends Codec<L, R> {
  readonly p: <T>(codec: Codec<R, T>) => Piper<L, T> 
}

export type Id<T> = { [K in keyof T]: T[K] }

export type Left<T> = T extends Codec<infer L, any> ? Id<L> : never

export type Right<T> = T extends Codec<any, infer R> ? Id<R> : never

export function isSuccess(v: Result<unknown>): v is Success<unknown> {
  return v.success
}

export function isFailure(v: Result<unknown>): v is Success<unknown> {
  return !v.success
}

export function success<T>(value: T): Result<T> {
  return { success: true, value }
}

export function failure(error: string, path?: string): Result<never> {
  return { success: false, error, path }
}

const joinPath = (parent: string | undefined, key: string): string => parent !== undefined ? `${parent}.${key}` : key

export function failKey(f: Failure, key: string): Result<never> {
  return { success: false, error: f.error, path: joinPath(f.path, key) }
}

export function succeed<T>(value: T): Parse<any, T> {
  return () => success(value)
}

export function fail(error: string, path?: string): Parse<any, never> {
  return () => failure(error, path)
}

export const pipeParse = <A, B, C>(f: Parse<A, B>, g: Parse<B, C>): Parse<A, C> => (a) => {
  const result = f(a)
  return isSuccess(result) ? g(result.value) : result
}

export const pipe = <L, C, R>(c1: Codec<L, C>, c2: Codec<C, R>): Codec<L, R> => ({
  left: pipeParse(c2.left, c1.left),
  right: pipeParse(c1.right, c2.right),
})

export const toParse = <A, B>(f: (a: A) => B): Parse<A, B> => (a) => success(f(a))

export function piper<L, R>(codec: Codec<L, R>): Piper<L, R> {
  return {
    ...codec,
    p<T>(other: Codec<R, T>): Piper<L, T> {
      return piper(pipe(codec, other))
    },
  }
}
