import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useClient, useQuery } from 'cozy-client'
import Backdrop from 'cozy-ui/transpiled/react/Backdrop'
import Buttons from 'cozy-ui/transpiled/react/Buttons'
import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Grid from 'cozy-ui/transpiled/react/Grid'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { Spinner } from 'cozy-ui/transpiled/react/Spinner'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'

import { CustomizedIcon } from './CustomizedIcon'

import { ColorPicker, COLORS } from '@/components/ColorPicker/ColorPicker'
import logger from '@/lib/logger'
import { buildFileOrFolderByIdQuery } from '@/queries'

export const FolderCustomizer = () => {
  const { folderId } = useParams()

  const folderQuery = buildFileOrFolderByIdQuery(folderId)
  const result = useQuery(folderQuery.definition, folderQuery.options)
  const { fetchStatus, data: folder } = result

  return fetchStatus !== 'loaded' ? (
    <Backdrop isOver open>
      <Spinner size="xxlarge" middle noMargin color="var(--white)" />
    </Backdrop>
  ) : (
    <DumbFolderCustomizer folder={folder} />
  )
}

FolderCustomizer.displayName = 'FolderCustomizer'

const DumbFolderCustomizer = ({ folder }) => {
  const navigate = useNavigate()
  const { t } = useI18n()
  const [selectedColor, setSelectedColor] = useState(
    folder.metadata?.decorations?.color || COLORS[9]
  )
  const { showAlert } = useAlert()
  const client = useClient()

  const handleColorSelect = color => {
    setSelectedColor(color)
  }

  const handleApply = async () => {
    try {
      await client.save({
        ...folder,
        metadata: {
          ...folder.metadata,
          decorations: {
            ...folder.metadata?.decorations,
            color: selectedColor
          }
        }
      })
    } catch (error) {
      logger.error(`Error while updating folder decoration`, error)
      showAlert({
        message: t('FolderCustomizer.error'),
        severity: 'error'
      })
    } finally {
      navigate(`/folder/${folder.dir_id}`)
    }
  }

  if (!folder) {
    return null
  }

  return (
    <FixedDialog
      size="small"
      onClose={() => navigate(`/folder/${folder.dir_id}`)}
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
            className="u-mt-1 u-mb-1-t u-mb-1-half"
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
            onClick={() => navigate(`/folder/${folder.dir_id}`)}
            variant="secondary"
          />
          <Buttons label={t('FolderCustomizer.apply')} onClick={handleApply} />
        </>
      }
    />
  )
}
