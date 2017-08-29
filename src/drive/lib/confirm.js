import React from 'react'
import ReactDOM from 'react-dom'

const createWrapper = () => document.body.appendChild(document.createElement('div'))

const confirm = component => new Promise((resolve, reject) => {
  const wrapper = createWrapper()

  const abort = () => {
    ReactDOM.unmountComponentAtNode(wrapper)
    reject()
  }

  const confirm = () => {
    ReactDOM.unmountComponentAtNode(wrapper)
    resolve()
  }

  ReactDOM.render(React.cloneElement(component, { confirm, abort }), wrapper)
})

export default confirm

export const alert = component => {
  const wrapper = createWrapper()

  const close = () => {
    ReactDOM.unmountComponentAtNode(wrapper)
  }

  ReactDOM.render(React.cloneElement(component, { close }), wrapper)
}
