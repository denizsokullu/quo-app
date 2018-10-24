import { combineReducersLoop } from '../../helpers.js';
import { combineReducers } from 'redux';

import { updateSelection } from './reducers/selection';
import { updateLinkBuilderData } from './reducers/links';

const user = combineReducersLoop({})
const appMode = combineReducersLoop({
  'SET_APP_MODE': (appMode, action) => action.payload
})
const selection = combineReducersLoop({
  'COMPONENT_SELECT':updateSelection,
})
const linkBuilder = combineReducersLoop({
  'UPDATE_LINK_BUILDER_DATA': updateLinkBuilderData,
});

const app = combineReducers({
  user,
  appMode,
  selection,
  linkBuilder
})

export default app
