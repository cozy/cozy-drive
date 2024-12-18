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

jest.mock('cozy-dataproxy-lib', () => ({
  DataProxyProvider: ({ children }) => children,
  SearchDialog: () => <div>SearchDialog</div>,
  AssistantDialog: () => <div>AssistantDialog</div>,
  AssistantDesktop: () => <div>AssistantDesktop</div>
}))

// see https://github.com/jsdom/jsdom/issues/1695
window.HTMLElement.prototype.scroll = function () {}
