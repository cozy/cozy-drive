import styles from '../styles/nav'

import { h } from 'preact'
import { translate } from '../plugins/preact-polyglot'
import classNames from 'classnames'

const Nav = ({ t }) => (
  <nav>
    <ul class={ styles['fil-nav'] }>
      <li class={ styles['fil-nav-item'] }>
        <a href="#files" class={ classNames(styles['fil-cat-files'], styles['active']) }>{ t('Files') }</a>
      </li>
      <li class={ styles['fil-nav-item'] }>
        <a href="#recent" class={ styles['fil-cat-recent'] }>{ t('Recent') }</a>
      </li>
      <li class={ styles['fil-nav-item'] }>
        <a href="#shared" class={ styles['fil-cat-shared'] }>{ t('Shared by me') }</a>
      </li>
      <li class={ styles['fil-nav-item'] }>
        <a href="#activity" class={ styles['fil-cat-activity'] }>{ t('Activity') }</a>
      </li>
      <li class={ styles['fil-nav-item'] }>
        <a href="#trash" class={ styles['fil-cat-trash'] }>{ t('Trash') }</a>
      </li>
    </ul>
  </nav>
)

export default translate()(Nav)
