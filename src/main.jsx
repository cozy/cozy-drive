import './styles'

import { render, h } from 'preact'
import { I18n } from './plugins/preact-polyglot'
import App from './components/App'

const context = window.context || 'cozy'
const lang = document.documentElement.getAttribute('lang') || 'en'

document.addEventListener('DOMContentLoaded', () => {
  render((
    <I18n context={context} lang={lang}>
      <App/>
    </I18n>
  ), document.querySelector('[role=application]'))
})
