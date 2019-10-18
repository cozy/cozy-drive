import 'cozy-ui/transpiled/react/stylesheet.css'
import 'cozy-ui/dist/cozy-ui.utils.min.css'
import mainStyles from 'drive/styles/main.styl'
import mobileStyles from 'drive/styles/mobile.styl'
import 'cozy-scanner/dist/stylesheet.css'

import 'whatwg-fetch'
import InitAppMobile from './InitAppMobile'

const app = new InitAppMobile()

export default app.initialize()
