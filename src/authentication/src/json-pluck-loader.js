/**
 * Plucks a JSON
 *
 * en.json
 *
 * ```
 * {
 *   a: 1,
 *   b: {
 *     c: {
 *        d: 4
 *     },
 *     e: 5
 *   }
 * }
 * ```
 *
 * `json-pluck-loader?key=b.c!en.json` result will be :
 *
 * ```{ b: { c: { d: 4 }}}```
 *
 * `json-pluck-loader?key=a!en.json` result will be :
 *
 * ```{ a: 1}```
 *
 */

const { getOptions } = require('loader-utils')

module.exports = function loader(source) {
  const options = getOptions(this)
  const res = {}
  const all = JSON.parse(source)

  const paths = options.key.split(';')
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i].split('.')
    const l = path.length
    let leaf = all
    let curRes = res
    for (var j = 0; j < l; j++) {
      const token = path[j]
      leaf = leaf[token]
      curRes[token] = j === l - 1 ? leaf : curRes[token] || {}
      curRes = curRes[token]
    }
  }

  return `module.exports = ${JSON.stringify(res)}`
}
