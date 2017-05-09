import React from 'react'
import ReactDOM from 'react-dom'

const confirm = component => new Promise((resolve, reject) => {
  const wrapper = document.body.appendChild(document.createElement('div'))

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
