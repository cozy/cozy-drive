import React, { Component } from 'react'
import PreviousButton from './PreviousButton'

class RouterPreviousButton extends Component {
  navigateToFolder = async folderId => {
    const { router, location, goToFolder, getFolderUrl } = this.props
    await goToFolder(folderId)
    router.push(getFolderUrl(folderId, location))
  }

  navigateToPath = path => {
    const { router } = this.props
    router.push(path)
  }

  navigateBack = () => {
    const previousSegment = this.props.path[this.props.path.length - 2]
    if (previousSegment.id) this.props.onFolderOpen(previousSegment.id)
    else this.navigateToPath(previousSegment.url)
  }

  render() {
    return <PreviousButton onClick={this.navigateBack} />
  }
}

export default RouterPreviousButton
