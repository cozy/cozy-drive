import { reducer as selection } from '../ducks/selection'
import upload from '../ducks/upload'
import alerterReducer from 'cozy-ui/react/Alerter'

export default {
  selection,
  upload,
  alerts: alerterReducer
}
