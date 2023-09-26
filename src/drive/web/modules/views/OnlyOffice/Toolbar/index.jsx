import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  RealTimeQueries,
  useClient,
  generateWebLink,
  deconstructRedirectLink
} from 'cozy-client'
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

const Toolbar = () => {
  const { isMobile } = useBreakpoints()
  const { fileId, isPublic, isReadOnly, isEditorReady } = useOnlyOfficeContext()
  const client = useClient()
  const [fetchStatus, setFetchStatus] = useState('pending')
  const [instance, setInstance] = useState(client.getStackClient().uri)

  useEffect(() => {
    const fetch = async () => {
      try {
        setFetchStatus('loading')
        const permissions = await client
          .collection('io.cozy.permissions')
          .fetchOwnPermissions()
        if (permissions.included.length > 0) {
          setInstance(permissions.included[0].attributes.instance)
        }
        setFetchStatus('loaded')
      } catch {
        setFetchStatus('error')
      }
    }
    fetch()
  }, [client])

  const [searchParams] = useSearchParams()
  const params = new URLSearchParams(location.search)

  /**
   * We search for redirectLink using two methods because
   * the searchParam differs depending on the position in the url :
   * - for /#hash?searchParam, you need useSearchParams
   * - for /?searchParam#hash, you need location.search
   */
  const redirectLink =
    searchParams.get('redirectLink') || params.get('redirectLink')

  const { data: fileWithPath } = useFileWithPath(fileId)

  let link
  if (redirectLink) {
    const { slug, pathname, hash } = deconstructRedirectLink(redirectLink)
    const { subdomain: subDomainType } = client.getInstanceOptions()

    link = generateWebLink({
      cozyUrl: instance,
      subDomainType,
      slug,
      pathname,
      hash,
      searchParams: []
    })
  }

  const showBackButton = redirectLink !== null && fetchStatus === 'loaded'

  const handleOnClick = () => {
    window.location = link
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
