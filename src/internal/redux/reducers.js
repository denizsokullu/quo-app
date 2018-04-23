import _ from 'underscore';

//Parser imports
import { getComponent } from '../parser/abstractComponent';

import { UPLOAD_SKETCH } from './reducers/uploadSketch';
import { COMPONENT_SELECT, COMPONENT_MOVE, COMPONENT_RESIZE } from './reducers/component';
import { KEY_UP, KEY_DOWN } from './reducers/keyControls';

import { dc } from './helpers';

function reducer(state = {}, action){
  switch (action.type) {
    case 'UPLOAD_SKETCH':
      return UPLOAD_SKETCH(state,action);

    case 'COMPONENT_SELECT':
      return COMPONENT_SELECT(state,action);

    case 'COMPONENT_MOVE':
      return COMPONENT_MOVE(state,action);

    case 'COMPONENT_RESIZE':
      return COMPONENT_RESIZE(state,action);

    case 'KEY_DOWN':
      return KEY_DOWN(state,action);

    case 'KEY_UP':
      return KEY_UP(state,action);

    case 'EDIT_STATE_CHANGE':
      return {...state, editState:action.payload}

    default:
      return state;
  }
};


export { reducer }
