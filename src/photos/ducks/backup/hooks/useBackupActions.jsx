import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext
} from 'react'

import { useWebviewIntent } from 'cozy-intent'

import { parseBackupError } from 'photos/ducks/backup/helpers/error'
import { useBackupData } from 'photos/ducks/backup/hooks/useBackupData'

const BackupActionsContext = createContext(null)

export const BackupActionsProvider = ({ children }) => {
  const { setBackupInfo } = useBackupData()

  const [backupPermissions, setBackupPermissions] = useState(null)
  const [backupError, setBackupError] = useState(null)
  const [isAllowPermissionsModalOpen, setIsAllowPermissionsModalOpen] =
    useState(false)
  const webviewIntent = useWebviewIntent()

  const prepareBackup = useCallback(async () => {
    try {
      const newBackupInfo = await webviewIntent.call('prepareBackup')

      setBackupInfo(newBackupInfo)
    } catch (e) {
      setBackupError(parseBackupError(e))
    }
  }, [webviewIntent, setBackupInfo])

  const startBackup = useCallback(async () => {
    try {
      const newBackupInfo = await webviewIntent.call('startBackup')

      setBackupInfo(newBackupInfo)
    } catch (e) {
      setBackupError(parseBackupError(e))
    }
  }, [webviewIntent, setBackupInfo])

  const stopBackup = useCallback(async () => {
    try {
      const newBackupInfo = await webviewIntent.call('stopBackup')

      setBackupInfo(newBackupInfo)
    } catch (e) {
      setBackupError(parseBackupError(e))
    }
  }, [webviewIntent, setBackupInfo])

  const checkBackupPermissions = useCallback(async () => {
    try {
      const newBackupPermissions = await webviewIntent.call(
        'checkBackupPermissions'
      )

      setBackupPermissions(newBackupPermissions)

      return newBackupPermissions
    } catch (e) {
      setBackupError(parseBackupError(e))
    }
  }, [webviewIntent])

  const requestBackupPermissions = useCallback(async () => {
    try {
      const newBackupPermissions = await webviewIntent.call(
        'requestBackupPermissions'
      )
      setBackupPermissions(newBackupPermissions)

      const shouldStartBackup =
        newBackupPermissions.granted && !backupPermissions.granted

      const shouldOpenPermissionsModal = !newBackupPermissions.canRequest

      if (shouldStartBackup) {
        await prepareBackup()
        await startBackup()
      } else if (shouldOpenPermissionsModal) {
        setIsAllowPermissionsModalOpen(true)
      }

      return newBackupPermissions
    } catch (e) {
      setBackupError(parseBackupError(e))
    }
  }, [
    webviewIntent,
    backupPermissions,
    prepareBackup,
    startBackup,
    setIsAllowPermissionsModalOpen
  ])

  const openAppOSSettings = useCallback(async () => {
    await webviewIntent.call('openAppOSSettings')
  }, [webviewIntent])

  // on page load
  useEffect(() => {
    const check = async () => {
      const backupPermissions = await checkBackupPermissions()

      if (backupPermissions?.granted) {
        await prepareBackup()
      }
    }

    if (webviewIntent) {
      check()
    }
  }, [webviewIntent, checkBackupPermissions, prepareBackup])

  return (
    <BackupActionsContext.Provider
      value={{
        backupPermissions,
        prepareBackup,
        startBackup,
        stopBackup,
        requestBackupPermissions,
        backupError,
        setBackupError,
        isAllowPermissionsModalOpen,
        setIsAllowPermissionsModalOpen,
        openAppOSSettings
      }}
    >
      {children}
    </BackupActionsContext.Provider>
  )
}

export const useBackupActions = () => {
  return useContext(BackupActionsContext)
}
