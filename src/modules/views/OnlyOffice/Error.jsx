import React, { useMemo, useCallback } from 'react'
import { RemoveScroll } from 'react-remove-scroll'

import { isQueryLoading, useQuery } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Viewer from 'cozy-ui/transpiled/react/Viewer'
import FooterActionButtons from 'cozy-ui/transpiled/react/Viewer/Footer/FooterActionButtons'
import ForwardOrDownloadButton from 'cozy-ui/transpiled/react/Viewer/Footer/ForwardOrDownloadButton'
import SharingButton from 'cozy-ui/transpiled/react/Viewer/Footer/Sharing'
import ToolbarButtons from 'cozy-ui/transpiled/react/Viewer/components/ToolbarButtons'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import Oops from 'components/Error/Oops'
import { useOnlyOfficeContext } from 'modules/views/OnlyOffice/OnlyOfficeProvider'
import { buildFileByIdQuery } from 'queries'

const Error = () => {
  const { t } = useI18n()
  const { fileId } = useOnlyOfficeContext()
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

  if (fileResult.fetchStatus === 'failed') {
    return <Oops title={t('error.open_file')} />
  }

  return (
    <RemoveScroll>
      <Viewer files={files} currentIndex={0} onCloseRequest={handleOnClose}>
        <ToolbarButtons>
          <SharingButton variant="iconButton" />
        </ToolbarButtons>
        <FooterActionButtons>
          <SharingButton />
          <ForwardOrDownloadButton variant="buttonIcon" />
        </FooterActionButtons>
      </Viewer>
    </RemoveScroll>
  )
}

export default React.memo(Error)
