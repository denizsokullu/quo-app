import { combineReducersLoop } from '../../helpers.js';
import { combineReducers } from 'redux';
import { uploadSketch, uploadImage } from './upload.js';
import { newTab, editTab, deleteTab } from './tabs.js';

const assets = combineReducersLoop({
  'UPLOAD_SKETCH':uploadSketch,
  'UPLOAD_IMAGE':uploadImage,
});

const components = combineReducersLoop({
  'UPLOAD_SKETCH':uploadSketch,
})

const projects = combineReducersLoop({})



const tabs = combineReducersLoop({
  'NEW_TAB':newTab,
  'EDIT_TAB':editTab,
  'DELETE_TAB':deleteTab,
})

const domain = combineReducers({
  assets,
  components,
  projects,
  tabs,
})

export default domain
