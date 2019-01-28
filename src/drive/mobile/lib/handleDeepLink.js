const PROTOCOL = 'cozydrive://'
const RX = new RegExp('^' + PROTOCOL)

export default history => url => {
  console.log('new URL', url)
  const stripped = url.replace(RX, '')
  //stripped = auth?token=""&access_code
  //index.html#auth?token=XXX
  console.log('stripped', stripped)
  if (stripped.includes('auth?')) {
    window.location.reload()
  }
  history.push(stripped)
}
