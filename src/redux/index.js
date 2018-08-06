import { createStore, applyMiddleware, compose } from 'redux';
import undoable, { excludeAction } from 'redux-undo';
import thunk from 'redux-thunk';
import { store_initial } from './state';
import rootReducer from './reducers/index.js';
import { routerReducer, routerMiddleware } from 'react-router-redux';

export const store = createStore(
  rootReducer,
  store_initial,
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ),

);
