import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import React from 'react'

global.cozy = {}

jest.mock('cozy-bar', () => ({
  ...jest.requireActual('cozy-bar'),
  BarComponent: () => <div>Bar</div>,
  BarLeft: ({ children }) => children,
  BarRight: ({ children }) => children,
  BarCenter: ({ children }) => children,
  BarSearch: ({ children }) => children
}))

jest.mock('cozy-intent', () => ({
  useWebviewIntent: jest.fn()
}))

Enzyme.configure({ adapter: new Adapter() })
// see https://github.com/jsdom/jsdom/issues/1695
window.HTMLElement.prototype.scroll = function () {}
