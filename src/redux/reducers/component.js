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
    }

    //if the new selection is selecting something
    if(action.payload !== ''){
      newSelection = dc(state.newAssets[state.currentPage].components[action.payload]);
      newSelection.interactions.clicked = true;
      state.newAssets[state.currentPage].components[action.payload] = newSelection;
    }

    if(action.payload === ''){
      return {...state, newSelection:action.payload, editState:'none'}
    }

    return {...state, newSelection:action.payload}
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

function COMPONENT_BOXSHADOW(state = {}, action){

  // let target = dc(state.newAssets[state.currentPage].components[action.payload.id]);
  //
  // let style = target.editStates[state.editState].style
  //
  // let x = (parseInt(style.width.slice(0,-2)) + parseInt(action.payload.w)) + 'px'
  // let y = (parseInt(style.height.slice(0,-2)) + parseInt(action.payload.h)) + 'px'
  // let blur = (parseInt(style.height.slice(0,-2)) + parseInt(action.payload.h)) + 'px'
  // let spread = (parseInt(style.height.slice(0,-2)) + parseInt(action.payload.h)) + 'px'
  // let color =
  //
  // let updatedStyle = {...style,width:width,height:height}
  //
  // let newAssets = dc(state.newAssets[state.currentPage].components);
  //
  // target.editStates[state.editState].style = updatedStyle
  //
  // newAssets[action.payload.id] = target;
  //
  // let newAssetsWhole = {...state.newAssets}
  //
  // newAssetsWhole[state.currentPage].components = newAssets
  //
  // return {...state, newAssets:newAssetsWhole}

  return state
}

function COMPONENT_STYLE_CHANGE(state = {}, action){

  let component = dc(state.newAssets[state.currentPage].components[action.payload.payload.id]);

  let newStyle = component.editStates[state.editState].style;

  console.log(component.editStates.none.style.backgroundColor);

  if(action.type === 'BG_COLOR'){

    action.payload = action.payload.payload;
    action.payload.component = component

    newStyle = StyleChangeReducer.BG_COLOR(state,action);

  }

  if(action.type === 'BOX_SHADOW'){

    action.payload = action.payload.payload;
    action.payload.component = component

    newStyle = StyleChangeReducer.BOX_SHADOW(state,action);

  }


  component.editStates[state.editState].style = newStyle

  let newComponents = dc(state.newAssets[state.currentPage].components)

  newComponents[action.payload.id] = component

  let newAssetsWhole = dc(state.newAssets)

  newAssetsWhole[state.currentPage].components = newComponents;

  return {...state, newAssets:newAssetsWhole}

}



export {VIEWER_RESIZE, COMPONENT_SELECT, COMPONENT_MOVE, COMPONENT_RESIZE, COMPONENT_BOXSHADOW, COMPONENT_STYLE_CHANGE}
