import { h } from 'preact'
import { translate } from '../plugins/preact-polyglot'

const App = ({ t }) => (
  <h1>{ t('welcome') }</h1>
)

export default translate()(App)
