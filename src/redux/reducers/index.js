import _ from 'underscore';

//Parser imports
// import { getComponent } from '../parser/abstractComponent';

// import { UPLOAD_SKETCH, UPLOAD_IMAGE } from './reducers/uploadSketch';
// import { VIEWER_RESIZE, COMPONENT_SELECT, COMPONENT_MOVE, COMPONENT_RESIZE, COMPONENT_STYLE_CHANGE, TEXT_EDIT_TRIGGER, TEXT_STRING_UPDATE } from './reducers/component';
// import { KEY_UP, KEY_DOWN } from './reducers/keyControls';
//
// import { DATABASE_ACTION } from './reducers/database';

import { combineReducers } from 'redux';

import domain from './domain';
import app from './app';
import ui from './ui';

export default combineReducers({
  domain,
  app,
  ui,
})

// function reducer(state = {}, action){
//   switch (action.type) {
//
//     case 'UPLOAD_SKETCH':
//       return UPLOAD_SKETCH(state,action);
//
//     // case 'UPLOAD_IMAGE':
//     //   return UPLOAD_IMAGE(state,action);
//     //
//     // case 'VIEWER_RESIZE':
//     //   return VIEWER_RESIZE(state,action);
//     //
//     // case 'COMPONENT_SELECT':
//     //   return COMPONENT_SELECT(state,action);
//     //
//     // case 'COMPONENT_MOVE':
//     //   return COMPONENT_MOVE(state,action);
//     //
//     // case 'COMPONENT_RESIZE':
//     //   return COMPONENT_RESIZE(state,action);
//     //
//     // case 'TEXT_STRING_UPDATE':
//     //   return TEXT_STRING_UPDATE(state,action);
//     //
//     // case 'COMPONENT_STYLE_CHANGE':
//     //   //specify the action type
//     //   action.type = action.payload.type;
//     //   return COMPONENT_STYLE_CHANGE(state,action);
//     //
//     // case 'DATABASE_ACTION':
//     //   return DATABASE_ACTION(state,action);
//     //
//     // case 'TEXT_EDIT_TRIGGER':
//     //   return TEXT_EDIT_TRIGGER(state,action);
//     //
//     // case 'KEY_DOWN':
//     //   return KEY_DOWN(state,action);
//     //
//     // case 'KEY_UP':
//     //   return KEY_UP(state,action);
//     //
//     // case 'EDIT_STATE_CHANGE':
//     //   return {...state, editState:action.payload}
//
//     default:
//       return state;
//   }
// };
