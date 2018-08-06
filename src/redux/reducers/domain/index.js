import { combineReducersLoop } from '../../helpers.js';
import { combineReducers } from 'redux';
import { uploadSketch, uploadImage } from './reducers/upload';
import { newTab, editTab, deleteTab } from './reducers/tabs';
import { addComponent, removeComponent } from './reducers/component'

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
  'EDIT_TAB':editTab,
  'DELETE_TAB':deleteTab,
  'ADD_COMPONENT':addComponent,
  'REMOVE_COMPONENT':removeComponent,
  // 'COMPONENT_PROPERTY_CHANGE':(s,a)=>return
})

const domain = combineReducers({
  assets,
  components,
  projects,
  tabs,
})

export default domain
