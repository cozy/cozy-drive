import React from 'react'
import ReactDOM from 'react-dom'

const confirm = component => new Promise((resolve, reject) => {
  let wrapper = document.body.appendChild(document.createElement('div'))

  let abort = () => {
    console.log('unmount confirm modal')
    ReactDOM.unmountComponentAtNode(wrapper)
    reject()
  }

  let confirm = () => {
    console.log('unmount confirm modal')
    ReactDOM.unmountComponentAtNode(wrapper)
    resolve()
  }

  ReactDOM.render(React.cloneElement(component, { confirm, abort }), wrapper)
})

export default confirm
