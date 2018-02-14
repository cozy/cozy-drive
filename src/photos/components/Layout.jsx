/* global __TARGET__ */

import styles from '../styles/layout'

import React from 'react'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'

import Sidebar from 'cozy-ui/react/Sidebar'
import Nav, { NavItem, NavIcon, NavText, genNavLink } from 'cozy-ui/react/Nav'
import { Link as RRNavLink } from 'react-router'
import ButtonClient from '../../components/pushClient/Button'
import BannerClient from '../../components/pushClient/Banner'
import Alerter from './Alerter'
import { UploadQueue } from '../ducks/upload'

const NavLink = genNavLink(RRNavLink)

export const Layout = ({ t, children }) => (
  <div className={classNames(styles['pho-wrapper'], styles['coz-sticky'])}>
    <Sidebar className={styles['pho-sidebar']}>
      <Nav>
        <NavItem>
          <NavLink to="/photos">
            <NavIcon icon="image" />
            <NavText>{t('Nav.photos')}</NavText>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/albums">
            <NavIcon icon="album" />
            <NavText>{t('Nav.albums')}</NavText>
          </NavLink>
        </NavItem>
      </Nav>
      <ButtonClient />
    </Sidebar>

    <Alerter t={t} />
    <UploadQueue />
    <main className={styles['pho-content']}>
      {__TARGET__ !== 'mobile' && <BannerClient />}
      {children}
    </main>
  </div>
)

export default translate()(Layout)
