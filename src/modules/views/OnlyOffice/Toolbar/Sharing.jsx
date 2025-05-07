import React, { useState, useCallback } from 'react'

import { ShareButton, ShareModal, SharedRecipients } from 'cozy-sharing'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import ShareIcon from 'cozy-ui/transpiled/react/Icons/Share'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

const Sharing = ({ file }) => {
  const [showShareModal, setShowShareModal] = useState(false)
  const { isMobile } = useBreakpoints()

  const toggleShareModal = useCallback(
    () => setShowShareModal(v => !v),
    [setShowShareModal]
  )

  return (
    <>
      {isMobile ? (
        <IconButton
          data-testid="onlyoffice-sharing-icon"
          onClick={toggleShareModal}
          size="medium"
        >
          <Icon icon={ShareIcon} />
        </IconButton>
      ) : (
        <>
          <SharedRecipients
            docId={file.id}
            size={32}
            onClick={toggleShareModal}
          />
          <ShareButton
            data-testid="onlyoffice-sharing-button"
            docId={file.id}
            onClick={toggleShareModal}
          />
        </>
      )}
      {showShareModal && (
        <ShareModal
          document={file}
          documentType="Files"
          sharingDesc={file.name}
          onClose={toggleShareModal}
        />
      )}
    </>
  )
}

export default React.memo(Sharing)
