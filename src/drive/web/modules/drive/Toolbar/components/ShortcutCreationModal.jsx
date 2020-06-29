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

const ENTER_KEY = 13

const isURLValid = url => {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

const makeURLValid = str => {
  if (isURLValid(str)) return str
  else if (isURLValid(`https://${str}`)) return `https://${str}`
  return false
}
const ShortcutCreationModal = ({ onClose, onCreated, displayedFolder }) => {
  const { t } = useI18n()
  const [filename, setFilename] = useState('')
  const [url, setUrl] = useState('')
  const client = useClient()

  const createShortcut = useCallback(
    async () => {
      if (!filename || !url) {
        Alerter.error(t('Shortcut.needs_info'))
        return
      }
      const makedURL = makeURLValid(url)
      if (!makedURL) {
        Alerter.error(t('Shortcut.url_badformat'))
        return
      }
      const data = {
        name: filename.endsWith('.url') ? filename : filename + '.url',
        dir_id: displayedFolder.id,
        url: makedURL
      }
      try {
        await client.collection('io.cozy.files.shortcuts').create(data)
        Alerter.success(t('Shortcut.created'))
        if (onCreated) onCreated()
        onClose()
      } catch (e) {
        Alerter.error(t('Shortcut.errored'))
      }
    },
    [client, filename, onClose, onCreated, t, url, displayedFolder]
  )

  const handleKeyDown = e => {
    if (e.keyCode === ENTER_KEY) {
      createShortcut()
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
              onKeyDown={e => handleKeyDown(e)}
              fullWidth
              margin="normal"
              autoFocus
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
              onKeyDown={e => handleKeyDown(e)}
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
          onClick={createShortcut}
        />
      </ExperimentalDialogActions>
    </ExperimentalDialog>
  )
}

export default ShortcutCreationModal
