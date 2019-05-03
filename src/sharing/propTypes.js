import PropTypes from 'prop-types'

import { Contact, Group } from 'models'

export const contactsResponseType = PropTypes.shape({
  count: PropTypes.number,
  data: PropTypes.arrayOf(Contact.propType),
  definition: PropTypes.object,
  fetchMore: PropTypes.func,
  fetchStatus: PropTypes.string,
  hasMore: PropTypes.bool,
  id: PropTypes.string,
  lastError: PropTypes.string,
  lastFetch: PropTypes.number,
  lastUpdate: PropTypes.number
})

export const groupsResponseType = PropTypes.shape({
  count: PropTypes.number,
  data: PropTypes.arrayOf(Group.propType),
  definition: PropTypes.object,
  fetchMore: PropTypes.func,
  fetchStatus: PropTypes.string,
  hasMore: PropTypes.bool,
  id: PropTypes.string,
  lastError: PropTypes.string,
  lastFetch: PropTypes.number,
  lastUpdate: PropTypes.number
})
