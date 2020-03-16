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
import InputGroup from 'cozy-ui/transpiled/react/InputGroup'
import { Bold } from 'cozy-ui/transpiled/react/Text'
import Input from 'cozy-ui/transpiled/react/Input'
import Stack from 'cozy-ui/transpiled/react/Stack'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import Label from 'cozy-ui/transpiled/react/Label'

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
          <Label htmlFor="shortcuturl">{t('Shortcut.url')}</Label>
          <Input
            id="shortcuturl"
            fullwidth
            onChange={e => setUrl(e.target.value)}
          />
          <Label htmlFor="shortcutfilename">{t('Shortcut.filename')}</Label>
          <InputGroup fullwidth append={<Bold className="u-pr-1">.url</Bold>}>
            <Input
              id="shortcutfilename"
              onChange={e => setFilename(e.target.value)}
            />
          </InputGroup>
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
