import React from 'react'
import { useNavigate } from 'react-router-dom'

import Dialog, { DialogContent } from 'cozy-ui/transpiled/react/Dialog'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import Oops from 'components/Error/Oops'

import useCreateFile from 'drive/web/modules/views/OnlyOffice/useCreateFile'

const Create = ({ params: { folderId, fileClass } }) => {
  const navigate = useNavigate()
  const { status, fileId } = useCreateFile(folderId, fileClass)

  if (status === 'error') {
    return <Oops />
  }

  if (status === 'loaded' && fileId) {
    return navigate(`/onlyoffice/${fileId}/fromCreate`)
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
