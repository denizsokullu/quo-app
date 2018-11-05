import { getState } from 'quo-redux/state';
import _ from 'lodash';

// mergeActions
//
// given an object with values as objects full of actions,
// flattens the values back into an object.
//
// example: { editorActions : { action1: f(), action2: f()} } =>
// { action1: f(), action2: f() }
//
const mergeActions = (actions) => {
  const actionsInArray = _.flatten(_.map(_.values(actions),_.toPairs));
  return _.zipObject(_.map(actionsInArray, a => a[0]), _.map(actionsInArray, a => a[1]));
}

// Maps the actions to the reducer as input.
const combineReducersLoop = (actions) => {
  return (state = {}, action) => {

    // return if no action types are passed in
    if( !actions ) return state;
    // loop through the action handlers
    // and find the one we need
    for(let type in actions){
      if(type === action.type){
        if(typeof actions[type] !== 'function'){
          throw new Error(`Action handler for ${type} is not a function.`);
        }
        return actions[type](state,action);
      }
    }

    // if the action doesn't match existing handlers, return
    // initial state.
    return state;

  }
}

const getSelectionFirstID = (state,app) => {
  if(!app && state) app = getState(state,'app');
  let selection = app.selection
  if(selection.data.length > 0) return selection.data[0];
  return undefined

}

// getPropsOfSelection
// get the state current state props of the selected component on the editor.
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
    //add component id for referencing the component
    pickedProps.id = id;
    return pickedProps
  }

  //Don't return a selection
  return {}

}

// getComponentFromCurrentTab
// return the component from the current tab that is actively visible on the editor
const getComponentFromCurrentTab = (tabs, id) => {
  if(!tabs || !id) return undefined
  let tabRoot = tabs.allTabs[tabs.activeTab]
  let component = tabRoot.components[id]
  return component ? component : undefined
}

// PropCompositor
// EXPLAIN THIS
class PropCompositor {
  static bakeProps(propArr){
    if(propArr.length === 0) return {};
    //combines the props in order from index 0 -> len - 1 and picks the higher index value.
    return propArr.reduce((a,c) => { return _.mergeWith(a,c,(o,n) => n ? n : o)}, {});
  }
}

const getCurrentLinkBuilderMode = (app) => {
  return app.linkBuilder.mode
}

const getLinkBuilder = (app) => {
  return app.linkBuilder
}

export { mergeActions,
         combineReducersLoop,
         getPropsOfSelection,
         getComponentFromCurrentTab,
         PropCompositor,
         getSelectionFirstID,
         getCurrentLinkBuilderMode,
         getLinkBuilder }
