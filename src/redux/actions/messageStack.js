const ADD_MESSAGE = (message) => ({
  type: 'ADD_MESSAGE',
  payload: message,
})

const REMOVE_MESSAGE = (message) => ({
  type: 'REMOVE_MESSAGE',
  payload: message,
})

export default {
  ADD_MESSAGE,
  REMOVE_MESSAGE
}
