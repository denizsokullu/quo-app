import { firebase } from '../../firebase';

import { dc } from '../helpers';

const getPage = (state,id) => {
  return state.newAssets[id];
}

const PUSH_PROJECT = (state,action) => {
  //if the newAssets is empty, the push is no-op
  firebase.database.ref('/mainProject').set({...state.newAssets}).then(()=>{console.log('upload completed')});
  // //retrieve the page, and push a ref with the id to the core database
  return state
}

const PULL_PROJECT_ASYNC = (state,action) => {

  let page_id = action.payload.id;
  //retrieve the page, and push a ref with the id to the core database
  return state

}

const UPDATE_PROJECT = (state,action) => {

  return state

}

const CLEAR_VIEWER = (state,action) => {

  let newState = dc(state);

  newState.newAssets = {};
  newState.newSelection = '';
  newState.selectionSiblings = [];
  newState.editState = 'none';
  newState.currentPage = '';
  newState.textEdit = '';

  return { ...newState }

}

const RETRIEVE_COMPONENT_FINISH = (state,action) => {
  if(action.payload.status)   return {...state, previewLink:{received:true,assets:action.payload.payload}};
  return {...state, previewLink:{ received:false, component:null } };
}

const RETRIEVE_MAIN_PROJECT_FINISH = (state,action) => {
  if(action.payload.status) return {...state, newAssets:action.payload.project,currentPage:Object.keys(action.payload.project)[0]};
  return state;
}

const DATABASE_ACTION = (state,action) => {

  let type = action.payload.type;
  let payload = action.payload.payload;
  let newAction = {type:type,payload:payload}

  switch (type) {

    case 'PUSH_PROJECT':
      return PUSH_PROJECT(state,newAction);
    case 'PULL_PROJECT_ASYNC':
      return PULL_PROJECT_ASYNC(state,newAction);
    case 'UPDATE_PROJECT':
      return UPDATE_PROJECT(state,newAction);
    case 'CLEAR_VIEWER':
      return CLEAR_VIEWER(state,newAction);
    case 'RETRIEVE_COMPONENT_FINISH':
      return RETRIEVE_COMPONENT_FINISH(state,newAction)
    case 'RETRIEVE_MAIN_PROJECT_FINISH':
      return RETRIEVE_MAIN_PROJECT_FINISH(state,newAction)
    default:
      return state;

  }

}

export { DATABASE_ACTION }
