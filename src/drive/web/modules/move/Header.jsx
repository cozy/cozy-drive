import React from 'react'
import PropTypes from 'prop-types'

import { Media, Img, Bd } from 'cozy-ui/transpiled/react/Media'
import Circle from 'cozy-ui/transpiled/react/Circle'
import Button from 'cozy-ui/transpiled/react/Button'
import Counter from 'cozy-ui/transpiled/react/Counter'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Card from 'cozy-ui/transpiled/react/Card'
import palette from 'cozy-ui/stylus/settings/palette.json'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import CrossIcon from 'cozy-ui/transpiled/react/Icons/Cross'

import DriveIcon from 'drive/assets/icons/icon-drive.svg'

const HeaderIlustration = ({ count }) => {
  return count > 1 ? (
    <Circle>
      <Counter count={count} />
    </Circle>
  ) : (
    <Icon icon={DriveIcon} size={32} />
  )
}

const Header = ({ entries, onClose, title, subTitle }) => {
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
          <Typography variant="h6" ellipsis>
            {entries.length !== 1 ? titleToUse : entries[0].name}
          </Typography>
          <Typography variant="caption" color="textSecondary" ellipsis>
            {subTitleToUse}
          </Typography>
        </Bd>
        <Button
          theme="close"
          onClick={onClose}
          extension="narrow"
          type="button"
          iconOnly
          label="back"
        >
          <Icon
            icon={CrossIcon}
            width="14"
            height="14"
            color={palette['coolGrey']}
          />
        </Button>
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
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  subTitle: PropTypes.string
}

export default Header
