import React, { useState, useCallback } from 'react'

import { ShareButton, ShareModal, SharedRecipients } from 'cozy-sharing'

const _Sharing = ({ fileWithPath }) => {
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
      <ShareButton docId={fileWithPath.id} onClick={toggleShareModal} />
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

const Sharing = React.memo(_Sharing)

export default Sharing
