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

export const shouldDisplayQuotaPaywall = backupError => {
  return backupError.statusCode === 413
}
