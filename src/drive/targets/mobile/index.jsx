import 'cozy-ui/dist/cozy-ui.utils.min.css'
import mobileStyles from 'drive/styles/mobile.styl'

import 'whatwg-fetch'
import InitAppMobile from './InitAppMobile'

const app = new InitAppMobile()

export default app.initialize()
