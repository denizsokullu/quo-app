import { combineReducers } from 'redux';

import { combineReducersLoop } from '../../helpers';

import { updateTab, resizeSidebar } from './sidebars.js';
import { addMessage, removeMessage } from './messages.js';

const controller = (state = {}, action) => { return state };

const sidebars = combineReducersLoop({
  'UPDATE_SIDEBAR_TAB':updateTab,
  'RESIZE_SIDEBAR':resizeSidebar,
})

const messages = combineReducersLoop({
  'ADD_MESSAGE':addMessage,
  'REMOVE_MESSAGE':removeMessage,
})

const ui = combineReducers({
  controller,
  sidebars,
  messages,
})

export default ui
