import raceAbort, { Task } from './index'

import BaseError from 'baseerr'

export class AbortError extends BaseError<{}> {
  constructor() {
    super('aborted')
  }
}

export default async function raceAbortError<T>(
  signal: AbortSignal,
  taskOrPromise: Promise<T> | Task<T> | T,
): Promise<T> {
  return raceAbort(
    {
      signal,
      AbortError,
    },
    taskOrPromise,
  )
}
