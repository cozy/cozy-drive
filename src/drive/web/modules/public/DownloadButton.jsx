import React from 'react'
import { Button } from 'cozy-ui/react'

const DownloadButton = ({ onDownload, ...props }) => (
  <Button onClick={() => onDownload()} icon="download" {...props} />
)

export default DownloadButton
