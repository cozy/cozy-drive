import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import Breadcrumb from './Breadcrumb'

class RouterBreadCrumb extends Component {
  state = {
    opening: false
  }

  toggleOpening = () => {
    this.setState(state => ({ opening: !state.opening }))
  }

  navigateToFolder = async folderId => {
    const { goToFolder } = this.props

    this.toggleOpening()

    await goToFolder(folderId)
    this.toggleOpening()
  }

  navigateToPath = path => {
    const { router } = this.props
    router.push(path)
  }

  navigateTo = folder => {
    if (folder.id) this.props.onFolderOpen(folder.id)
    else this.navigateToPath(folder.url)
  }

  render() {
    const { path } = this.props
    const { opening } = this.state

    return (
      <Breadcrumb
        path={path}
        onBreadcrumbClick={this.navigateTo}
        opening={opening}
      />
    )
  }
}

RouterBreadCrumb.propTypes = {
  path: PropTypes.array,
  onFolderOpen: PropTypes.func.isRequired,
  goToFolder: PropTypes.func.isRequired,
  router: PropTypes.object
}

export default withRouter(RouterBreadCrumb)
