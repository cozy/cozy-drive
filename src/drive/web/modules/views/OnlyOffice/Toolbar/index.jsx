import React, { useContext, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { RealTimeQueries } from 'cozy-client'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { DOCTYPE_FILES } from 'drive/lib/doctypes'
import { OnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice'
import { useFileWithPath } from 'drive/web/modules/views/hooks'
import HomeIcon from 'drive/web/modules/views/OnlyOffice/Toolbar/HomeIcon'
import HomeLinker from 'drive/web/modules/views/OnlyOffice/Toolbar/HomeLinker'
import Separator from 'drive/web/modules/views/OnlyOffice/Toolbar/Separator'
import BackButton from 'drive/web/modules/views/OnlyOffice/Toolbar/BackButton'
import FileIcon from 'drive/web/modules/views/OnlyOffice/Toolbar/FileIcon'
import FileName from 'drive/web/modules/views/OnlyOffice/Toolbar/FileName'
import ReadOnly from 'drive/web/modules/views/OnlyOffice/Toolbar/ReadOnly'
import Sharing from 'drive/web/modules/views/OnlyOffice/Toolbar/Sharing'

const Toolbar = () => {
  const { isMobile } = useBreakpoints()
  const {
    fileId,
    isPublic,
    isFromSharing,
    isReadOnly,
    isEditorReady,
    isFromCreate
  } = useContext(OnlyOfficeContext)

  const { data: fileWithPath } = useFileWithPath(fileId)
  const navigate = useNavigate()

  const hasOnyMoreHistoryEntry = useMemo(
    () => isFromSharing || isFromCreate,
    [isFromSharing, isFromCreate]
  )
  // The condition is different in the case of a only office file that has been shared with us.
  // In this case there is a double redirection (one to know that the file is a share, the other
  // to open it on the host instance), so there is an additional entry in the history.
  const showBackButton = useMemo(
    () =>
      hasOnyMoreHistoryEntry
        ? window.history.length > 2
        : window.history.length > 1,
    [hasOnyMoreHistoryEntry]
  )

  const handleOnClick = useCallback(
    () => (hasOnyMoreHistoryEntry ? navigate('../../') : navigate('../')),
    [hasOnyMoreHistoryEntry, navigate]
  )

  return (
    <>
      <RealTimeQueries doctype={DOCTYPE_FILES} />
      <div className="u-flex u-flex-items-center u-flex-grow-1 u-ellipsis">
        {!isMobile && (
          <>
            {isPublic ? (
              <HomeIcon />
            ) : (
              <HomeLinker>
                <HomeIcon />
              </HomeLinker>
            )}
            <Separator />
          </>
        )}
        {showBackButton && <BackButton onClick={handleOnClick} />}
        {!isMobile && fileWithPath.class && (
          <FileIcon fileClass={fileWithPath.class} />
        )}
        <FileName fileWithPath={fileWithPath} isPublic={isPublic} />
      </div>
      {isReadOnly && <ReadOnly />}
      {!isPublic && isEditorReady && <Sharing fileWithPath={fileWithPath} />}
    </>
  )
}

export default React.memo(Toolbar)
