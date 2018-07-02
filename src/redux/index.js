import { createStore, applyMiddleware, compose } from 'redux';
import undoable, { excludeAction } from 'redux-undo';

import thunk from 'redux-thunk';

//Redux imports
import { store_initial } from './state';
import { reducer } from './reducers.js';

import { routerReducer, routerMiddleware } from 'react-router-redux';

import { combineReducers } from 'redux';
import { createBrowserHistory } from 'history';


const mainReducer = undoable(reducer,{
  limit:1,
  filter: excludeAction(['KEY_DOWN', 'KEY_UP', 'COMPONENT_SELECT'])
});

// console.log(    combineReducers(
//       { ...mainReducer , routing:routerReducer }
//     ));

// const combinedReducer = (state,action) => {
//   let mainState = reducer(state,action);
//   mainState.routing = routerReducer(state,action);
//   return mainState
// }

const middleware = routerMiddleware(createBrowserHistory())

// store.js
function configureStore(initialState = {}) {
  const store = createStore(
    mainReducer,
    // combineReducers({
    //     present:reducer,
    //     routing:routerReducer
    //   }),
    initialState,
    compose(
      applyMiddleware(thunk),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    ),

  );
  return store;
};

export const store = configureStore(store_initial);
