const initialState = {
  loggedIn: false
}

export const mobile = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGGED_IN':
      return {loggedIn: true}
  }
  return state
}
