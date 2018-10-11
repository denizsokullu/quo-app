const NEW_TAB = (data) => ({
  type: 'NEW_TAB',
  payload: data
})

const CHANGE_ACTIVE_TAB = (data) => ({
  type:'CHANGE_ACTIVE_TAB',
  payload: data,
})

const DELETE_TAB = () => ({
  type: 'DELETE_TAB'
})

export default {
  NEW_TAB,
  CHANGE_ACTIVE_TAB,
  DELETE_TAB
}
