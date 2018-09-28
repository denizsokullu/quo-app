import { combineReducers } from 'redux';
import { assetsReducer, componentReducer, projectsReducer } from './reducers/domain';
import { appModeReducer, selectionReducer } from './reducers/app';
import { controllerReducer } from './reducers/ui';

const domainReducer = combineReducers({
  assets:assetsReducer,
  components:componentsReducer,
  projects:projectsReducer,
})

const appReducer = combineReducers({
  appMode:appModeReducer,
  selection:selectionReducer,
})

const uiReducer = combineReducers({
  controller:controllerReducer,
})

export default combineReducers({
  domain:domainReducer,
  app:appReducer,
  ui:uiReducer,
})
