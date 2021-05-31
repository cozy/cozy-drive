import React, { useState, useCallback } from 'react'

import { ShareButton, ShareModal, SharedRecipients } from 'cozy-sharing'

const Sharing = ({ fileWithPath }) => {
  const [showShareModal, setShowShareModal] = useState(false)

  const toggleShareModal = useCallback(() => setShowShareModal(v => !v), [
    setShowShareModal
  ])

  return (
    <>
      <SharedRecipients
        docId={fileWithPath.id}
        size={32}
        onClick={toggleShareModal}
      />
      <ShareButton
        data-testid="onlyoffice-sharing-button"
        docId={fileWithPath.id}
        onClick={toggleShareModal}
      />
      {showShareModal && (
        <ShareModal
          document={fileWithPath}
          documentType="Files"
          sharingDesc={fileWithPath.name}
          onClose={toggleShareModal}
        />
      )}
    </>
  )
}

export default React.memo(Sharing)
