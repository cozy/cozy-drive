import React from 'react'

import { RealTimeQueries } from 'cozy-client'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { DOCTYPE_FILES } from 'drive/lib/doctypes'
import { useOnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice/OnlyOfficeProvider'
import { useFileWithPath } from 'drive/web/modules/views/hooks'
import HomeIcon from 'drive/web/modules/views/OnlyOffice/Toolbar/HomeIcon'
import HomeLinker from 'drive/web/modules/views/OnlyOffice/Toolbar/HomeLinker'
import Separator from 'drive/web/modules/views/OnlyOffice/Toolbar/Separator'
import BackButton from 'drive/web/modules/views/OnlyOffice/Toolbar/BackButton'
import FileIcon from 'drive/web/modules/views/OnlyOffice/Toolbar/FileIcon'
import FileName from 'drive/web/modules/views/OnlyOffice/Toolbar/FileName'
import ReadOnly from 'drive/web/modules/views/OnlyOffice/Toolbar/ReadOnly'
import Sharing from 'drive/web/modules/views/OnlyOffice/Toolbar/Sharing'
import { useRedirectLink } from 'hooks/useRedirectLink'

const Toolbar = () => {
  const { isMobile } = useBreakpoints()
  const { fileId, isPublic, isReadOnly, isEditorReady } = useOnlyOfficeContext()

  const { data: fileWithPath } = useFileWithPath(fileId)
  const { redirectBack, canRedirect } = useRedirectLink({ isPublic })

  const showBackButton = canRedirect

  const handleOnClick = () => {
    redirectBack()
  }

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
