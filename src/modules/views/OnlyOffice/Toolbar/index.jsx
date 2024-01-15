import React from 'react'

import { RealTimeQueries } from 'cozy-client'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { useRedirectLink } from 'hooks/useRedirectLink'
import { DOCTYPE_FILES } from 'lib/doctypes'
import { useOnlyOfficeContext } from 'modules/views/OnlyOffice/OnlyOfficeProvider'
import BackButton from 'modules/views/OnlyOffice/Toolbar/BackButton'
import FileIcon from 'modules/views/OnlyOffice/Toolbar/FileIcon'
import FileName from 'modules/views/OnlyOffice/Toolbar/FileName'
import HomeIcon from 'modules/views/OnlyOffice/Toolbar/HomeIcon'
import HomeLinker from 'modules/views/OnlyOffice/Toolbar/HomeLinker'
import ReadOnly from 'modules/views/OnlyOffice/Toolbar/ReadOnly'
import Separator from 'modules/views/OnlyOffice/Toolbar/Separator'
import Sharing from 'modules/views/OnlyOffice/Toolbar/Sharing'
import { useFileWithPath } from 'modules/views/hooks'

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
