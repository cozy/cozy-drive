import React, { useContext } from 'react'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import { OnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice'
import { useFileWithPath } from 'drive/web/modules/views/hooks'
import HomeIcon from 'drive/web/modules/views/OnlyOffice/Toolbar/HomeIcon'
import HomeLinker from 'drive/web/modules/views/OnlyOffice/Toolbar/HomeLinker'
import Separator from 'drive/web/modules/views/OnlyOffice/Toolbar/Separator'
import BackButton from 'drive/web/modules/views/OnlyOffice/Toolbar/BackButton'
import FileIcon from 'drive/web/modules/views/OnlyOffice/Toolbar/FileIcon'
import FileName from 'drive/web/modules/views/OnlyOffice/Toolbar/FileName'
import ReadOnly from 'drive/web/modules/views/OnlyOffice/Toolbar/ReadOnly'

const Toolbar = () => {
  const { isMobile } = useBreakpoints()
  const { fileId, isPublic, isReadOnly } = useContext(OnlyOfficeContext)
  const { data } = useFileWithPath(fileId)

  const showBackButton = window.history.length > 1

  if (!data) {
    return <Spinner className="u-flex u-flex-justify-center u-flex-grow-1" />
  }

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
        {showBackButton && <BackButton />}
        {!isMobile && <FileIcon fileWithPath={data} />}
        <FileName fileWithPath={data} />
      </div>
      {!isMobile && isReadOnly && <ReadOnly />}
    </>
  )
}

export default Toolbar
