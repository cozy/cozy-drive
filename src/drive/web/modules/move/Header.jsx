import React from 'react'
import PropTypes from 'prop-types'

import { Media, Img, Bd } from 'cozy-ui/transpiled/react/Media'
import Circle from 'cozy-ui/transpiled/react/Circle'
import Counter from 'cozy-ui/transpiled/react/Counter'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Card from 'cozy-ui/transpiled/react/Card'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import DriveIcon from 'cozy-ui/transpiled/react/Icons/FileTypeFolder'

const HeaderIlustration = ({ count }) => {
  return count > 1 ? (
    <Circle>
      <Counter count={count} />
    </Circle>
  ) : (
    <Icon icon={DriveIcon} size={32} />
  )
}

const Header = ({ entries, title, subTitle }) => {
  const { t } = useI18n()
  const titleToUse = title
    ? title
    : t('Move.title', { smart_count: entries.length })
  const subTitleToUse = subTitle ? subTitle : t('Move.to')

  return (
    <Card inset className="u-bg-paleGrey">
      <Media>
        <Img className="u-mr-1">
          <HeaderIlustration count={entries.length} />
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
