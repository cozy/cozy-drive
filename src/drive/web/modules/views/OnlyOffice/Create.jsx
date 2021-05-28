import React from 'react'

import Dialog, { DialogContent } from 'cozy-ui/transpiled/react/Dialog'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import Oops from 'components/Error/Oops'
import { useRouter } from 'drive/lib/RouterContext'

import useCreateFile from 'drive/web/modules/views/OnlyOffice/useCreateFile'

const Create = ({ params: { folderId, fileClass } }) => {
  const { status, fileId } = useCreateFile(folderId, fileClass)
  const { router } = useRouter()

  if (status === 'error') {
    return <Oops />
  }

  if (status === 'loaded' && fileId) {
    return router.push(`/onlyOffice/${fileId}/fromCreate`)
  }

  return (
    <Dialog open={true} fullScreen transitionDuration={0}>
      <DialogContent className="u-flex u-flex-column u-flex-items-center u-flex-justify-center">
        <>
          <Spinner
            size="xxlarge"
            middle={true}
            loadingType="onlyOfficeCreateInProgress"
          />
        </>
      </DialogContent>
    </Dialog>
  )
}

export default React.memo(Create)
