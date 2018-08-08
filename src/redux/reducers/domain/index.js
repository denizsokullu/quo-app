import { combineReducersLoop } from '../../helpers.js';
import { combineReducers } from 'redux';
import { uploadSketch, uploadImage } from './reducers/upload';
import { newTab, changeActiveTab, editTab, deleteTab } from './reducers/tabs';
import { addComponent, removeComponent } from './reducers/component/component';
import { addLink, removeLink, updateLink } from './reducers/component/links';

const assets = combineReducersLoop({
  'UPLOAD_SKETCH':uploadSketch,
  'UPLOAD_IMAGE':uploadImage,
});

const components = combineReducersLoop({

})

const projects = combineReducersLoop({

})

const tabs = combineReducersLoop({
  'NEW_TAB':newTab,
  'CHANGE_ACTIVE_TAB':changeActiveTab,
  'EDIT_TAB':editTab,
  'DELETE_TAB':deleteTab,
  'ADD_COMPONENT_TO_TAB':addComponent,
  'REMOVE_COMPONENT':removeComponent,
  'ADD_LINK':addLink,
  'REMOVE_LINK':removeLink,
  'UPDATE_LINK':updateLink,
})

const domain = combineReducers({
  assets,
  components,
  projects,
  tabs,
})

export default domain
