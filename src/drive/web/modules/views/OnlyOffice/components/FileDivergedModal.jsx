import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Buttons from 'cozy-ui/transpiled/react/Buttons'
import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Alert from 'cozy-ui/transpiled/react/Alert'

import { useOnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice/OnlyOfficeProvider'
import { makeOnlyOfficeFileRoute } from 'drive/web/modules/views/OnlyOffice/helpers'

const FileDivergedModal = () => {
  const { officeKey, setFileDiverged, editorMode } = useOnlyOfficeContext()
  const navigate = useNavigate()
  const client = useClient()
  const { t } = useI18n()

  const [isErrorAlertDisplayed, setErrorAlertDisplayed] = useState(false)
  const [isBusy, setBusy] = useState(false)
  const [shouldConfirmReload, setShouldConfirmReload] = useState(false)

  const [searchParams] = useSearchParams()
  const params = new URLSearchParams(location.search)

  const redirectLink =
    searchParams.get('redirectLink') || params.get('redirectLink')

  const continueEditing = async () => {
    setErrorAlertDisplayed(false)
    setBusy(true)
    try {
      const resp = await client
        .getStackClient()
        .fetchJSON('POST', `/office/keys/${officeKey}`)
      const route = makeOnlyOfficeFileRoute(resp.data.id, {
        fromRedirect: redirectLink,
        fromEdit: editorMode === 'edit'
      })
      navigate(route)
      setFileDiverged(false)
    } catch {
      setErrorAlertDisplayed(true)
    } finally {
      setBusy(false)
    }
  }

  const goToNewVersion = () => {
    location.reload()
  }

  const toogleConfirmReloadModal = () => {
    setShouldConfirmReload(!shouldConfirmReload)
  }

  return (
    <>
      <ConfirmDialog
        open
        title={t('FileDivergedModal.title')}
        content={
          <>
            {isErrorAlertDisplayed ? (
              <Alert severity="error" className="u-mb-1">
                {t('FileDivergedModal.error')}
              </Alert>
            ) : null}
            <Typography>{t('FileDivergedModal.content')}</Typography>
          </>
        }
        actions={
          <>
            <Buttons
              variant="secondary"
              disabled={isBusy}
              label={t('FileDivergedModal.cancel')}
              onClick={toogleConfirmReloadModal}
            />
            <Buttons
              busy={isBusy}
              disabled={isBusy}
              label={t('FileDivergedModal.confirm')}
              onClick={continueEditing}
            />
          </>
        }
      />
      {shouldConfirmReload ? (
        <ConfirmDialog
          open
          title={t('FileDivergedModal.confirmReload.title')}
          onClose={toogleConfirmReloadModal}
          content={t('FileDivergedModal.confirmReload.content')}
          actions={
            <>
              <Buttons
                variant="secondary"
                label={t('FileDivergedModal.confirmReload.cancel')}
                onClick={toogleConfirmReloadModal}
              />
              <Buttons
                label={t('FileDivergedModal.confirmReload.confirm')}
                onClick={goToNewVersion}
              />
            </>
          }
        />
      ) : null}
    </>
  )
}

export { FileDivergedModal }
