'use strict'

import { getParentLink, splitFilename } from './File'
import { FILE_TYPE, DIR_TYPE } from 'drive/web/modules/drive/files'

describe('getParentLink function', () => {
  it('should return the first link in the element ancestors', () => {
    const div = document.createElement('div')
    const link = document.createElement('a')
    link.className = 'my-link'
    const span = document.createElement('span')
    const span2 = document.createElement('span')
    div.appendChild(link)
    link.appendChild(span)
    span.appendChild(span2)
    const result = getParentLink(span2)
    expect(result).toEqual(link)
  })

  it('should return null if there is no link in the element ancestors', () => {
    const div = document.createElement('div')
    const span = document.createElement('span')
    div.appendChild(span)
    const result = getParentLink(span)
    expect(result).toBeNull()
  })
})

describe('splitFilename function', () => {
  const name = ({ filename, extension }) => filename + extension
  const doc = type => expectation => ({ type, name: name(expectation) })
  const file = doc(FILE_TYPE)
  const dir = doc(DIR_TYPE)
  const { stringify } = JSON

  const scenarios = [
    { filename: 'file', extension: '.ext' },
    // FIXME: { filename: 'file', extension: '' },
    { filename: 'file.html', extension: '.ejs' },
    { filename: 'file', extension: '.' },
    { filename: 'file.', extension: '.' },
    { filename: 'file.', extension: '.ext' },
    // FIXME: { filename: '.file', extension: '' },
    { filename: '.file', extension: '.ext' }
  ]

  for (const expectation of scenarios) {
    it(`splits ${stringify(name(expectation))} into ${stringify(
      expectation
    )}`, () => {
      expect(splitFilename(file(expectation))).toEqual(expectation)
    })
  }

  it('never splits a dirname', () => {
    const expectations = scenarios.map(scenario => ({
      filename: name(scenario),
      extension: ''
    }))
    const results = scenarios.map(expectation =>
      splitFilename(dir(expectation))
    )
    expect(results).toEqual(expectations)
  })
})
