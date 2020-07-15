import { RealtimePlugin } from 'cozy-realtime'

const registerClientPlugins = client => {
  client.registerPlugin(RealtimePlugin)
}

export default registerClientPlugins
