import React from 'react'
import PropTypes from 'prop-types'

import { Media, Img, Bd } from 'cozy-ui/transpiled/react/Media'
import Circle from 'cozy-ui/transpiled/react/Circle'
import Counter from 'cozy-ui/transpiled/react/Counter'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Card from 'cozy-ui/transpiled/react/Card'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DriveIcon from 'cozy-ui/transpiled/react/Icons/FileTypeFolder'
import FileThumbnail from '../filelist/FileThumbnail'
const HeaderIlustration = ({ entries }) => {
  if (entries.length === 1) {
    // this is a cozy files
    if (entries[0].class) {
      return <FileThumbnail file={entries[0]} />
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
