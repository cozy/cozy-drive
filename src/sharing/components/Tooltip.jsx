import React from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'
import styles from './tooltip.styl'

export const SharingTooltip = props => (
  <ReactTooltip
    place="bottom"
    effect="solid"
    className={styles['shared-tooltip']}
    {...props}
  >
    {props.children}
  </ReactTooltip>
)
// accepts all the props from https://github.com/wwayne/react-tooltip#options

export class TooltipRecipientList extends React.Component {
  static contextTypes = {
    t: PropTypes.func.isRequired
  }
  render() {
    const { t } = this.context
    const { recipientNames, cutoff = 4 } = this.props

    return (
      <ul className={styles['shared-tooltip-list']}>
        {recipientNames.slice(0, cutoff).map(name => (
          <li key={`key_name_${name}`}>{name}</li>
        ))}
        {recipientNames.length > cutoff && (
          <li>
            {t('Share.members.others', {
              smart_count: recipientNames.slice(cutoff).length
            })}
          </li>
        )}
      </ul>
    )
  }
}

TooltipRecipientList.propTypes = {
  recipientNames: PropTypes.arrayOf(PropTypes.string),
  cutoff: PropTypes.number
}
TooltipRecipientList.defaultProps = {
  recipientNames: [],
  cutoff: 4
}
