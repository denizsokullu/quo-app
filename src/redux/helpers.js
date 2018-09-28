import { getState } from './state';
import _ from 'lodash';

const dc = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

const combineReducersLoop = (actions) => {
  return (state = {}, action) => {

    //return if no action types are passed in
    if( !actions ) return state;
    //loop through the action handlers
    //and find the one we need
    for(let type in actions){
      if(type === action.type){
        if(typeof actions[type] !== 'function'){
          throw new Error(`Action handler for ${type} is not a function.`);
        }
        return actions[type](state,action);
      }
    }

    //if the action doesn't match existing handlers, return
    //initial state.
    return state;

  }
}
//props is an array of property names
const getPropsOfSelection = (state, props) => {

  let domain = getState(state,'domain');
  let app = getState(state,'app');

  let selection = app.selection
  let tabRoot = domain.tabs.allTabs[domain.tabs.activeTab]

  //If there is a selection and a single one
  if(selection.data.length === 1){
    let id = selection.data[0]
    let component = tabRoot.components[id];
    let currentState = component.state.current
    let pickedProps = _.pick(component.state.states[currentState].props,props)
    return pickedProps
  }

  //Don't return a selection
  return { }

}

export { dc, combineReducersLoop, getPropsOfSelection }
