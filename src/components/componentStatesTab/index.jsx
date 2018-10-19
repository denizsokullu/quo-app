import React from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';
import { getState } from 'quo-redux/state';
import { getComponentFromCurrentTab, getSelectionFirstID } from 'quo-redux/helpers';
import HorizontalOptionGroup from 'ui-components/inputElements/horizontalOptionGroup';

class ComponentStatesTab extends React.Component {
  render(){
    return(
      <HorizontalOptionGroup
        options={this.props.stateOptions}
      />
    )
  }
}

const mapStateToProps = (state) => {
  // stateOptions is the array of states that are being
  // composited to create the props of the component that is selected
  let domain = getState(state,'domain');
  let component = getComponentFromCurrentTab(domain.tabs,getSelectionFirstID(state));
  if(!component) return { stateOptions:[] };
  let stateModifiers = component.state.states.composite.modifiers;
  let ids = (_.remove(_.keys(component.state.states),(e)=> e !== 'composite'))
  let stateOptions = ids.map((id)=> component.state.states[id])
  console.log(stateOptions)
  stateOptions = stateOptions.map(e => { return {
    text:e.title,
    selected:!!(stateModifiers.includes(e.id))
  }})
  return {
    stateOptions
  }
}


export default connect(mapStateToProps)(ComponentStatesTab);
