import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import PreviousButton from 'drive/web/modules/navigation/Breadcrumb/PreviousButton'

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

RouterPreviousButton.propTypes = {
  path: PropTypes.array,
  onFolderOpen: PropTypes.func.isRequired,
  goToFolder: PropTypes.func.isRequired,
  router: PropTypes.object
}

export default withRouter(RouterPreviousButton)
