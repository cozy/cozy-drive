/* global cozy */
import React from 'react'

const getFileDownloadUrl = async id => {
  const link = await cozy.client.files.getDownloadLinkById(id)
  return `${cozy.client._url}${link}`
}

class URLGetter extends React.Component {
  componentDidMount() {
    this.getURL()
  }

  async getURL() {
    const { service } = this.props

    try {
      const { id } = service.getData()
      const url = await getFileDownloadUrl(id)
      service.terminate({ url })
    } catch (error) {
      service.throw(error)
    }
  }
}

export default URLGetter
