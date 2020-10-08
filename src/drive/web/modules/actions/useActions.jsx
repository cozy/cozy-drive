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
  let actions = []
  actionCreators.map(createAction => {
    const enhancedAction = withHideSelectionBarDispatch(
      createAction(actionOptions),
      dispatch
    )
    const name = enhancedAction.icon

    actions.push({ [name]: enhancedAction })
  })
  return actions
}

export default useActions
