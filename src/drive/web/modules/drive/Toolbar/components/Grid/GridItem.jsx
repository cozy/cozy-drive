import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from 'cozy-ui/react/MuiCozyTheme/Grid'

class GridItem extends Component {
  render() {
    const { onClick, children } = this.props
    return (
      <Grid
        item
        xs={3}
        sm={2}
        onClick={() => onClick && onClick()}
        className="u-ta-center u-bxz u-bdrs-3 u-ellipsis"
      >
        {children}
      </Grid>
    )
  }
}
GridItem.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired
}
export default GridItem
