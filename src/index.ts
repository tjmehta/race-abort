import BaseError from 'baseerr'

export class AbortError extends BaseError<{}> {
  constructor() {
    super('aborted')
  }
}

type Task<T> = (signal: AbortSignal) => Promise<T> | T

export default async function raceAbort<T>(
  signal: AbortSignal,
  taskOrPromise: Promise<T> | Task<T> | T,
): Promise<T> {
  let handleAbort: () => void
  try {
    return await new Promise((resolve, reject) => {
      handleAbort = () => reject(new AbortError())
      if (signal.aborted) handleAbort()
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
