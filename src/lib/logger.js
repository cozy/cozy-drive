/* global __APP_SLUG__ */
import minilog from 'minilog'

const logger = minilog(`cozy-${__APP_SLUG__}`)
minilog.enable()

minilog.suggest.allow(`cozy-${__APP_SLUG__}`, 'log')
minilog.suggest.allow(`cozy-${__APP_SLUG__}`, 'info')

export default logger
