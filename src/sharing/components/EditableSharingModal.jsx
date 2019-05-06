import React from 'react'
import PropTypes from 'prop-types'
import flow from 'lodash/flow'
import { queryConnect, withClient } from 'cozy-client'

import { Contact, Group } from 'models'
import { contactsResponseType, groupsResponseType } from 'sharing/propTypes'
import SharingContext from 'sharing/context'
import ContactsAndGroupsDataLoader from 'sharing/components/ContactsAndGroupsDataLoader'
import { default as DumbShareModal } from 'sharing/components/ShareModal'

const EditableSharingModal = ({
  client,
  contacts,
  document,
  groups,
  ...rest
}) => {
  return (
    <ContactsAndGroupsDataLoader contacts={contacts} groups={groups}>
      <SharingContext.Consumer>
        {({
          documentType,
          isOwner,
          getRecipients,
          getSharingLink,
          share,
          revoke,
          shareByLink,
          revokeSharingLink,
          hasSharedParent,
          hasSharedChild
        }) => (
          <DumbShareModal
            document={document}
            documentType={documentType}
            contacts={contacts}
            createContact={contact => client.create(Contact.doctype, contact)}
            groups={groups}
            recipients={getRecipients(document.id)}
            link={getSharingLink(document.id)}
            isOwner={isOwner(document.id)}
            hasSharedParent={hasSharedParent(document)}
            hasSharedChild={hasSharedChild(document)}
            onShare={share}
            onRevoke={revoke}
            onShareByLink={shareByLink}
            onRevokeLink={revokeSharingLink}
            {...rest}
          />
        )}
      </SharingContext.Consumer>
    </ContactsAndGroupsDataLoader>
  )
}

EditableSharingModal.PropTypes = {
  client: PropTypes.object.isRequired,
  document: PropTypes.object,
  contacts: contactsResponseType.isRequired,
  groups: groupsResponseType.isRequired
}

const contactsQuery = client =>
  client
    .all(Contact.doctype)
    .where({
      _id: {
        $gt: null
      },
      trashed: {
        $or: [{ $eq: false }, { $exists: false }]
      },
      $or: [
        {
          cozy: {
            $not: {
              $size: 0
            }
          }
        },
        {
          email: {
            $not: {
              $size: 0
            }
          }
        }
      ]
    })
    .indexFields(['_id'])

const groupsQuery = client => client.all(Group.doctype)

export default flow(
  queryConnect({
    contacts: {
      query: contactsQuery,
      as: 'contacts'
    },
    groups: {
      query: groupsQuery,
      as: 'groups'
    }
  }),
  withClient
)(EditableSharingModal)
