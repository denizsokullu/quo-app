import { getComponentFromCurrentTab, getCurrentState, PropCompositor } from 'quo-redux/helpers';
import _ from 'lodash';

export const updateComponentProps = (tabs,action) => {
  // no component specified
  if(!action.payload.id) return tabs;

  // no prop update specified
  if(!action.payload.props) return tabs;

  // MOVE THE SELECTED STATE TO UI, and have a parameter for the component.state.current

  let id = action.payload.id;
  let propsToUpdate = action.payload.props;

  let component = getComponentFromCurrentTab(tabs,id);

  let states = component.state.states;
  // CHANGE THIS LMAO
  let selectedState = _.keys(states)[2];
  // ABOVE

  // merge the new properties with the existing properties
  let sourceProps = states[selectedState].props;
  states[selectedState].props = _.mergeWith(sourceProps,propsToUpdate, (s,n) => n);

  // add the property to the composite
  // states.composite = addStateToCompositeHelper(states, selectedState);
  var t1 = performance.now();

  return _.cloneDeep(tabs);

}

const addStateToCompositeHelper = (states, selectedState) => {
  let composite = states.composite;
  if(!composite.modifiers.includes(selectedState)){
    composite.modifiers.push(selectedState);
  }
  //resort to guarantee execution order
  // composite.modifiers = composite.modifiers.sort( (id1,id2) => {
  //   if(states[id1].order < states[id2].order) return -1;
  //   else if(states[id1].order > states[id2].order) return 1;
  //   return 0;
  // })
  // if(_.isEmpty(states[selectedState].props)){
  //   //if its a composite modifier but empty, remove it
  //   if(index !== -1){
  //     composite.modifiers.splice(index, 1);
  //   }
  // }
  // else {
    //update the props to reflect the new
    // console.log(composite.modifiers.map(v => states[v]));
  composite.props = PropCompositor.bakeProps(composite.modifiers.map(v => states[v].props))
  // }
  return _.cloneDeep(composite);
}

export const addStateToComposite = (tabs, action) => {
  let id = action.payload.id;
  let component = getComponentFromCurrentTab(tabs,id);
  let states = component.state.states;
  let composite = states.composite;
  component.state.states.composite =  addStateToCompositeHelper(states, action.payload.state.id);
  console.log('added',_.cloneDeep(composite.props))
  return _.cloneDeep(tabs);
}

export const removeStateFromComposite = (tabs, action) => {
  let id = action.payload.id;
  let state = action.payload.state;
  let component = getComponentFromCurrentTab(tabs,id);
  let states = component.state.states;
  let composite = states.composite;
  composite.modifiers = _.reject(composite.modifiers, id => id === state.id)
  composite.props = PropCompositor.bakeProps(composite.modifiers.map(v => states[v].props))
  console.log('removed',_.cloneDeep(composite.props))
  return _.cloneDeep(tabs);
}