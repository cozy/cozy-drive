import React from 'react'
import { Button, Icon } from 'cozy-ui/react'

const DownloadButton = ({ label, disabled = false, onDownload, className }) => (
  <Button
    disabled={disabled}
    className={className}
    onClick={() => onDownload()}
  >
    <Icon icon="download" />
    {label}
  </Button>
)

export default DownloadButton
