export type Task<T> = (signal: AbortSignal) => Promise<T> | T
export type OptsType = {
  signal: AbortSignal
  AbortError: Function
}

// note: this is not a real error for performance reasons
// if abort errors occur frequently, creating error stacks
// can slow down your application.
// if you want AbortErrors to have stacks use ./raceAbortError
export class AbortError {
  name = 'AbortError'
  message = 'aborted'
  stack = 'AbortError: aborted'
}
Object.setPrototypeOf(AbortError.prototype, Error.prototype)

export default async function raceAbort<T>(
  opts: AbortSignal | OptsType,
  taskOrPromise: Promise<T> | Task<T> | T,
): Promise<T> {
  let signal: AbortSignal
  let _AbortError: any

  if ((opts as OptsType).signal) {
    signal = (opts as OptsType).signal
    _AbortError = (opts as OptsType).AbortError
  } else {
    signal = opts as AbortSignal
    _AbortError = AbortError // default to non-error AbortError class, for performance
  }

  let handleAbort: () => void
  try {
    return await new Promise((resolve, reject) => {
      handleAbort = () => reject(new _AbortError())
      if (signal.aborted) {
        // @ts-ignore - ignore promise errors
        if (taskOrPromise?.catch) taskOrPromise.catch((err) => {})
        return void handleAbort()
      }
      signal.addEventListener('abort', handleAbort)
      const promise = Promise.resolve<T>(
        typeof taskOrPromise === 'function'
          ? (taskOrPromise as Function)(signal)
          : taskOrPromise,
      )
      promise.then(resolve, reject)
    })
  } finally {
    // @ts-ignore
    signal.removeEventListener('abort', handleAbort)
  }
}
