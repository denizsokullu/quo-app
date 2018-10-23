import { combineReducers } from 'redux';
import { combineReducersLoop } from '../../helpers.js';

import { uploadSketch, uploadImage } from './reducers/upload';
import { newTab, changeActiveTab, editTab, deleteTab } from './reducers/tabs';
// Component Actions
import { addComponent, removeComponent } from './reducers/component/component';
import { updateComponentProps, addStateToComposite, removeStateFromComposite } from './reducers/component/props';
import { setLinkSource, setLinkTarget } from './reducers/component/links';
import { addComponentState } from './reducers/component/states';

const assets = combineReducersLoop({
  'UPLOAD_SKETCH':uploadSketch,
  'UPLOAD_IMAGE':uploadImage,
});

const components = combineReducersLoop({

});

const projects = combineReducersLoop({

});

const tabs = combineReducersLoop({
  'NEW_TAB': newTab,
  'CHANGE_ACTIVE_TAB': changeActiveTab,
  'EDIT_TAB': editTab,
  'DELETE_TAB': deleteTab,
  'ADD_COMPONENT_TO_TAB': addComponent,
  'REMOVE_COMPONENT': removeComponent,
  'UPDATE_COMPONENT_PROPS': updateComponentProps,
  'SET_LINK_SOURCE': setLinkSource,
  'SET_LINK_TARGET': setLinkTarget,
  'ADD_COMPONENT_STATE': addComponentState,
  'ADD_STATE_TO_COMPOSITE': addStateToComposite,
  'REMOVE_STATE_FROM_COMPOSITE': removeStateFromComposite,
});

const domain = combineReducers({
  assets,
  components,
  projects,
  tabs,
});

export default domain
