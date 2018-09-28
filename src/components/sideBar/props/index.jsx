import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, DropdownCard } from '../../card';

import { ADD_MESSAGE } from '../../../redux/actions';

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
    return (
      <div className='props-tab-wrapper'>
        <ComponentStates/>
        <PropCards.Position/>
        <PropCards.Size/>
      </div>
    )
  }
}

PropsTab = connect()(PropsTab);

export default PropsTab
