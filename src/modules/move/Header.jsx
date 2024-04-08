import PropTypes from 'prop-types'
import React from 'react'

import Card from 'cozy-ui/transpiled/react/Card'
import Circle from 'cozy-ui/transpiled/react/Circle'
import Counter from 'cozy-ui/transpiled/react/Counter'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DriveIcon from 'cozy-ui/transpiled/react/Icons/FileTypeFolder'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { Media, Img, Bd } from 'cozy-ui/transpiled/react/deprecated/Media'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import getMimeTypeIcon from 'lib/getMimeTypeIcon'

import FileThumbnail from '../filelist/FileThumbnail'
const HeaderIlustration = ({ entries }) => {
  if (entries.length === 1) {
    const firstItem = entries[0]

    // this is a cozy files
    if (firstItem.class) {
      return <FileThumbnail file={firstItem} />
    }

    // this is a cozy-flagship file, doesn't have a class yet
    if (firstItem.fromFlagship) {
      return (
        <Icon
          icon={getMimeTypeIcon(false, firstItem.fileName, firstItem.mimeType)}
          size={32}
        />
      )
    }

    return <Icon icon={DriveIcon} size={32} />
  }
  if (entries.length > 1) {
    return (
      <Circle>
        <Counter count={entries.length} />
      </Circle>
    )
  }
  return null
}

const specificCardStyle = {
  marginLeft: '2rem',
  marginRight: '4rem',
  marginTop: '1rem',
  marginBottom: '1rem'
}
const Header = ({ entries, title, subTitle }) => {
  const { t } = useI18n()
  const titleToUse = title
    ? title
    : t('Move.title', { smart_count: entries.length })
  const subTitleToUse = subTitle ? subTitle : t('Move.to')

  return (
    <Card inset className="u-bg-paleGrey" style={specificCardStyle}>
      <Media>
        <Img className="u-mr-1">
          <HeaderIlustration entries={entries} />
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

Header.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string
    })
  ).isRequired,
  title: PropTypes.string,
  subTitle: PropTypes.string
}

export default Header
