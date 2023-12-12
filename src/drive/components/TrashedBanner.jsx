import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Alert from 'cozy-ui/transpiled/react/Alert'
import Buttons from 'cozy-ui/transpiled/react/Buttons'
import TrashDuotoneIcon from 'cozy-ui/transpiled/react/Icons/TrashDuotone'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { useClient, useQuery } from 'cozy-client'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import DestroyConfirm from 'drive/web/modules/trash/components/DestroyConfirm'
import { buildFileByIdQuery } from 'drive/web/modules/queries'
import logger from 'lib/logger'

const TrashedBanner = ({ fileId, isPublic }) => {
  const { t } = useI18n()
  const client = useClient()
  const navigate = useNavigate()
  const { showAlert } = useAlert()
  const { isMobile } = useBreakpoints()

  const fileQuery = buildFileByIdQuery(fileId)
  const fileResult = useQuery(fileQuery.definition, fileQuery.options)

  const [isBusy, setBusy] = useState(false)
  const [isDestroyConfirmationDisplayed, setDestroyConfirmationDisplayed] =
    useState(false)

  const restore = async () => {
    try {
      await client.collection('io.cozy.files').restore(fileId)
      showAlert(t('TrashedBanner.restoreSuccess'), 'secondary')
    } catch (e) {
      logger.warn(`Error while restoring file ${fileId}`, e)
      showAlert(t('TrashedBanner.restoreError'), 'error')
    } finally {
      setBusy(false)
    }
  }

  const destroy = async () => {
    setDestroyConfirmationDisplayed(true)
  }

  const handleDestroyCancel = () => {
    setDestroyConfirmationDisplayed(false)
  }

  const handleDestroyConfirm = () => {
    showAlert(t('TrashedBanner.destroySuccess'), 'secondary')
    navigate(`/trash/${fileResult.data.dir_id}`)
  }

  return (
    <>
      <Alert
        square
        severity="secondary"
        icon={<Icon icon={TrashDuotoneIcon} size={32} />}
        block={isMobile}
        action={
          !isPublic ? (
            <>
              <Buttons
                size="small"
                variant="text"
                label={t('TrashedBanner.restore')}
                onClick={restore}
                busy={isBusy}
              />
              <Buttons
                size="small"
                variant="text"
                label={t('TrashedBanner.destroy')}
                onClick={destroy}
                disabled={isBusy}
              />
            </>
          ) : null
        }
      >
        {t('TrashedBanner.text')}
      </Alert>
      {isDestroyConfirmationDisplayed ? (
        <DestroyConfirm
          files={[fileResult.data]}
          onCancel={handleDestroyCancel}
          onConfirm={handleDestroyConfirm}
        />
      ) : null}
    </>
  )
}

export { TrashedBanner }
