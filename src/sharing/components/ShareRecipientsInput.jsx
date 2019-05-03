import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { contactsResponseType, groupsResponseType } from 'sharing/propTypes'
import ShareAutosuggest from 'sharing/components/ShareAutosuggest'
import styles from 'sharing/share.styl'

class ShareRecipientsInput extends Component {
  static contextTypes = {
    client: PropTypes.object.isRequired
  }

  state = {
    loading: false
  }

  componentDidUpdate() {
    const { contacts, groups } = this.props
    if (
      this.state.loading &&
      !contacts.hasMore &&
      contacts.fetchStatus === 'loaded' &&
      !groups.hasMore &&
      groups.fetchStatus === 'loaded'
    ) {
      this.setState({
        loading: false
      })
    }
  }

  onFocus = () => {
    const { contacts, groups } = this.props
    if (
      contacts.hasMore ||
      contacts.fetchStatus === 'loading' ||
      groups.hasMore ||
      groups.fetchStatus === 'loading'
    ) {
      this.setState({
        loading: true
      })
    }
  }

  getContactsAndGroups = () => {
    // we need contacts to be loaded to be able to add all group members to recipients
    const { contacts, groups } = this.props
    if (contacts.hasMore || contacts.fetchStatus === 'loading') {
      return contacts.data
    } else {
      return [...contacts.data, ...groups.data]
    }
  }

  render() {
    const { label, onPick, onRemove, placeholder, recipients } = this.props
    const { loading } = this.state
    return (
      <div>
        <label className={styles['coz-form-label']} htmlFor="email">
          {label}
        </label>
        <ShareAutosuggest
          loading={loading}
          contactsAndGroups={this.getContactsAndGroups()}
          recipients={recipients}
          onFocus={this.onFocus}
          onPick={onPick}
          onRemove={onRemove}
          placeholder={placeholder}
        />
      </div>
    )
  }
}

ShareRecipientsInput.propTypes = {
  label: PropTypes.string,
  contacts: contactsResponseType.isRequired,
  groups: groupsResponseType.isRequired,
  recipients: PropTypes.array,
  onPick: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  placeholder: PropTypes.string
}

ShareRecipientsInput.defaultProps = {
  label: 'To:',
  recipients: []
}

export default ShareRecipientsInput
