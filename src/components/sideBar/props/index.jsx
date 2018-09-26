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

// import MiniPreview from '../miniPreview/miniPreview';

//structure of the right sidebar
//select source component
//select action that will connect them
//select target component
//

class PropsTab extends Component {
  render(){
    return (
      <div className='props-tab-wrapper'>
        <ComponentStates/>
        <Position/>
        <Size/>
        {/* <Card collapsed title='Primary Element'/>
        <DropdownCard
          title='Action'
          defaultValue={actionValues[0]}
          options={actionValues}
          lineIndices={actionLineIndices}
          onChange={(value)=>{
            const { dispatch } = this.props;
            dispatch(ADD_MESSAGE({type:status,text:`Selected '${value}' as the option`,duration:6000}))
          }}
        />
        <Card collapsed title='Linked Element'/>
        <DropdownCard
          title='Action'
          defaultValue={action2Values[0]}
          options={action2Values}
          lineIndices={action2LineIndices}
          onChange={(value)=>{
            const { dispatch } = this.props;
            dispatch(ADD_MESSAGE({type:status,text:`Selected '${value}' as the option`,duration:1500}))
          }}
        /> */}
      </div>
    )
  }
}

PropsTab = connect()(PropsTab);

export default PropsTab
