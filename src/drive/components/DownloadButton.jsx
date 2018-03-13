import React from 'react'
import { Button } from 'cozy-ui/react'

const DownloadButton = ({ label, disabled = false, onDownload, className }) => (
  <Button
    disabled={disabled}
    className={className}
    onClick={() => onDownload()}
    icon="download"
    label={label}
  />
)

export default DownloadButton
