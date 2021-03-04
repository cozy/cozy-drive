import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { ShareModal, ShareButton } from 'cozy-sharing'

const Sharing = ({ file }) => {
  const [showShareModal, setShowShareModal] = useState(false)

  return (
    <>
      {showShareModal && (
        <ShareModal
          document={file}
          documentType="Files"
          sharingDesc={file.name}
          onClose={() => setShowShareModal(false)}
        />
      )}
      <ShareButton
        className="u-mr-half"
        extension="full"
        useShortLabel
        docId={file.id}
        onClick={() => setShowShareModal(true)}
      />
    </>
  )
}

Sharing.propTypes = {
  file: PropTypes.object.isRequired
}

export default Sharing
