import React, { useState, createContext, useContext } from 'react'

const BackupDataContext = createContext(null)

export const BackupDataProvider = ({ children }) => {
  const [backupInfo, setBackupInfo] = useState(null)

  return (
    <BackupDataContext.Provider
      value={{
        backupInfo,
        setBackupInfo
      }}
    >
      {children}
    </BackupDataContext.Provider>
  )
}

export const useBackupData = () => {
  return useContext(BackupDataContext)
}
