import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Buttons from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Alert from 'cozy-ui/transpiled/react/Alert'

import { DOCTYPE_FILES } from 'drive/lib/doctypes'
import { useOnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice/OnlyOfficeProvider'
import { makeOnlyOfficeFileRoute } from 'drive/web/modules/views/OnlyOffice/helpers'
import { useRedirectLink } from 'drive/hooks/useRedirectLink'

const FileDeletedModal = () => {
  const { fileId, setFileDeleted, editorMode } = useOnlyOfficeContext()
  const navigate = useNavigate()
  const client = useClient()
  const { t } = useI18n()

  const [isErrorAlertDisplayed, setErrorAlertDisplayed] = useState(false)
  const [isBusy, setBusy] = useState(false)

  const { redirectLink, redirectWebLink } = useRedirectLink()

  const restore = async () => {
    setErrorAlertDisplayed(false)
    setBusy(isBusy)
    try {
      const resp = await client.collection(DOCTYPE_FILES).restore(fileId)
      const route = makeOnlyOfficeFileRoute(resp.data.id, {
        fromRedirect: redirectLink,
        fromEdit: editorMode === 'edit'
      })
      navigate(route)
      setFileDeleted(false)
    } catch {
      setErrorAlertDisplayed(true)
    } finally {
      setBusy(false)
    }
  }

  const goBack = () => {
    window.location = redirectWebLink
  }

  return (
    <ConfirmDialog
      open
      title={t('FileDeletedModal.title')}
      content={
        <>
          {isErrorAlertDisplayed ? (
            <Alert severity="error" className="u-mb-1">
              {t('FileDeletedModal.error')}
            </Alert>
          ) : null}
          <Typography>{t('FileDeletedModal.content')}</Typography>
        </>
      }
      actions={
        <>
          <Buttons
            disabled={isBusy}
            variant="secondary"
            color="error"
            label={t('FileDeletedModal.cancel')}
            onClick={goBack}
          />
          <Buttons
            busy={isBusy}
            disabled={isBusy}
            label={t('FileDeletedModal.confirm')}
            onClick={restore}
          />
        </>
      }
    />
  )
}

export { FileDeletedModal }
