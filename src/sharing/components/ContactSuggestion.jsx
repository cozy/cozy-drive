import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import { Avatar } from 'cozy-ui/transpiled/react'
import { translate } from 'cozy-ui/transpiled/react/I18n'

import styles from 'sharing/components/recipient.styl'

import { Contact, Group } from 'models'
import Identity from 'sharing/components/Identity'

export const ContactSuggestion = ({ contactOrGroup, contacts, t }) => {
  let avatarText, name, details
  if (contactOrGroup._type === Group.doctype) {
    name = contactOrGroup.name
    const membersCount = contacts
      .reduce((total, contact) => {
        if (
          get(contact, 'relationships.groups.data', [])
            .map(group => group._id)
            .includes(contactOrGroup._id)
        ) {
          return total + 1
        }

        return total
      }, 0)
      .toString()
    details = t('Share.members.count', {
      smart_count: membersCount
    })
    avatarText = 'G'
  } else {
    name = Contact.getDisplayName(contactOrGroup)
    avatarText = Contact.getInitials(contactOrGroup)
    details = Contact.getPrimaryCozy(contactOrGroup)
  }

  return (
    <div className={styles['recipient']}>
      <Avatar text={avatarText} size="small" />
      <Identity name={name} details={details} />
    </div>
  )
}

ContactSuggestion.propTypes = {
  contactOrGroup: PropTypes.oneOfType([Contact.propType, Group.propType])
    .isRequired,
  contacts: PropTypes.arrayOf(Contact.propType),
  t: PropTypes.func.isRequired
}

export default translate()(ContactSuggestion)
