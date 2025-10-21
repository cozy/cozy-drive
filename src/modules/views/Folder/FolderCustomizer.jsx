import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Q, useClient } from 'cozy-client'
import Buttons from 'cozy-ui/transpiled/react/Buttons'
import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Grid from 'cozy-ui/transpiled/react/Grid'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { CustomizedIcon } from './CustomizedIcon'

import { ColorPicker } from '@/components/ColorPicker/ColorPicker'

export const FolderCustomizer = () => {
  const navigate = useNavigate()
  const { t } = useI18n()
  const [selectedColor, setSelectedColor] = useState('#46a2ff') // Default to first color (dark gray)
  const { isMobile } = useBreakpoints()
  const { showAlert } = useAlert()
  const client = useClient()
  const { folderId } = useParams()

  const handleColorSelect = color => {
    setSelectedColor(color)
  }

  const handleApply = async () => {
    try {
      const { data: folder } = await client.query(
        Q('io.cozy.files').getById(folderId)
      )
      await client.save({
        ...folder,
        decorations: {
          ...folder.decorations,
          color: selectedColor
        }
      })
    } catch (error) {
      showAlert({
        message: t('FolderCustomizer.error'),
        severity: 'error'
      })
    } finally {
      navigate('../')
    }
  }

  return (
    <FixedDialog
      size="small"
      onClose={() => navigate('../')}
      open={true}
      title={t('FolderCustomizer.title')}
      content={
        <>
          <Grid container justifyContent="center" className="u-mb-1">
            <Grid item>
              <CustomizedIcon selectedColor={selectedColor} size={52} />
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="center"
            className={`u-mt-1 u-mb-1${isMobile ? '' : '-half'}`}
          >
            <Grid item>
              <Typography variant="h6" noWrap>
                {t('FolderCustomizer.description')}
              </Typography>
            </Grid>
          </Grid>
          <ColorPicker
            selectedColor={selectedColor}
            onColorSelect={handleColorSelect}
          />
        </>
      }
      actions={
        <>
          <Buttons
            label={t('FolderCustomizer.cancel')}
            onClick={() => navigate('../')}
            variant="secondary"
          />
          <Buttons label={t('FolderCustomizer.apply')} onClick={handleApply} />
        </>
      }
    />
  )
}

FolderCustomizer.displayName = 'FolderCustomizer'
