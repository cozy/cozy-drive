import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { useLocation } from 'react-router-dom'

import flag from 'cozy-flags'
import { Main as MainUI } from 'cozy-ui/transpiled/react/Layout'

import styles from './main.styl'

import { MigrationProgressBanner } from '@/components/Migration/MigrationProgressBanner'
import PushBanner from '@/components/PushBanner'
import { SHARINGS_VIEW_ROUTE } from '@/constants/config'
import SharingInvitations from '@/modules/views/Sharings/SharingInvitations'

const Main = ({ children, isPublic = false }) => {
  const { pathname } = useLocation()
  const isSharingsPage = pathname.startsWith(SHARINGS_VIEW_ROUTE)

  return (
    <MainUI>
      {!isPublic && (
        <div className={cx(styles.banners, 'u-mt-1 u-mt-0-m')}>
          {!isSharingsPage && <PushBanner />}
          {!isSharingsPage && flag('settings.migration.enabled') && (
            <MigrationProgressBanner />
          )}
          <SharingInvitations />
        </div>
      )}
      {children}
    </MainUI>
  )
}

Main.propTypes = {
  isPublic: PropTypes.bool,
  children: PropTypes.array
}
export default Main
