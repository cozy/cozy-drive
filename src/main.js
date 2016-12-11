require('./styles')

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('[role=application]').appendChild(
    document.createTextNode('Hello World!')
  )
})
