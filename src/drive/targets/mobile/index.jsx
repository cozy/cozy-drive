import 'cozy-ui/dist/cozy-ui.utils.min.css'
import 'cozy-ui/transpiled/react/stylesheet.css'
import mobileStyles from 'styles/mobile.styl'

import 'whatwg-fetch'
import InitAppMobile from './InitAppMobile'

const app = new InitAppMobile()

export default app.initialize()
