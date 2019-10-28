/* global __TARGET__ */

import styles from '../styles/layout'

import React from 'react'
import { translate } from 'cozy-ui/react/I18n'

import { Layout as LayoutUI, Main } from 'cozy-ui/react/Layout'
import Sidebar from 'cozy-ui/react/Sidebar'
import Nav, { NavItem, NavIcon, NavText, genNavLink } from 'cozy-ui/react/Nav'
import { Link as RRNavLink } from 'react-router'
import ButtonClient from '../../components/pushClient/Button'
import BannerClient from '../../components/pushClient/Banner'
import Alerter from 'cozy-ui/react/Alerter'
import { UploadQueue } from '../ducks/upload'
import { IconSprite } from 'cozy-ui/transpiled/react'
import { ModalManager } from 'react-cozy-helpers'

const NavLink = genNavLink(RRNavLink)

export const Layout = ({ t, children }) => (
  <LayoutUI>
    <Sidebar className={styles['pho-sidebar']}>
      <ModalManager />
      <Nav>
        <NavItem>
          <NavLink to="/photos">
            <NavIcon icon="image" />
            <NavText>{t('Nav.photos')}</NavText>
          </NavLink>
        </NavItem>
        <NavItem data-test-id="nav-to-albums">
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
    <Main className={styles['pho-content']}>
      {__TARGET__ !== 'mobile' && <BannerClient />}
      {children}
    </Main>
    <IconSprite />
  </LayoutUI>
)

export default translate()(Layout)
