import React from 'react'
import Viewer from 'viewer'
import PropTypes from 'prop-types'

import PublicToolbar from './PublicToolbar'

const LightFileViewer = ({ files, isFile }) => (
  <div>
    <PublicToolbar files={files} renderInBar isFile={isFile} />
    <Viewer
      files={files}
      currentIndex={0}
      fullscreen={false}
      dark={false}
      controls={false}
    />
  </div>
)

LightFileViewer.propTypes = {
  files: PropTypes.array.isRequired,
  isFile: PropTypes.bool.isRequired
}
export default LightFileViewer
