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
    const options = this.props.states.map(e => { return { text:e} });
    return (
      <div className='props-tab-wrapper'>
        {/* <ComponentStates/> */}
          <HorizontalOptionGroup
            options={options}
            selectedOptions={this.props.stateModifiers}
          />
        <PropCards.Position/>
        <PropCards.Size/>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  let domain = getState(state,'domain');
  let component = getComponentFromCurrentTab(domain.tabs,getSelectionFirstID(state));
  if(!component) return {states:[]};
  return {
    states:_.remove(_.keys(component.state.states),(e)=> e !== 'composite'),
    stateModifiers:component.state.states.composite.modifiers
  }
}

PropsTab = connect(mapStateToProps)(PropsTab);

export default PropsTab
