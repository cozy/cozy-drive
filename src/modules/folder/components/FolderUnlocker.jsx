import React, { useState, useEffect, useCallback } from 'react'

import { useVaultClient, VaultUnlocker } from 'cozy-keys-lib'

import { isEncryptedFolder } from 'lib/encryption'

const FolderUnlocker = ({ children, folder, onDismiss }) => {
  const vaultClient = useVaultClient()

  const isFolderEncrypted = isEncryptedFolder(folder)
  const [shouldUnlock, setShouldUnlock] = useState(true)

  const handleDismiss = useCallback(() => {
    setShouldUnlock(false)
    onDismiss()
  }, [onDismiss])

  const handleUnlock = useCallback(() => {
    setShouldUnlock(false)
  }, [])

  useEffect(() => {
    const checkLock = async () => {
      const isLocked = await vaultClient.isLocked()
      setShouldUnlock(isLocked)
    }
    if (isFolderEncrypted) {
      checkLock()
    }
  }, [vaultClient, isFolderEncrypted, shouldUnlock])

  if (isFolderEncrypted && shouldUnlock) {
    return <VaultUnlocker onDismiss={handleDismiss} onUnlock={handleUnlock} />
  }

  return children
}

export { FolderUnlocker }
