import { combineReducersLoop } from '../../helpers.js';
import { combineReducers } from 'redux';

const user = combineReducersLoop({})
const appMode = combineReducersLoop({})
const selection = combineReducersLoop({})



const app = combineReducers({
  user,
  appMode,
  selection,
})

export default app
