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

global.cozy = {}

jest.mock('cozy-bar/transpiled', () => ({
  BarLeft: ({ children }) => children,
  BarRight: ({ children }) => children,
  BarCenter: ({ children }) => children,
  setTheme: () => null
}))

Enzyme.configure({ adapter: new Adapter() })
