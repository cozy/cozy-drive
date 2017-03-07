export const REVOKE = 'REVOKE'
export const UNREVOKE = 'UNREVOKE'

export const revokeClient = () => ({ type: REVOKE })
export const unrevokeClient = () => ({ type: UNREVOKE })
