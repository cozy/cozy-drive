import React, { useState, useCallback } from 'react'

import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import ExperimentalDialog, {
  ExperimentalDialogTitle,
  ExperimentalDialogActions
} from 'cozy-ui/transpiled/react/Labs/ExperimentalDialog'
import DialogContent from '@material-ui/core/DialogContent'
import Divider from '@material-ui/core/Divider'
import DialogCloseButton from 'cozy-ui/transpiled/react/MuiCozyTheme/Dialog/DialogCloseButton'
import Button from 'cozy-ui/transpiled/react/Button'
import TextField from 'cozy-ui/transpiled/react/MuiCozyTheme/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Stack from 'cozy-ui/transpiled/react/Stack'
import Alerter from 'cozy-ui/transpiled/react/Alerter'

const ShortcutCreationModal = ({ onClose, displayedFolder }) => {
  const { t } = useI18n()
  const [filename, setFilename] = useState('')
  const [url, setUrl] = useState('')
  const client = useClient()

  const createShortcut = async () => {
    if (!filename || !url) {
      Alerter.error(t('Shortcut.needs_info'))
      return
    }
    const data = {
      name: filename.endsWith('.url') ? filename : filename + '.url',
      dir_id: displayedFolder.id,
      url
    }
    try {
      await client.collection('io.cozy.files.shortcuts').create(data)
      Alerter.success('Shortcut.created')
      onClose()
    } catch (e) {
      Alerter.error('Shortcut.errored')
    }
  }
  return (
    <ExperimentalDialog onClose={onClose}>
      <DialogCloseButton onClick={onClose} />
      <ExperimentalDialogTitle>
        {t('Shortcut.title_modal')}
      </ExperimentalDialogTitle>
      <Divider />
      <DialogContent>
        <Stack>
          <div>
            <TextField
              label={t('Shortcut.url')}
              id="shortcuturl"
              variant="outlined"
              onChange={e => setUrl(e.target.value)}
              fullWidth
              margin="normal"
            />
          </div>
          <div>
            <TextField
              label={t('Shortcut.filename')}
              id="shortcutfilename"
              variant="outlined"
              onChange={e => setFilename(e.target.value)}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">.url</InputAdornment>
                )
              }}
            />
          </div>
        </Stack>
      </DialogContent>

      <ExperimentalDialogActions>
        <Button
          theme="secondary"
          onClick={onClose}
          label={t('Shortcut.cancel')}
        />
        <Button
          theme="primary"
          label={t('Shortcut.create')}
          onClick={useCallback(createShortcut)}
        />
      </ExperimentalDialogActions>
    </ExperimentalDialog>
  )
}

export default ShortcutCreationModal
