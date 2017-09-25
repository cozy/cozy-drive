import React from 'react'
import { getFileDownloadUrl } from '../../../actions'

class URLGetter extends React.Component {
  componentDidMount () {
    this.getURL()
  }

  async getURL () {
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
