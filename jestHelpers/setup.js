import React from 'react'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

// To avoid the errors while creating theme (since no CSS stylesheet
// defining CSS variables is injected during tests)
// Material-UI: the color provided to augmentColor(color) is invalid.
// The color object needs to have a `main` property or a `500` property.
jest.mock('cozy-ui/transpiled/react/utils/color', () => ({
  ...jest.requireActual('cozy-ui/transpiled/react/utils/color'),
  getCssVariableValue: () => '#fff'
}))

jest.mock('cozy-keys-lib', () => ({
  withVaultUnlockContext: BaseComponent => {
    const Wrapper = props => {
      return <BaseComponent {...props} />
    }
    Wrapper.displayName = `withVaultUnlockContext(${
      BaseComponent.displayName || BaseComponent.name
    })`
    return Wrapper
  },
  withVaultClient: BaseComponent => {
    const Component = props => (
      <>
        {({ vaultClient }) => (
          <BaseComponent vaultClient={vaultClient} {...props} />
        )}
      </>
    )

    Component.displayName = `withVaultClient(${
      BaseComponent.displayName || BaseComponent.name
    })`

    return Component
  },
  useVaultUnlockContext: jest.fn().mockReturnValue(jest.fn()),
  useVaultClient: jest.fn()
}))

global.cozy = {
  bar: {
    BarLeft: () => null,
    BarRight: ({ children }) => children,
    BarCenter: () => null,
    setTheme: () => null
  }
}

Enzyme.configure({ adapter: new Adapter() })
