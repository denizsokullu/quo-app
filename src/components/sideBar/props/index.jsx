import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, DropdownCard } from '../../card';

import { ADD_MESSAGE } from 'quo-redux/actions';

//Debug imports
import _ from 'lodash';
import { getState } from 'quo-redux/state';
import { getComponentFromCurrentTab, getSelectionFirstID } from 'quo-redux/helpers';
import HorizontalOptionGroup from '../../inputElements/horizontalOptionGroup';
//

// Import all the cards

import ComponentStates from '../../componentStates/componentStates';

import { ButtonCore } from '../../buttons/buttons';
import Fill from '../../styleCard/fill/fill';
import Border from '../../styleCard/border/border';
import Shadow from '../../styleCard/shadow/shadow';
import Blur from '../../styleCard/blur/blur';
import Scale from '../../styleCard/scale/scale';
import Position from '../../styleCard/position/position';
import Size from '../../styleCard/size/size';
import CopyState from '../../styleCard/copyState/copyState';
import Movement from '../../styleCard/movement/movement';
import PropCards from '../../propCards';

class PropsTab extends Component {

  render(){
    console.log(this.props.stateOptions)
    return (
      <div className='props-tab-wrapper'>
        {/* <ComponentStates/> */}
          <HorizontalOptionGroup
            options={this.props.stateOptions}
          />
        <PropCards.Position/>
        <PropCards.Size/>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  // stateOptions is the array of states that are being 
  // composited to create the props of the component that is selected
  let domain = getState(state,'domain');
  let component = getComponentFromCurrentTab(domain.tabs,getSelectionFirstID(state));
  if(!component) return {stateOptions:[]};
  let stateModifiers = component.state.states.composite.modifiers
  let stateOptions = _.remove(_.keys(component.state.states),(e)=> e !== 'composite')
  stateOptions = stateOptions.map(e => { return {
    text:e,
    selected:!!(stateModifiers.includes(e))
  }})
  return {
    stateOptions
  }
}

PropsTab = connect(mapStateToProps)(PropsTab);

export default PropsTab
