import keyBy from 'lodash/keyBy'

const useActions = (actionCreators, actionOptions = {}) => {
  return keyBy(
    actionCreators.map(createAction => createAction(actionOptions)),
    'icon'
  )
}

export default useActions
