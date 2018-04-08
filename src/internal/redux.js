import { createStore } from 'redux';
import sketchParser from './parser';
import _ from 'underscore';
import undoable, { excludeAction } from 'redux-undo'
import { getComponent } from './parser/abstractComponent';

function dc(obj){
  return JSON.parse(JSON.stringify(obj))
}

export const UPLOAD_SKETCH = uploadData => ({
  type: 'UPLOAD_SKETCH',
  payload: uploadData
});

export const COMPONENT_MOVE = component => ({
  type: 'COMPONENT_MOVE',
  payload: component
});

export const KEY_DOWN = keyData => ({
  type:'KEY_DOWN',
  payload: keyData
})

export const COMPONENT_SELECT = component => ({
  type:'COMPONENT_SELECT',
  payload: component
})

export const KEY_UP = keyData => ({
  type:'KEY_UP',
  payload: keyData
})

//
const controller = {
    key:{
      // 'a':false,
      // 'b':false,
    }
  }

const data = {
  assets:{
    // id_counter : 0,
    data:{}
  },
  //write a function to init the keys
  controller:{
    key:{
      // 'a':false,
      // 'b':false,
    }
  },
  selection:{

  }
}

const store_initial = {
  past: [],
  present: data, // (?) How do we initialize the present?
  future: [],
}

export const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'UPLOAD_SKETCH':
      // let id = state.assets.id_counter;
      // let newCounter = state.assets.id_counter + 1;
      let newData = {...state.assets.data}
      let newComponent = sketchParser(action.payload)
      newData[newComponent.id] = newComponent
      let newAssets = {data:newData};
      // console.log(newAssets);
      return {...state, assets:newAssets}

    case 'COMPONENT_SELECT':
      // let id = state.assets.id_counter;
      // let newCounter = state.assets.id_counter + 1;
      let newSelection = action.payload
      // console.log(newAssets);
      return {...state, selection:newSelection}


    case 'COMPONENT_MOVE':

      //find the id;
      let id = action.payload.component.id
      // console.log(id)
      newData = dc(state.assets.data)

      let newFrame = dc(action.payload.component.frame)
      // //update x and y locations
      newFrame.x = action.payload.data.x
      newFrame.y = action.payload.data.y

      //Place newFrame Data here
      //Find the component first

      let allIDs = _.keys(state.assets.data).map(key=>{
        let obj = newData[key];
        return getComponent(obj,id);
      })

      // console.log(allIDs);

      allIDs = _.reduce(allIDs,(objects,obj)=>{return (typeof obj === 'object' ? obj : objects)},undefined);
      let componentToUpdate = allIDs;
      // // console.log(newData);
      // // console.log(componentToUpdate.frame)
      // console.log(state,{...state,assets:updatedAssets})
      componentToUpdate.frame = newFrame;
      let updatedAssets = {data:newData}
      // console.log(componentToUpdate.frame)
      // console.log(newData);
      // console.log(updatedAssets);
      // console.log({...state,assets:updatedAssets},newFrame)
      return {...state,assets:updatedAssets}

    case 'KEY_DOWN':

      let controllerNew = dc(state.controller);
      let currentKey = action.payload.keyCode;
      controllerNew.key[currentKey] = true;
      // console.log(controllerNew);

      return {...state,controller:controllerNew}

    case 'KEY_UP':

      controllerNew = dc(state.controller);
      currentKey = action.payload.keyCode;
      controllerNew.key[currentKey] = false;
      // console.log(controllerNew);

      return {...state,controller:controllerNew}

    default:
      return state;
  }
};

const mainReducer = undoable(reducer,{
  limit:25,
  filter: excludeAction(['KEY_DOWN', 'KEY_UP'])
});

// export const reducers = combineReducers({
//   handleUpload,
// });
//
//

// store.js
export function configureStore(initialState = {}) {
  const store = createStore(
    mainReducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
  return store;
};

export const store = configureStore(store_initial);
