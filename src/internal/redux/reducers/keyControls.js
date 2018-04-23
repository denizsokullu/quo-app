import { dc } from '../helpers';

function KEY_DOWN(state = {}, action){
  let controllerNew = dc(state.controller);
  let currentKey = action.payload.keyCode;
  controllerNew.key[currentKey] = true;
  // console.log(controllerNew);

  return {...state,controller:controllerNew}
}

function KEY_UP(state = {}, action){

  let controllerNew = dc(state.controller);
  let currentKey = action.payload.keyCode;
  controllerNew.key[currentKey] = false;
  // console.log(controllerNew);
  return {...state, controller:controllerNew}

}

export { KEY_DOWN, KEY_UP }
