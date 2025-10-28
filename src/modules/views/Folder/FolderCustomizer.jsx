import React, { useState } from 'react'

import { useClient, useQuery } from 'cozy-client'
import Backdrop from 'cozy-ui/transpiled/react/Backdrop'
import Buttons from 'cozy-ui/transpiled/react/Buttons'
import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Grid from 'cozy-ui/transpiled/react/Grid'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { Spinner } from 'cozy-ui/transpiled/react/Spinner'
import Tab from 'cozy-ui/transpiled/react/Tab'
import Tabs from 'cozy-ui/transpiled/react/Tabs'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'

import { CustomizedIcon } from './CustomizedIcon'

import styles from '@/styles/folder-customizer.styl'

import { ColorPicker } from '@/components/ColorPicker/ColorPicker'
import { COLORS } from '@/components/ColorPicker/constants'
import { IconPicker } from '@/components/IconPicker/index.jsx'
import logger from '@/lib/logger'
import { buildFileOrFolderByIdQuery } from '@/queries'

export const FolderCustomizerModal = ({ folderId, onClose }) => {
  const folderQuery = buildFileOrFolderByIdQuery(folderId)
  const result = useQuery(folderQuery.definition, folderQuery.options)
  const { fetchStatus, data: folder } = result

  return fetchStatus !== 'loaded' ? (
    <Backdrop isOver open>
      <Spinner size="xxlarge" middle noMargin color="var(--white)" />
    </Backdrop>
  ) : (
    <DumbFolderCustomizer folder={folder} onClose={onClose} />
  )
}

FolderCustomizerModal.displayName = 'FolderCustomizerModal'

const DumbFolderCustomizer = ({ folder, onClose }) => {
  const { t } = useI18n()
  const tabItems = ['colors', 'icons']
  const [selectedColor, setSelectedColor] = useState(
    folder.metadata?.decorations?.color || COLORS[9]
  )
  const [selectedIcon, setSelectedIcon] = useState(
    folder.metadata?.decorations?.icon || null
  )
  const [selectedIconColor, setSelectedIconColor] = useState(
    folder.metadata?.decorations?.icon_color
  )
  const { showAlert } = useAlert()
  const client = useClient()

  const handleColorSelect = color => {
    setSelectedColor(color)
  }
  const handleIconSelect = iconName => {
    setSelectedIcon(iconName)
  }
  const handleIconColorSelect = color => {
    setSelectedIconColor(color)
  }

  const handleApply = async () => {
    try {
      await client.save({
        ...folder,
        metadata: {
          ...folder.metadata,
          decorations: {
            ...folder.metadata?.decorations,
            color: selectedColor,
            icon: selectedIcon,
            icon_color: selectedIconColor
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
      onClose()
    }
  }
  const [selectedTab, setSelectedTab] = useState(0)

  const handleTabChange = (_, newValue) => {
    setSelectedTab(newValue)
  }

  return (
    <FixedDialog
      size="small"
      onClose={onClose}
      open={true}
      title={t('FolderCustomizer.title')}
      content={
        <Grid
          container
          wrap="nowrap"
          direction="column"
          className={`u-h-100 ${styles['foldercustomizer-dialog']}`}
        >
          <Grid item className="u-mb-1 u-ta-center">
            <CustomizedIcon
              selectedColor={selectedColor}
              selectedIcon={selectedIcon}
              selectedIconColor={selectedIconColor}
              size={52}
            />
          </Grid>

          <Grid container item justifyContent="center" className="u-mb-1">
            <Tabs
              narrowed
              value={selectedTab}
              textColor="primary"
              indicatorColor="primary"
              onChange={handleTabChange}
            >
              {tabItems.map(tabItem => (
                <Tab
                  label={t(`FolderCustomizer.tabs.${tabItem}`)}
                  key={tabItem}
                />
              ))}
            </Tabs>
          </Grid>

          <Grid
            item
            container
            justifyContent="center"
            direction="column"
            className={styles['foldercustomizer-tabs-container']}
          >
            {tabItems[selectedTab] === 'colors' && (
              <Grid item className="u-ta-center u-mt-3-t">
                <Typography
                  variant="h6"
                  className="u-mt-1 u-mb-1-t u-mb-1-half"
                >
                  {t('FolderCustomizer.description')}
                </Typography>
                <ColorPicker
                  selectedColor={selectedColor}
                  onColorSelect={handleColorSelect}
                />
              </Grid>
            )}
            {tabItems[selectedTab] === 'icons' && (
              <Grid item className={styles['foldercustomizer-icons-container']}>
                <IconPicker
                  selectedIcon={selectedIcon}
                  selectedIconColor={selectedIconColor}
                  onIconSelect={handleIconSelect}
                  onIconColorSelect={handleIconColorSelect}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      }
      actions={
        <>
          <Buttons
            label={t('FolderCustomizer.cancel')}
            onClick={onClose}
            variant="secondary"
          />
          <Buttons label={t('FolderCustomizer.apply')} onClick={handleApply} />
        </>
      }
    />
  )
}
