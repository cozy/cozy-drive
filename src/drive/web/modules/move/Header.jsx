import React from 'react'
import PropTypes from 'prop-types'
import {
  Well,
  Media,
  Img,
  Bd,
  Circle,
  Counter,
  Icon,
  Button,
  Caption,
  Bold
} from 'cozy-ui/react'
import palette from 'cozy-ui/stylus/settings/palette.json'
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

const Header = ({ entries, onClose }, { t }) => (
  <Well>
    <Media>
      <Img className="u-mr-1">
        <HeaderIlustration count={entries.length} />
      </Img>
      <Bd>
        <Bold ellipsis>
          {entries.length > 1
            ? t('Move.title', { smart_count: entries.length })
            : entries[0].name}
        </Bold>
        <Caption ellipsis>{t('Move.to')}</Caption>
      </Bd>
      <Button theme="close" onClick={onClose} extension="narrow" type="button">
        <Icon icon="cross" width="14" height="14" color={palette['coolGrey']} />
      </Button>
    </Media>
  </Well>
)

Header.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired
}

Header.contextTypes = {
  t: PropTypes.func.isRequired
}

export default Header
