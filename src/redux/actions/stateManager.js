const STATE_MANAGER_UPDATE = (component) => ({
  type:'STATE_MANAGER_UPDATE',
  payload: component
});

const SET_APP_MODE = (payload) => ({
  type:'SET_APP_MODE',
  payload: payload
})

export default {
  STATE_MANAGER_UPDATE,
  SET_APP_MODE
}
