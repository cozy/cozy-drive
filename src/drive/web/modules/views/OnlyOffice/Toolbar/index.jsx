import React, { useContext, useCallback, useMemo } from 'react'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { useRouter } from 'drive/lib/RouterContext'
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
  const { fileId, isPublic, isEditorReadOnly, isEditorReady } = useContext(
    OnlyOfficeContext
  )
  const { data: fileWithPath } = useFileWithPath(fileId)
  const { router } = useRouter()

  const isFromSharing = useMemo(
    () => router.location.pathname.endsWith('/fromSharing'),
    [router]
  )
  const isFromCreate = useMemo(
    () => router.location.pathname.endsWith('/fromCreate'),
    [router]
  )
  const hasOnyMoreHistoryEntry = useMemo(() => isFromSharing || isFromCreate, [
    isFromSharing,
    isFromCreate
  ])

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
    () => (hasOnyMoreHistoryEntry ? router.go(-2) : router.goBack()),
    [hasOnyMoreHistoryEntry, router]
  )

  return (
    <>
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
        {!isMobile &&
          fileWithPath.class && <FileIcon fileClass={fileWithPath.class} />}
        <FileName fileWithPath={fileWithPath} />
      </div>
      {!isMobile && isEditorReadOnly && <ReadOnly />}
      {isEditorReady && <Sharing fileWithPath={fileWithPath} />}
    </>
  )
}

export default React.memo(Toolbar)
