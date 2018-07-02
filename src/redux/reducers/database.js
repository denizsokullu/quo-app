import { firebase } from '../../firebase';

import { dc } from '../helpers';

const getPage = (state,id) => {
  return state.newAssets[id];
}

const PUSH_PROJECT = (state,action) => {

  let pageId = action.payload.id;
  let pageObj = getPage(state,pageId);
  firebase.database.ref('/projects').push(state.newAssets);
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
  newState.editState = 'none';
  newState.currentPage = '';

  return { ...newState }

}

const DATABASE_ACTION = (state,action) => {

  let type = action.payload.type;
  let payload = action.payload.payload;
  let newAction = {type:type,payload:payload}

  console.log(newAction)

  switch (type) {

    case 'PUSH_PROJECT':
      return PUSH_PROJECT(state,newAction);
    case 'PULL_PROJECT_ASYNC':
      return PULL_PROJECT_ASYNC(state,newAction);
    case 'UPDATE_PROJECT':
      return UPDATE_PROJECT(state,newAction);
    case 'CLEAR_VIEWER':
      return CLEAR_VIEWER(state,newAction);
    default:
      return state;

  }

}

export { DATABASE_ACTION }
