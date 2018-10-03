import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, DropdownCard } from '../../card';

import { ADD_MESSAGE } from 'quo-redux/actions';

// Import all the cards

import ComponentStatesTab from 'ui-components/componentStatesTab';
import PropCards from 'ui-components/propCards';

class PropsTab extends Component {

  render(){
    return (
      <div className='props-tab-wrapper'>
        <ComponentStatesTab/>
        <PropCards.Position/>
        <PropCards.Size/>
      </div>
    )
  }
}

PropsTab = connect()(PropsTab);

export default PropsTab
