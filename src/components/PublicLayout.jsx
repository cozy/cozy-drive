import React from 'react'
import classNames from 'classnames'
import { Alerter } from 'cozy-ui/react/Alerter'
import { ButtonClientWeb as ButtonClient } from '../components/ButtonClient'

import styles from '../styles/layout'
import sidebarStyles from '../styles/sidebar'
import navStyles from '../styles/nav'

const PublicLayout = ({ children }) => (
  <div class={classNames(styles['fil-wrapper'], styles['coz-sticky'])}>
    <aside class={sidebarStyles['fil-sidebar']}>
      <nav>
        <ul class={navStyles['coz-nav']} />
      </nav>
      <ButtonClient />
    </aside>
    <Alerter />
    {children}
  </div>
)

export default PublicLayout
