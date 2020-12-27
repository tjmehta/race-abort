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

async function fooTask(signal) {
  const json = await fetch('https://google.com', { signal }).then(res => res.toJSON())
  await raceAbort(signal, () => fs.writeFile(json.filename, json.body)) // task get's signal as an argument if you need it
}
```

# License

MIT
