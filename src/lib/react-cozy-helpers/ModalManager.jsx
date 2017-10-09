import React from 'react'
import { connect } from 'react-redux'

const SHOW_MODAL = 'SHOW_MODAL'
const HIDE_MODAL = 'HIDE_MODAL'

const reducer = (state = { show: false, component: null }, action) => {
  switch (action.type) {
    case SHOW_MODAL:
      return { show: true, component: action.component }
    case HIDE_MODAL:
      return { show: false, component: null }
    default:
      return state
  }
}

export default reducer

export const showModal = component => ({
  type: SHOW_MODAL,
  component
})

const hideModal = () => ({
  type: HIDE_MODAL
})

export const ModalManager = connect((state, ownProps) => ({
  ...state.ui.modal
}))(({ show, component, dispatch }) => {
  if (!show) return null
  return React.cloneElement(component, { onClose: () => dispatch(hideModal()) })
})
