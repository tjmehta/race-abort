# raceAbort

utility to race a promise with an abort signal. for wrapping non-abortable promises.

# Installation

```sh
npm i --save race-abort
```

# Usage

#### Supports both ESM and CommonJS

```js
// esm
import raceAbort from 'race-abort`
// commonjs
const raceAbort = require('race-abort').default
```

#### Promise wins race against abort

```js
import raceAbort from 'race-abort`
import {promises as fs} from 'fs'

async function fooTask(signal) {
  const json = await fetch('https://google.com', { signal }).then(res => res.toJSON())
  // check if aborted before running task
  if (signal.aborted) throw new AbortError()
  await raceAbort(signal, fs.writeFile(json.filename, json.body))
}
```

#### Async task race against abort

```js
import raceAbort from 'race-abort`
import {promises as fs} from 'fs'
// for node.js import abort-controller
// in browser use AbortController global - https://developer.mozilla.org/en-US/docs/Web/API/AbortController
import AbortController from 'abort-controller'

async function fooTask(signal) {
  const json = await fetch('https://google.com', { signal }).then(res => res.toJSON())
  await raceAbort(signal, () => fs.writeFile(json.filename, json.body)) // task get's signal as an argument if you need it
}

const controller = new AbortController()

fooTask(controller.signal).then((result) => {
  // result is writeFile result
})
```

#### Async task loses against abort

```js
import raceAbort from 'race-abort`
import {promises as fs} from 'fs'
// for node.js import abort-controller
// in browser use AbortController global - https://developer.mozilla.org/en-US/docs/Web/API/AbortController
import AbortController from 'abort-controller'

async function fooTask(signal) {
  const json = await fetch('https://google.com', { signal }).then(res => res.toJSON())
  await raceAbort(signal, () => fs.writeFile(json.filename, json.body)) // task get's signal as an argument if you need it
}

const controller = new AbortController()
controller.abort()

fooTask.catch(err => {
  if (err.name === 'AbortError') {
    // task aborted via abort signal
  }
})
```

#### Note about AbortError and Performance

For performance reasons, AbortError does not extend the Error class and does not have stacks. If you want AbortError to be a real Error use `race-abort/raceAbortError`

```js
import raceAbortError from 'race-abort/raceAbortError`
import {promises as fs} from 'fs'
// for node.js import abort-controller
// in browser use AbortController global - https://developer.mozilla.org/en-US/docs/Web/API/AbortController
import AbortController from 'abort-controller'

async function fooTask(signal) {
  const json = await fetch('https://google.com', { signal }).then(res => res.toJSON())
  await raceAbort(signal, () => fs.writeFile(json.filename, json.body)) // task get's signal as an argument if you need it
}

const controller = new AbortController()
controller.abort()

fooTask(controller.signal).catch(err => {
  if (err.name === 'AbortError') {
    console.log(err instanceof Error) // true
    // task aborted via abort signal
  }
})
```

# License

MIT
