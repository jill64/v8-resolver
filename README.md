<!----- BEGIN GHOST DOCS HEADER ----->

#

<!----- BEGIN GHOST DOCS BADGES ----->

<a href="https://github.com/jill64/v8-resolver/actions/workflows/ci.yml"><img src="https://github.com/jill64/v8-resolver/actions/workflows/ci.yml/badge.svg" alt="ci.yml" /></a>

<!----- END GHOST DOCS BADGES ----->

<!----- END GHOST DOCS HEADER ----->

Convert from V8 coverage of JS files built from multiple sources to V8 coverage of source files.

## Installation

```sh
npm i @jill64/v8-resolver
```

## Usage

```js
import { resolve } from '@jill64/v8-resolver'

const result = await resolve(/* ... Node V8 Coverage Data ... */)
```

## Convert from file path

```js
import { resolve, fromPath } from '@jill64/v8-resolver'

const result = await resolve(fromPath('/path/to/coverage-file.json'))
```

<!----- BEGIN GHOST DOCS FOOTER ----->

## License

[MIT](LICENSE)

<!----- END GHOST DOCS FOOTER ----->

```

```
