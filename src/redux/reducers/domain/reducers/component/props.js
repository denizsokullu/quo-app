import { getComponentFromCurrentTab, getCurrentState, PropCompositor } from 'quo-redux/helpers';
import _ from 'lodash';

export const updateComponentProps = (tabs,action) => {

  //no component specified
  if(!action.payload.id) return tabs;

  //no prop update specified
  if(!action.payload.props) return tabs;

  //MOVE THE SELECTED STATE TO UI, and have a parameter for the component.state.current

  let id = action.payload.id;
  let propsToUpdate = action.payload.props;

  console.log('got here somehow')

  let component = getComponentFromCurrentTab(tabs,id);

  let states = component.state.states;
  //CHANGE THIS LMAO
  let selectedState = _.keys(states)[2];
  let sourceProps = states[selectedState].props;
  states[selectedState].props = _.mergeWith(sourceProps,propsToUpdate, (s,n) => n);
  let composite = states.composite;
  let index = composite.modifiers.indexOf(selectedState)
  if(index === -1){
    composite.modifiers.push(selectedState);
  }
  if(_.isEmpty(sourceProps)){
    //if its a composite modifier but empty, remove it
    if(index !== -1){
      composite.modifiers.splice(index, 1);
    }
  }
  else {
    //update the props to reflect the new
    // console.log(composite.modifiers.map(v => states[v]));
    composite.props = PropCompositor.bakeProps(composite.modifiers.map(v => states[v].props))
  }
  return _.cloneDeep(tabs);

}
// state
// main state
// current state is a merge of
//
