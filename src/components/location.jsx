import styles from '../styles/location'

import { h } from 'preact'
import { translate } from '../plugins/preact-polyglot'

const Location = ({ t }) => (
  <h2 class={ styles['fil-content-title'] }>{ t('Files') }</h2>
)

export default translate()(Location)
