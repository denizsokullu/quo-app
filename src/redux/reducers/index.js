import _ from 'underscore';

import { combineReducers } from 'redux';

import domain from './domain';
import app from './app';
import ui from './ui';

export default combineReducers({
  domain,
  app,
  ui,
})
