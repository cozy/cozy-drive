import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { hasQueryBeenLoaded, useClient, useQuery } from 'cozy-client'
import { themesList } from 'cozy-client/dist/models/document/documentTypeData'
import flag from 'cozy-flags'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconStack from 'cozy-ui/transpiled/react/IconStack'
import NestedSelectResponsive from 'cozy-ui/transpiled/react/NestedSelect/NestedSelectResponsive'

import { LoaderModal } from 'components/LoaderModal'
import { useScannerI18n } from 'lib/ScannerI18nProvider'
import { buildFileByIdQuery } from 'modules/queries'

export const getThemesList = () =>
  flag('hide.healthTheme.enabled')
    ? themesList.filter(theme => theme.label !== 'health')
    : themesList

export const isReminder = item => item.label.includes('note_')

const FileIcon = ({ icon, faded }) => {
  return (
    <IconStack
      backgroundClassName={faded ? 'u-o-50' : ''}
      backgroundIcon={<Icon icon="file-duotone" color="#E049BF" size={32} />}
      {...(icon && {
        foregroundIcon: <Icon icon={icon} color="#E049BF" size={16} />
      })}
    />
  )
}

const QualifyFileView = () => {
  const navigate = useNavigate()
  const { fileId } = useParams()
  const scannerT = useScannerI18n()
  const client = useClient()

  const options = useMemo(
    () => ({
      children: getThemesList().map((theme, index) => {
        return {
          id: index,
          title: scannerT(`themes.${theme.label}`),
          icon: <FileIcon icon={theme.icon} />,
          children: theme.items.map((item, index) => {
            return {
              id: index,
              key: index,
              item,
              title: scannerT(`items.${item.label}`),
              icon: isReminder(item) ? (
                <Icon icon={item.icon} size={64} />
              ) : (
                <FileIcon icon={item.icon} />
              )
            }
          })
        }
      })
    }),
    [scannerT]
  )

  const fileQuery = buildFileByIdQuery(fileId)
  const file = useQuery(fileQuery.definition, fileQuery.options)

  const onClose = () => {
    navigate('..', { replace: true })
  }

  const handleClick = async option => {
    const fileCollection = client.collection('io.cozy.files')
    console.log('==========')
    console.log('option : ', option)
    console.log('==========')
    await fileCollection.updateMetadataAttribute(file.data._id, {
      qualification: option.item
    })
    onClose()
  }

  if (hasQueryBeenLoaded(file) && file.data) {
    return (
      <NestedSelectResponsive
        title={file.data.name}
        options={options}
        noDivider
        ellipsis={false}
        document={file.data}
        onSelect={option => handleClick(option)}
        isSelected={() => false}
        onClose={onClose}
      />
    )
  }

  return <LoaderModal />
}

export { QualifyFileView }
