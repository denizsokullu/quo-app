import stateManager from './stateManager';

const UI_COMPONENT_SELECT = (component) => (dispatch,getFullState) => {
  // call the functions to update in here
  dispatch(stateManager.STATE_MANAGER_UPDATE(component));
}

export default {
  UI_COMPONENT_SELECT,
}
