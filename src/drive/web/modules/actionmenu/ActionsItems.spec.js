import { getOnlyNeededActions } from './ActionsItems'

describe('ActionsItems', () => {
  test('getOnlyNeededActions method', () => {
    const trash = {
      trash: {
        icon: 'trash',
        displayCondition: () => {
          return true
        }
      }
    }
    const share = {
      share: {
        icon: 'share',
        displayCondition: () => {
          return false
        }
      }
    }
    const rename = {
      rename: {
        icon: 'rename',
        displayCondition: () => {
          return true
        }
      }
    }
    const hr = {
      hr: {
        icon: 'hr'
      }
    }
    const actions = [trash, share]

    const cleanedAction = getOnlyNeededActions(actions, {})
    expect(cleanedAction).toEqual([trash])

    const actions2 = [trash, hr, share, hr]
    const cleanedAction2 = getOnlyNeededActions(actions2, {})
    expect(cleanedAction2).toEqual([trash])
    const actions3 = [trash, hr, rename, hr]
    const cleanedAction3 = getOnlyNeededActions(actions3, {})
    expect(cleanedAction3).toEqual([trash, hr, rename])
  })
})
