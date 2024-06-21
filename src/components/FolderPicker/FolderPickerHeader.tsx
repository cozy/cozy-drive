import React from 'react'

import Card from 'cozy-ui/transpiled/react/Card'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { Media, Img, Bd } from 'cozy-ui/transpiled/react/deprecated/Media'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { FolderPickerHeaderIllustration } from 'components/FolderPicker/FolderPickerHeaderIllustration'
import { FolderPickerEntry } from 'components/FolderPicker/types'

interface FolderPickerHeaderProps {
  entries: FolderPickerEntry[]
  title?: string
  subTitle?: string
}

const specificCardStyle: React.CSSProperties = {
  marginLeft: '2rem',
  marginRight: '4rem',
  marginTop: '1rem',
  marginBottom: '1rem'
}

const FolderPickerHeader: React.FC<FolderPickerHeaderProps> = ({
  entries,
  title,
  subTitle
}) => {
  const { t } = useI18n()
  const titleToUse = title
    ? title
    : t('Move.title', { smart_count: entries.length })
  const subTitleToUse = subTitle ? subTitle : t('Move.to')

  return (
    <Card inset className="u-bg-paleGrey" style={specificCardStyle}>
      <Media>
        <Img className="u-mr-1">
          <FolderPickerHeaderIllustration entries={entries} />
        </Img>
        <Bd>
          <Typography variant="h6" noWrap>
            {entries.length !== 1 ? titleToUse : entries[0].name}
          </Typography>
          <Typography variant="caption" color="textSecondary" noWrap>
            {subTitleToUse}
          </Typography>
        </Bd>
      </Media>
    </Card>
  )
}

export { FolderPickerHeader }
