import React from 'react'
import { Button, Icon } from 'cozy-ui/react'

const DownloadButton = ({ label, disabled = false, onDownload, className }) => (
  <Button
    disabled={disabled}
    className={className}
    onClick={() => onDownload()}
    icon={<Icon icon="download" />}
    label={label}
  />
)

export default DownloadButton
