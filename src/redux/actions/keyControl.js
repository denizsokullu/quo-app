const KEY_DOWN = keyData => ({
  type:'KEY_DOWN',
  payload: keyData
})

const KEY_UP = keyData => ({
  type:'KEY_UP',
  payload: keyData
})

export default {
  KEY_DOWN,
  KEY_UP
}
