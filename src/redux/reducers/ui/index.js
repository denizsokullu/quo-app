import { combineReducers } from 'redux';

import { combineReducersLoop } from '../../helpers';

import { updateTab, resizeSidebar } from './sidebars.js';

const controller = (state = {}, action) => { return state };

console.log(resizeSidebar)

const sidebars = combineReducersLoop({
  'UPDATE_SIDEBAR_TAB':updateTab,
  'RESIZE_SIDEBAR':resizeSidebar,
})

const ui = combineReducers({
  controller,
  sidebars,
})

export default ui
