export const parseBackupError = ({ message }) => {
  try {
    const parsed = JSON.parse(message)
    return {
      message: parsed.message,
      statusCode: parsed.statusCode
    }
  } catch {
    return {
      message
    }
  }
}

export const shouldDisplayQuotaPaywall = backupInfo => {
  return (
    backupInfo?.currentBackup?.status === 'done' &&
    backupInfo?.lastBackup?.code === 413 &&
    !backupInfo.lastBackup?.alreadyDisplayed
  )
}
