import { dc } from '../helpers';
import _ from 'underscore';

import { getComponent } from '../../parser/abstractComponent';

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

    return {...state, newSelection:action.payload}
}

function COMPONENT_MOVE(state = {}, action){

        let target = state.newAssets[state.currentPage].components[action.payload.id];

        let style = target.editStates[state.editState].style

        let left = (parseInt(style.left.slice(0,-2)) + action.payload.x) + 'px'
        let top = (parseInt(style.top.slice(0,-2)) + action.payload.y) + 'px'

        let updatedStyle = {...style,left:left,top:top}

        let newTarget = dc(target);

        let newAssets = dc(state.newAssets[state.currentPage].components);

        newTarget.editStates[state.editState].style = updatedStyle

        newAssets[action.payload.id] = newTarget;

        let newAssetsWhole = {...state.newAssets}

        newAssetsWhole[state.currentPage].components = newAssets

        // newNewAssets[state.currentPage] = newComponents

        return {...state, newAssets:newAssetsWhole}

        // //find the id;
        // let id = action.payload.component.id
        // // console.log(id)
        // let newData = dc(state.assets.data)
        //
        // // let newFrame = dc(action.payload.component.frame)
        // // // //update x and y locations
        // // newFrame.x = action.payload.data.x
        // // newFrame.y = action.payload.data.y
        //
        //
        // let editState = state.editState;
        // let newEditStates = dc(action.payload.component.editStates);
        // newEditStates[editState].style.left = action.payload.data.x+'px'
        // newEditStates[editState].style.top = action.payload.data.y+'px'
        //
        // //Place newFrame Data here
        // //Find the component first
        //
        // let allIDs = _.keys(state.assets.data).map(key=>{
        //   let obj = newData[key];
        //   return getComponent(obj,id);
        // })
        //
        // // console.log(allIDs);
        //
        // allIDs = _.reduce(allIDs,(objects,obj)=>{return (typeof obj === 'object' ? obj : objects)},undefined);
        // let componentToUpdate = allIDs;
        //
        // // componentToUpdate.frame = newFrame;
        // componentToUpdate.editStates = newEditStates
        //
        // let updatedAssets = {data:newData}
        //
}

function COMPONENT_RESIZE(state = {}, action){
  //find the id;
  let id = action.payload.component.id

  let newData = dc(state.assets.data)

  let allIDs = _.keys(newData).map(key=>{
    let obj = newData[key];
    return getComponent(obj,id);
  })

  allIDs = _.reduce(allIDs,(objects,obj)=>{return (typeof obj === 'object' ? obj : objects)},undefined);
  let componentToUpdate = allIDs;


  let editState = state.editState;
  //instead of getting the editstates from the selection, find it in the actual component
  let newEditStates = dc(componentToUpdate.editStates);

  //only change if they have a new value
  if(action.payload.data.width){
    newEditStates[editState].style.width = action.payload.data.width+'px'
  }
  else{
    // console.log('width',newEditStates[editState].style.width);
  }
  if(action.payload.data.height){
    newEditStates[editState].style.height = action.payload.data.height+'px'
  }
  else{
    // console.log('height',newEditStates[editState].style.height);
  }

  // componentToUpdate.frame = newFrame;
  componentToUpdate.editStates = newEditStates

  let updatedAssets = {data:newData}

  return {...state,assets:updatedAssets}
}

export {VIEWER_RESIZE, COMPONENT_SELECT, COMPONENT_MOVE, COMPONENT_RESIZE}
