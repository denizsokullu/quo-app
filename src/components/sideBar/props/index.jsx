import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, DropdownCard } from '../../card';

import { ADD_MESSAGE } from 'quo-redux/actions';

// Import all the cards

import ComponentStatesDropdown from 'ui-components/componentStatesDropdown';
import PropCards from 'ui-components/propCards';

export default class PropsTab extends Component {
  render(){
    return (
      <div className='props-tab-wrapper'>
        <ComponentStatesDropdown/>
        <PropCards.Position/>
        <PropCards.Size/>
      </div>
    )
  }
}
