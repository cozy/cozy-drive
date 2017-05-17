import React from 'react'
import ReactDOM from 'react-dom'

const confirm = (component, saga) => {
  const wrapper = document.body.appendChild(document.createElement('div'))

  const abort = () => {
    ReactDOM.unmountComponentAtNode(wrapper)
  }

  const confirm = () => {
    saga()
    .then(() => {
      ReactDOM.unmountComponentAtNode(wrapper)
    })
  }

  ReactDOM.render(React.cloneElement(component, { confirm, abort }), wrapper)
}

export default confirm
