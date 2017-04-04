import React from 'react'
import ReactDOM from 'react-dom'

const confirm = component => new Promise((resolve, reject) => {
  const wrapper = document.body.appendChild(document.createElement('div'))

  const abort = () => {
    console.log('unmount confirm modal')
    ReactDOM.unmountComponentAtNode(wrapper)
    reject()
  }

  const confirm = () => {
    console.log('unmount confirm modal')
    ReactDOM.unmountComponentAtNode(wrapper)
    resolve()
  }

  ReactDOM.render(React.cloneElement(component, { confirm, abort }), wrapper)
})

export default confirm
