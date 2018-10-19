import { combineReducersLoop } from '../../helpers.js';
import { combineReducers } from 'redux';

import { updateSelection } from './reducers/selection';
import { updateLinkBuilderData } from './reducers/links';

const user = combineReducersLoop({})
const appMode = combineReducersLoop({})
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
