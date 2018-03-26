import React from 'react'
import { Button } from 'cozy-ui/react'

const DownloadButton = ({
  label,
  disabled = false,
  onDownload,
  className,
  theme
}) => (
  <Button
    disabled={disabled}
    className={className}
    onClick={() => onDownload()}
    icon="download"
    label={label}
    theme={theme}
  />
)

export default DownloadButton
