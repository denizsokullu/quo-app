import { dc } from '../helpers';
import _ from 'underscore';

import { getComponent } from '../../parser/abstractComponent';

import * as StyleChangeReducer from './styleChange.js';

function VIEWER_RESIZE(state = {}, action){

  return {...state, viewerZoom:action.payload}

}

function COMPONENT_SELECT(state = {}, action){

    // action.payload is the component_id
    // the id is stored in newSelection
    // and the component that is the newSelection is updated.

    let oldSelection;
    let newSelection;

    //if something is selected before, unselect it.
    if(state.newSelection !== ''){
      oldSelection = dc(state.newAssets[state.currentPage].components[state.newSelection]);
      oldSelection.interactions.clicked = false;
      state.newAssets[state.currentPage].components[state.newSelection] = oldSelection;
      state.selectionSiblings = [];
    }

    //if the new selection is selecting something
    if(action.payload !== ''){
      newSelection = dc(state.newAssets[state.currentPage].components[action.payload]);
      newSelection.interactions.clicked = true;
      state.selectionSiblings = newSelection.siblings;
      state.newAssets[state.currentPage].components[action.payload] = newSelection;
    }

    if(action.payload === ''){
      //reset the editState,selection, and possible textEdit
      if(state.textEdit !== '') {
        return {...state, newSelection:action.payload, editState:'none', textEdit:''}
      }
      else{
          return {...state, newSelection:action.payload}
      }

    }

    return {...state, newSelection:action.payload}

}

function TEXT_EDIT_TRIGGER(state = {}, action){
  //trigger open
  return {...state, textEdit:action.payload, newSelection:''}
}


function COMPONENT_MOVE(state = {}, action){

        let target = state.newAssets[state.currentPage].components[action.payload.id];

        let style = target.editStates[state.editState].style

        let left = (parseInt(style.left.slice(0,-2)) + parseInt(action.payload.x)) + 'px'
        let top = (parseInt(style.top.slice(0,-2)) + parseInt(action.payload.y)) + 'px'

        let updatedStyle = {...style,left:left,top:top}

        let newTarget = dc(target);

        let newAssets = dc(state.newAssets[state.currentPage].components);

        newTarget.editStates[state.editState].style = updatedStyle

        newAssets[action.payload.id] = newTarget;

        let newAssetsWhole = {...state.newAssets}

        newAssetsWhole[state.currentPage].components = newAssets

        // newNewAssets[state.currentPage] = newComponents

        return {...state, newAssets:newAssetsWhole}
}

function COMPONENT_RESIZE(state = {}, action){

  let target = dc(state.newAssets[state.currentPage].components[action.payload.id]);

  let style = target.editStates[state.editState].style

  let width = (parseInt(style.width.slice(0,-2)) + parseInt(action.payload.w)) + 'px'
  let height = (parseInt(style.height.slice(0,-2)) + parseInt(action.payload.h)) + 'px'

  let updatedStyle = {...style,width:width,height:height}

  let newAssets = dc(state.newAssets[state.currentPage].components);

  target.editStates[state.editState].style = updatedStyle

  newAssets[action.payload.id] = target;

  let newAssetsWhole = {...state.newAssets}

  newAssetsWhole[state.currentPage].components = newAssets

  return {...state, newAssets:newAssetsWhole}
}


function COMPONENT_STYLE_CHANGE(state = {}, action){

  let component = getComponentFromState(state,action)

  let newStyle = component.editStates[state.editState].style;

  //replace the payload with the actual style change payload

  action.payload = action.payload.payload;

  // add the component for better use

  action.payload.component = component

  if(action.type === 'BG_COLOR'){

    newStyle = StyleChangeReducer.BG_COLOR(state,action);

  }

  if(action.type === 'FILL_COLOR'){

    newStyle = StyleChangeReducer.FILL_COLOR(state,action);

  }

  if(action.type === 'BOX_SHADOW'){

    newStyle = StyleChangeReducer.BOX_SHADOW(state,action);

  }

  component.editStates[state.editState].style = newStyle

  return addUpdatedComponentToState(state,action,component)

}

function TEXT_STRING_UPDATE(state = {},action){

  let component = getComponentFromStateDirect(state,action)

  let editState = getEditState(component);

  editState.textString = action.payload.textString;

  component = setEditState(component,editState);

  return addUpdatedComponentToState(state,action,component)

}

function getEditState(component){
  return component.editStates[component.editStates.current]
}

function setEditState(component,val){
  component.editStates[component.editStates.current] = val
  return component
}


function getComponentFromState(state,action){

  return dc(state.newAssets[state.currentPage].components[action.payload.payload.id]);

}

function getComponentFromStateDirect(state,action){

  return dc(state.newAssets[state.currentPage].components[action.payload.id]);

}

function addUpdatedComponentToState(state,action,component){

  state.newAssets[state.currentPage].components[action.payload.id] = component
  return {...state}

}



export {VIEWER_RESIZE, COMPONENT_SELECT, COMPONENT_MOVE, COMPONENT_RESIZE, COMPONENT_STYLE_CHANGE, TEXT_EDIT_TRIGGER, TEXT_STRING_UPDATE}
