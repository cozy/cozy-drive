import { Component } from 'react'

class ContactsAndGroupsDataLoader extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.contacts.hasMore !== this.props.contacts.hasMore ||
      nextProps.contacts.fetchStatus !== this.props.contacts.fetchStatus ||
      nextProps.contacts.data.length !== this.props.contacts.data.length ||
      nextProps.groups.hasMore !== this.props.groups.hasMore ||
      nextProps.groups.fetchStatus !== this.props.groups.fetchStatus ||
      nextProps.groups.data.length !== this.props.groups.data.length
    )
  }

  componentDidUpdate() {
    if (this.props.contacts.hasMore) {
      this.props.contacts.fetchMore()
    }

    if (this.props.groups.hasMore) {
      this.props.groups.fetchMore()
    }
  }

  render() {
    return this.props.children
  }
}

export default ContactsAndGroupsDataLoader
