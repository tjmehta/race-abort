import raceAbort, { AbortError } from '../index'

import AbortController from 'abort-controller'

describe('raceAbort', () => {
  describe('promise wins race', () => {
    it('should resolve value if racing a resolved promise', async () => {
      const controller = new AbortController()
      const val = {}
      await expect(
        raceAbort(controller.signal, Promise.resolve(val)),
      ).resolves.toBe(val)
    })

    it('should reject error if racing a rejected promise', async () => {
      const controller = new AbortController()
      const err = new Error('boom')
      await expect(
        raceAbort(controller.signal, Promise.reject(err)),
      ).rejects.toBe(err)
    })
  })

  describe('signal is aborted', () => {
    it('should reject with AbortError when racing a resolved promise', async () => {
      const controller = new AbortController()
      controller.abort()
      const val = {}
      await expect(
        raceAbort(controller.signal, Promise.resolve(val)),
      ).rejects.toBeInstanceOf(AbortError)
    })

    it('should reject with AbortError when racing a rejected promise', async () => {
      const controller = new AbortController()
      controller.abort()
      const err = new Error('boom')
      await expect(
        raceAbort(controller.signal, Promise.reject(err)),
      ).rejects.toBeInstanceOf(AbortError)
    })
  })

  describe('signal wins race', () => {
    it('should reject with AbortError when racing an unsettled promise', async () => {
      const controller = new AbortController()
      setTimeout(() => controller.abort(), 10)
      await expect(
        raceAbort(controller.signal, new Promise((resolve) => {})),
      ).rejects.toBeInstanceOf(AbortError)
    })

    it('should reject with AbortError when racing an unsettled promise', async () => {
      const controller = new AbortController()
      setTimeout(() => controller.abort(), 10)
      await expect(
        raceAbort(controller.signal, new Promise((resolve) => {})),
      ).rejects.toBeInstanceOf(AbortError)
    })
  })

  describe('race task', () => {
    describe('promise wins race', () => {
      it('should resolve value if racing a resolved promise', async () => {
        const controller = new AbortController()
        const val = {}
        await expect(
          raceAbort(controller.signal, () => Promise.resolve(val)),
        ).resolves.toBe(val)
      })

      it('should reject error if racing a rejected promise', async () => {
        const controller = new AbortController()
        const err = new Error('boom')
        await expect(
          raceAbort(controller.signal, () => Promise.reject(err)),
        ).rejects.toBe(err)
      })
    })

    describe('signal is aborted', () => {
      it('should reject with AbortError when racing a resolved promise', async () => {
        const controller = new AbortController()
        controller.abort()
        const val = {}
        await expect(
          raceAbort(controller.signal, () => Promise.resolve(val)),
        ).rejects.toBeInstanceOf(AbortError)
      })

      it('should reject with AbortError when racing a rejected promise', async () => {
        const controller = new AbortController()
        controller.abort()
        const err = new Error('boom')
        await expect(
          raceAbort(controller.signal, () => Promise.reject(err)),
        ).rejects.toBeInstanceOf(AbortError)
      })
    })

    describe('signal wins race', () => {
      it('should reject with AbortError when racing an unsettled promise', async () => {
        const controller = new AbortController()
        setTimeout(() => controller.abort(), 10)
        await expect(
          raceAbort(controller.signal, () => new Promise((resolve) => {})),
        ).rejects.toBeInstanceOf(AbortError)
      })

      it('should reject with AbortError when racing an unsettled promise', async () => {
        const controller = new AbortController()
        setTimeout(() => controller.abort(), 10)
        await expect(
          raceAbort(controller.signal, () => new Promise((resolve) => {})),
        ).rejects.toBeInstanceOf(AbortError)
      })
    })

    describe('task returns value', () => {
      it('should resolve value if racing a task that returns a value', async () => {
        const controller = new AbortController()
        const val = {}
        await expect(raceAbort(controller.signal, () => val)).resolves.toBe(val)
      })
    })
  })
})
