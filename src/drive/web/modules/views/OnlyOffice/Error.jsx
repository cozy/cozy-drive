import React, { useContext, useMemo, useCallback } from 'react'
import { RemoveScroll } from 'react-remove-scroll'

import { isQueryLoading, useQuery } from 'cozy-client'
import Overlay from 'cozy-ui/transpiled/react/Overlay'
import Viewer from 'cozy-ui/transpiled/react/Viewer'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import { showPanel } from 'drive/web/modules/viewer/helpers'
import PanelContent from 'drive/web/modules/viewer/Panel/PanelContent'
import FooterContent from 'drive/web/modules/viewer/Footer/FooterContent'
import { OnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice'
import { buildFileByIdQuery } from 'drive/web/modules/queries'

const Error = () => {
  const { fileId } = useContext(OnlyOfficeContext)
  const handleOnClose = useCallback(() => window.history.back(), [])

  const fileQuery = useMemo(() => buildFileByIdQuery(fileId), [fileId])
  const fileResult = useQuery(fileQuery.definition, fileQuery.options)
  const files = useMemo(() => [fileResult.data], [fileResult])

  if (isQueryLoading(fileResult)) {
    return (
      <Spinner
        className="u-flex u-flex-items-center u-flex-justify-center u-flex-grow-1"
        size="xxlarge"
      />
    )
  }

  return (
    <RemoveScroll>
      <Overlay>
        <Viewer
          files={files}
          currentIndex={0}
          onCloseRequest={handleOnClose}
          panelInfoProps={{
            showPanel,
            PanelContent
          }}
          footerProps={{
            FooterContent
          }}
        />
      </Overlay>
    </RemoveScroll>
  )
}

export default React.memo(Error)
