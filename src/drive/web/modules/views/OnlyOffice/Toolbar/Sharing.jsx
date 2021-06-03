import React, { useState, useCallback } from 'react'

import { ShareButton, ShareModal, SharedRecipients } from 'cozy-sharing'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ShareIcon from 'cozy-ui/transpiled/react/Icons/Share'

const Sharing = ({ fileWithPath }) => {
  const [showShareModal, setShowShareModal] = useState(false)
  const { isMobile } = useBreakpoints()

  const toggleShareModal = useCallback(() => setShowShareModal(v => !v), [
    setShowShareModal
  ])

  return (
    <>
      {isMobile ? (
        <IconButton
          data-testid="onlyoffice-sharing-icon"
          onClick={toggleShareModal}
        >
          <Icon icon={ShareIcon} />
        </IconButton>
      ) : (
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
        </>
      )}
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
