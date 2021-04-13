import flag from 'cozy-flags'
import { RealtimePlugin } from 'cozy-realtime'

const registerClientPlugins = client => {
  client.registerPlugin(RealtimePlugin)
  client.registerPlugin(flag.plugin)
}

export default registerClientPlugins
