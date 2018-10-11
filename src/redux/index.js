import { createStore, applyMiddleware, compose } from 'redux';
import undoable, { excludeAction } from 'redux-undo';
import thunk from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';

import { storeInitial } from './state';
import rootReducer from './reducers';

let store;

export default store = createStore(
  rootReducer,
  storeInitial,
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f,
  ),

);
