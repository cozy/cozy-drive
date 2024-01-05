import { useSelectionContext } from 'modules/selection/SelectionProvider'
const withHideSelectionBar = (action, hideSelectionBar) => {
  if (!action.action) return action

  const actionFn = action.action
  const actionFnWithSelectionDispatch = (...args) => {
    actionFn(...args)
    hideSelectionBar()
  }

  return {
    ...action,
    action: actionFnWithSelectionDispatch
  }
}

const useActions = (actionCreators, actionOptions = {}) => {
  const { hideSelectionBar } = useSelectionContext()

  let actions = []
  actionCreators.map(createAction => {
    const enhancedAction = withHideSelectionBar(
      createAction(actionOptions),
      hideSelectionBar
    )
    actions.push({ [enhancedAction.name]: enhancedAction })
  })
  return actions
}

export default useActions
