import keyBy from 'lodash/keyBy'
import { useDispatch } from 'react-redux'
import { hideSelectionBar } from 'drive/web/modules/selection/duck'

const withHideSelectionBarDispatch = (action, dispatch) => {
  if (!action.action) return action

  const actionFn = action.action
  const actionFnWithSelectionDispatch = (...args) => {
    actionFn(...args)
    dispatch(hideSelectionBar())
  }

  return {
    ...action,
    action: actionFnWithSelectionDispatch
  }
}

const useActions = (actionCreators, actionOptions = {}) => {
  const dispatch = useDispatch()

  return keyBy(
    actionCreators.map(createAction =>
      withHideSelectionBarDispatch(createAction(actionOptions), dispatch)
    ),
    'icon'
  )
}

export default useActions
