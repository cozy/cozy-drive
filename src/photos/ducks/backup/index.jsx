import React from 'react'
import Topbar from '../../components/Topbar'
import cx from 'classnames'
import { useBreakpoints } from 'cozy-ui/transpiled/react'

import styles from '../../styles/layout.styl'
import backupStyles from '../../styles/backup.styl'
import { Content } from 'cozy-ui/transpiled/react/Layout'
import BackupHeader from './components/BackupHeader'
import BackupInfo from './components/BackupInfo'
import BackupActions from './components/BackupActions'
import BackupDescription from './components/BackupDescription'
import InstallAppAlert from './components/InstallAppAlert'
import AllowPermissionsModal from './components/AllowPermissionsModal'
import { BackupError } from './components/BackupError'

import { BackupActionsProvider } from 'photos/ducks/backup/hooks/useBackupActions'
import { isFlagshipApp } from 'cozy-device-helper'

const BackupPage = () => {
  const { isMobile } = useBreakpoints()

  return (
    <div
      data-testid="backup-pho-content-wrapper"
      className={styles['pho-content-wrapper']}
    >
      <Topbar viewName="backup"></Topbar>
      <Content>
        <BackupActionsProvider>
          <div className={cx('u-m-1', backupStyles['pho-backup-wrapper'])}>
            {isMobile ? <BackupHeader /> : null}
            <BackupInfo />
            {!isFlagshipApp() ? <InstallAppAlert /> : null}
            <BackupActions />
            {isMobile ? <BackupDescription /> : null}
          </div>
          <AllowPermissionsModal />
          <BackupError />
        </BackupActionsProvider>
      </Content>
    </div>
  )
}

export default BackupPage
