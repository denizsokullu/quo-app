import { createStore } from 'redux';
import undoable, { excludeAction } from 'redux-undo';

//Redux imports
import { store_initial } from './state';
import { reducer } from './reducers.js';

const mainReducer = undoable(reducer,{
  limit:25,
  filter: excludeAction(['KEY_DOWN', 'KEY_UP', 'COMPONENT_SELECT'])
});

// store.js
function configureStore(initialState = {}) {
  const store = createStore(
    mainReducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
  return store;
};

export const store = configureStore(store_initial);
