import { dc } from '../helpers';
import _ from 'underscore';

import { getComponent } from '../../parser/abstractComponent';

function COMPONENT_SELECT(state = {}, action){

    let oldSelection;
    let newSelection;
    // let newAssets = dc(state.newAssets[state.currentPage]);

    //if something is selected before, unselect it.
    if(state.newSelection != ''){
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

        //find the id;
        let id = action.payload.component.id
        // console.log(id)
        let newData = dc(state.assets.data)

        // let newFrame = dc(action.payload.component.frame)
        // // //update x and y locations
        // newFrame.x = action.payload.data.x
        // newFrame.y = action.payload.data.y


        let editState = state.editState;
        let newEditStates = dc(action.payload.component.editStates);
        newEditStates[editState].style.left = action.payload.data.x+'px'
        newEditStates[editState].style.top = action.payload.data.y+'px'



        //Place newFrame Data here
        //Find the component first

        let allIDs = _.keys(state.assets.data).map(key=>{
          let obj = newData[key];
          return getComponent(obj,id);
        })

        // console.log(allIDs);

        allIDs = _.reduce(allIDs,(objects,obj)=>{return (typeof obj === 'object' ? obj : objects)},undefined);
        let componentToUpdate = allIDs;

        // componentToUpdate.frame = newFrame;
        componentToUpdate.editStates = newEditStates

        let updatedAssets = {data:newData}

        return {...state,assets:updatedAssets}
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

export {COMPONENT_SELECT, COMPONENT_MOVE, COMPONENT_RESIZE}
