import BaseError from 'baseerr'

export class AbortError extends BaseError<{}> {
  constructor() {
    super('aborted')
  }
}

type Task<T> = (signal: AbortSignal) => Promise<T>

export default async function raceAbort<T>(
  signal: AbortSignal,
  taskOrPromise: Promise<T> | Task<T>,
): Promise<T> {
  let handleAbort: () => void
  try {
    return await new Promise((resolve, reject) => {
      handleAbort = () => reject(new AbortError())
      if (signal.aborted) handleAbort()
      signal.addEventListener('abort', handleAbort)
      const promise =
        typeof taskOrPromise === 'function'
          ? taskOrPromise(signal)
          : taskOrPromise
      promise.then(resolve, reject)
    })
  } finally {
    // @ts-ignore
    signal.removeEventListener('abort', handleAbort)
  }
}
