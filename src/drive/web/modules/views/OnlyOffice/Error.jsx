import React, { useContext, useMemo, useCallback } from 'react'
import { RemoveScroll } from 'react-remove-scroll'

import { isQueryLoading, useQuery } from 'cozy-client'
import Overlay from 'cozy-ui/transpiled/react/Overlay'
import Viewer from 'cozy-ui/transpiled/react/Viewer'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import Oops from 'components/Error/Oops'
import { OnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice'
import { buildFileByIdQuery } from 'drive/web/modules/queries'

const Error = () => {
  const { t } = useI18n()
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

  if (fileResult.fetchStatus === 'failed') {
    return <Oops title={t('error.open_file')} />
  }

  return (
    <RemoveScroll>
      <Overlay>
        <Viewer files={files} currentIndex={0} onCloseRequest={handleOnClose} />
      </Overlay>
    </RemoveScroll>
  )
}

export default React.memo(Error)
