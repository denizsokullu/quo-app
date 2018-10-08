import { combineReducersLoop } from '../../helpers.js';
import { combineReducers } from 'redux';
import { uploadSketch, uploadImage } from './reducers/upload';
import { newTab, changeActiveTab, editTab, deleteTab } from './reducers/tabs';
import { addComponent, removeComponent } from './reducers/component/component';
import { updateComponentProps } from './reducers/component/props';
import { setLinkSource, setLinkTarget } from './reducers/component/links';

const assets = combineReducersLoop({
  'UPLOAD_SKETCH':uploadSketch,
  'UPLOAD_IMAGE':uploadImage,
});

const components = combineReducersLoop({

})

const projects = combineReducersLoop({

})

const links = combineReducersLoop({
  'SET_LINK_SOURCE': setLinkSource,
  'SET_LINK_TARGET': setLinkTarget,
});

const tabs = combineReducersLoop({
  'NEW_TAB': newTab,
  'CHANGE_ACTIVE_TAB': changeActiveTab,
  'EDIT_TAB': editTab,
  'DELETE_TAB': deleteTab,
  'ADD_COMPONENT_TO_TAB': addComponent,
  'REMOVE_COMPONENT': removeComponent,
  'UPDATE_COMPONENT_PROPS': updateComponentProps,
})

const domain = combineReducers({
  assets,
  components,
  links,
  projects,
  tabs,
})

export default domain
