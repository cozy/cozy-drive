import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { isQueryLoading, useClient, useQuery } from 'cozy-client'
import { getQualification } from 'cozy-client/dist/models/document'
import { themesList } from 'cozy-client/dist/models/document/documentTypeData'
import { isQualificationNote } from 'cozy-client/dist/models/document/documentTypeDataHelpers'
import { getBoundT } from 'cozy-client/dist/models/document/locales'
import flag from 'cozy-flags'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconStack from 'cozy-ui/transpiled/react/IconStack'
import NestedSelectResponsive from 'cozy-ui/transpiled/react/NestedSelect/NestedSelectResponsive'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { LoaderModal } from 'components/LoaderModal'
import { buildFileByIdQuery } from 'modules/queries'

const getThemesList = () =>
  flag('hide.healthTheme.enabled')
    ? themesList.filter(theme => theme.label !== 'health')
    : themesList

const OptionIconStack = ({ icon }) => {
  return (
    <IconStack
      backgroundIcon={<Icon icon="file-duotone" color="#E049BF" size={32} />}
      {...(icon && {
        foregroundIcon: <Icon icon={icon} color="#E049BF" size={16} />
      })}
    />
  )
}

const makeOptions = ({ t, scannerT, focusedId }) => {
  const themesWithNone = [
    {
      id: 'none',
      items: [],
      label: t('Scan.none')
    },
    ...getThemesList()
  ]
  return {
    focusedId,
    children: themesWithNone.map(theme => {
      return {
        id: theme.label,
        title:
          theme.id === 'none'
            ? t('Scan.none')
            : scannerT(`Scan.themes.${theme.label}`),
        icon: <OptionIconStack icon={theme.icon} />,
        children: theme.items.map(item => {
          return {
            id: item.label,
            item,
            title: scannerT(`Scan.items.${item.label}`),
            icon: isQualificationNote(item) ? (
              <Icon icon="file-type-note" size={64} />
            ) : (
              <OptionIconStack icon={item.icon} />
            )
          }
        })
      }
    })
  }
}

export const QualifyFileView = () => {
  const navigate = useNavigate()
  const { fileId } = useParams()
  const { t, lang } = useI18n()
  const client = useClient()
  const scannerT = getBoundT(lang || 'en')

  const fileQuery = buildFileByIdQuery(fileId)
  const { data: file, ...fileQueryResult } = useQuery(
    fileQuery.definition,
    fileQuery.options
  )
  const qualificationLabel = getQualification(file)?.label
  const defaultOptions = makeOptions({
    t,
    scannerT,
    focusedId: qualificationLabel
  })

  const onClose = () => {
    navigate('..', { replace: true })
  }

  const handleClick = async ({ title, item }) => {
    const fileCollection = client.collection('io.cozy.files')
    const removeQualification = qualificationLabel && title === t('Scan.none')

    if (!qualificationLabel && removeQualification) {
      return onClose()
    }

    await fileCollection.updateMetadataAttribute(file._id, {
      qualification: removeQualification ? undefined : item
    })
    onClose()
  }

  const isSelected = ({ title, item }) => {
    return qualificationLabel
      ? qualificationLabel === item?.label
      : title === t('Scan.none')
  }

  if (isQueryLoading(fileQueryResult)) {
    return <LoaderModal />
  }

  return (
    <NestedSelectResponsive
      title={file.name}
      options={defaultOptions}
      noDivider
      document={file}
      onSelect={handleClick}
      isSelected={isSelected}
      onClose={onClose}
    />
  )
}
