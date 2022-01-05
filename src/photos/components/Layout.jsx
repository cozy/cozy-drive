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
import { Link as RRNavLink } from 'react-router'
import ButtonClient from '../../components/pushClient/Button'
import BannerClient from '../../components/pushClient/Banner'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { UploadQueue } from '../ducks/upload'
import { IconSprite } from 'cozy-ui/transpiled/react'
import { ModalManager } from 'react-cozy-helpers'
import { isFlagshipApp } from 'cozy-device-helper'

const NavLink = genNavLink(RRNavLink)

export const Layout = ({ t, children }) => (
  <LayoutUI>
    <Sidebar className={styles['pho-sidebar']}>
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
      {!isFlagshipApp() && <ButtonClient />}
    </Sidebar>

    <Alerter t={t} />
    <UploadQueue />
    <Main className={styles['pho-content']}>
      {__TARGET__ !== 'mobile' && !isFlagshipApp() && <BannerClient />}
      {children}
    </Main>
    <ModalManager />

    <IconSprite />
  </LayoutUI>
)

export default translate()(Layout)
