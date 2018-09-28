export const NEW_TAB = (data) => ({
  type: 'NEW_TAB',
  payload: data
})

export const CHANGE_ACTIVE_TAB = (data) => ({
  type:'CHANGE_ACTIVE_TAB',
  payload: data,
})

export const DELETE_TAB = () => ({
  type: 'DELETE_TAB'
})
