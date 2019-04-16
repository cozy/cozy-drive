import React, { Component } from 'react'
import PropTypes from 'prop-types'

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

  render() {
    const {
      contacts,
      groups,
      label,
      onPick,
      onRemove,
      placeholder,
      recipients
    } = this.props
    const { loading } = this.state
    const contactsAndGroups = [...contacts.data, ...groups.data]
    return (
      <div>
        <label className={styles['coz-form-label']} htmlFor="email">
          {label}
        </label>
        <ShareAutosuggest
          loading={loading}
          contactsAndGroups={contactsAndGroups}
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
  contacts: PropTypes.object.isRequired,
  groups: PropTypes.object.isRequired,
  recipients: PropTypes.array,
  onPick: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  placeholder: PropTypes.string
}

ShareRecipientsInput.defaultProps = {
  label: 'To:',
  contacts: [],
  recipients: []
}

export default ShareRecipientsInput
