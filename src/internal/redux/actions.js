export const UPLOAD_SKETCH = uploadData => ({
  type: 'UPLOAD_SKETCH',
  payload: uploadData
});

export const COMPONENT_MOVE = component => ({
  type: 'COMPONENT_MOVE',
  payload: component
});

export const COMPONENT_RESIZE = component => ({
  type: 'COMPONENT_RESIZE',
  payload: component
});

export const KEY_DOWN = keyData => ({
  type:'KEY_DOWN',
  payload: keyData
})

export const COMPONENT_SELECT = component => ({
  type:'COMPONENT_SELECT',
  payload: component
})

export const KEY_UP = keyData => ({
  type:'KEY_UP',
  payload: keyData
})

export const EDIT_STATE_CHANGE = newEditState => ({
  type:'EDIT_STATE_CHANGE',
  payload:newEditState
})
