import React from 'react'

import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import FilesRealTimeQueries from 'components/FilesRealTimeQueries'
import { HOME_LINK_HREF } from 'constants/config'
import { useRedirectLink } from 'hooks/useRedirectLink'
import { openExternalLink } from 'modules/actions'
import { OpenExternalLinkButton } from 'modules/public/OpenExternalLinkButton'
import PublicToolbarMoreMenu from 'modules/public/PublicToolbarMoreMenu'
import { useOnlyOfficeContext } from 'modules/views/OnlyOffice/OnlyOfficeProvider'
import BackButton from 'modules/views/OnlyOffice/Toolbar/BackButton'
import FileIcon from 'modules/views/OnlyOffice/Toolbar/FileIcon'
import FileName from 'modules/views/OnlyOffice/Toolbar/FileName'
import HomeIcon from 'modules/views/OnlyOffice/Toolbar/HomeIcon'
import HomeLinker from 'modules/views/OnlyOffice/Toolbar/HomeLinker'
import Separator from 'modules/views/OnlyOffice/Toolbar/Separator'
import Sharing from 'modules/views/OnlyOffice/Toolbar/Sharing'
import { useFileWithPath } from 'modules/views/hooks'

const Toolbar = ({ sharingInfos }) => {
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()
  const { fileId, isPublic, isEditorReady } = useOnlyOfficeContext()
  const { discoveryLink, isSharingShortcutCreated, loading } = sharingInfos

  const { data: fileWithPath } = useFileWithPath(fileId)
  const { redirectBack, canRedirect } = useRedirectLink({ isPublic })

  const showBackButton = canRedirect

  const handleOnClick = () => {
    redirectBack()
  }
  // Check if the share shortcut has not yet been added
  const isShareNotAdded = !loading && !isSharingShortcutCreated

  // discoveryLink exists only in cozy to cozy sharing
  const link = discoveryLink || HOME_LINK_HREF
  const actions = makeActions([openExternalLink], {
    t,
    link,
    isSharingShortcutCreated
  })

  return (
    <>
      <FilesRealTimeQueries />
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
      {isPublic && !isMobile && isShareNotAdded && (
        <OpenExternalLinkButton
          link={link}
          isSharingShortcutCreated={isSharingShortcutCreated}
        />
      )}

      {isPublic && (
        <PublicToolbarMoreMenu files={[fileWithPath]} actions={actions} />
      )}

      {!isPublic && isEditorReady && <Sharing fileWithPath={fileWithPath} />}
    </>
  )
}

export default React.memo(Toolbar)
