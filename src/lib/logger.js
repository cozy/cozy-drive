import minilog from 'minilog'

const logger = minilog('cozy-drive')
minilog.enable()

minilog.suggest.allow('cozy-drive', 'log')
minilog.suggest.allow('cozy-drive', 'info')
export default logger
