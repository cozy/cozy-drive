const PROTOCOL = 'cozydrive://'
const RX = new RegExp('^' + PROTOCOL)

export default history => url => {
  const stripped = url.replace(RX, '')
  history.push(stripped)
}
