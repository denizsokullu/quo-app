import { combineReducersLoop } from '../../helpers.js';
import { combineReducers } from 'redux';

import { updateSelection } from './reducers/selection';

const user = combineReducersLoop({})
const appMode = combineReducersLoop({})
const selection = combineReducersLoop({
  'COMPONENT_SELECT':updateSelection,
})

const app = combineReducers({
  user,
  appMode,
  selection,
})

export default app
