/* global __TARGET__ */

import styles from '../styles/layout'

import React from 'react'
import { translate } from 'cozy-ui/transpiled/react/I18n'

import { Layout as LayoutUI, Main } from 'cozy-ui/transpiled/react/Layout'
import Sidebar from 'cozy-ui/transpiled/react/Sidebar'
import Nav, {
  NavItem,
  NavIcon,
  NavText,
  genNavLink
} from 'cozy-ui/transpiled/react/Nav'
import { Link } from 'react-router-dom'
import ButtonClient from '../../components/pushClient/Button'
import BannerClient from '../../components/pushClient/Banner'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { UploadQueue } from '../ducks/upload'
import Sprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import { ModalManager } from 'react-cozy-helpers'
import { isFlagshipApp } from 'cozy-device-helper'
import { Outlet } from 'react-router-dom'

// TODO : apply style back on active
const NavLink = genNavLink(Link)

export const Layout = ({ t }) => (
  <LayoutUI>
    <Sidebar className={styles['pho-sidebar']}>
      <Nav>
        <NavItem>
          <NavLink to="/photos">
            <NavIcon icon="image" />
            <NavText>{t('Nav.photos')}</NavText>
          </NavLink>
        </NavItem>
        <NavItem data-testid="nav-to-albums">
          <NavLink to="/albums">
            <NavIcon icon="album" />
            <NavText>{t('Nav.albums')}</NavText>
          </NavLink>
        </NavItem>
      </Nav>
      {!isFlagshipApp() && <ButtonClient />}
    </Sidebar>

    <Alerter t={t} />
    <UploadQueue />
    <Main className={styles['pho-content']}>
      {__TARGET__ !== 'mobile' && !isFlagshipApp() && <BannerClient />}
      <Outlet />
    </Main>
    <ModalManager />

    <Sprite />
  </LayoutUI>
)

export default translate()(Layout)
