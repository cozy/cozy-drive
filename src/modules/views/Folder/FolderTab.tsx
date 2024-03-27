import React from 'react'

interface FolderTabProps {
  children: React.ReactNode
  index: number
  value: number
}

export const FolderTab = ({
  children,
  index,
  value,
  ...props
}: FolderTabProps): JSX.Element => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`cozy-tabpanel-${index}`}
      aria-labelledby={`cozy-tab-${index}`}
      {...props}
    >
      {value === index && <>{children}</>}
    </div>
  )
}
