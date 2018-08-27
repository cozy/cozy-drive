import React from 'react'
import Viewer from 'viewer'
import PublicToolbar from './PublicToolbar'

const LightFileViewer = ({ files }) => (
  <div>
    <PublicToolbar files={files} renderInBar />
    <Viewer
      files={files}
      currentIndex={0}
      fullscreen={false}
      dark={false}
      controls={false}
    />
  </div>
)

export default LightFileViewer
